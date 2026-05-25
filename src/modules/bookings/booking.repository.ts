import { DataSource, Repository } from "typeorm";
import { Bookings } from "~/modules/bookings/bookings.model";
import { BookingServices } from "~/modules/bookings/booking-services.model";
import { BookingSlots } from "~/modules/bookings/booking-slots.model";
import { SalonServices } from "~/modules/salon-services/salon-services.model";
import { SalonAvailability } from "~/modules/salons/salon-availability.model";
import { Payments } from "~/modules/payments/payments.model";
import { PaymentGatewayLogs } from "~/modules/payments/payment-gateway-logs.model";
import { Settings } from "~/modules/settings/settings.model";
import {
    minutesToTime as minsToTime,
    timeToMinutes as timeToMins,
} from "~/common/utils/time.util";
import {
    slotsNeeded,
    getLockedSlots,
    fitsWithinHours,
    SLOT_INTERVAL_MINS,
} from "~/common/utils/slot.utils";

import { BookingListQuery, CreateBookingBody } from "./booking.types";

export class BookingRepository {

    constructor(
        private dataSource: DataSource,
        private bookingRepo: Repository<Bookings>,
        private bookingServicesRepo: Repository<BookingServices>,
        private bookingSlotsRepo: Repository<BookingSlots>,
        private salonServiceRepo: Repository<SalonServices>,
        private availabilityRepo: Repository<SalonAvailability>,
        private paymentsRepo: Repository<Payments>,
        private paymentLogsRepo: Repository<PaymentGatewayLogs>,
        private settingsRepo: Repository<Settings>,
    ) { }

    //
    // LIST BOOKINGS
    //

    async findAll(
        query: BookingListQuery
    ) {

        const qb =
            this.bookingRepo
                .createQueryBuilder(
                    "booking"
                )

                .leftJoinAndSelect(
                    "booking.customer",
                    "customer"
                )

                .leftJoinAndSelect(
                    "booking.salon",
                    "salon"
                )

                .leftJoinAndSelect(
                    "booking.booking_services",
                    "booking_services"
                )

                .leftJoinAndSelect(
                    "booking_services.service",
                    "service"
                )

                .leftJoinAndSelect(
                    "booking.payments",
                    "payments"
                );

        //
        // SEARCH
        //

        if (query.search) {

            qb.andWhere(
                `
                customer.name ILIKE :search
                OR salon.name ILIKE :search
            `,
                {
                    search:
                        `%${query.search}%`,
                }
            );
        }

        //
        // STATUS
        //

        if (query.status) {

            qb.andWhere(
                "booking.status = :status",
                {
                    status:
                        query.status,
                }
            );
        }

        //
        // SALON
        //

        if (query.salon_id) {

            qb.andWhere(
                "salon.id = :salon_id",
                {
                    salon_id:
                        query.salon_id,
                }
            );
        }

        //
        // SORTING
        //

        const sortField =
            query.sort ||
            "booking.created_at";

        const sortOrder =
            query.order ||
            "DESC";

        qb.orderBy(
            sortField,
            sortOrder
        );

        //
        // PAGINATION
        //

        const page =
            query.page || 1;

        const limit =
            query.limit || 10;

        qb.skip(
            (page - 1) * limit
        ).take(limit);

        //
        // EXECUTE
        //

        const [
            bookings,
            total,
        ] = await qb.getManyAndCount();

        return {
            bookings,
            total,
        };
    }

    //
    // FIND BY ID
    //

    async findById(id: number) {

        return this.bookingRepo.findOne({

            where: {
                id,
            },

            relations: {

                customer: true,

                salon: {
                    address: true,
                },

                preferred_barber: {
                    user: true,
                },

                booking_services: {
                    service: true,
                },

                payments: true,
            },
        });
    }


    // ── Get Stripe secret from settings table ─────────────────────────────────

    async getStripeSecret(): Promise<string> {
        const row = await this.settingsRepo.findOne({
            where: { key: "stripe_secret_key" },
        });
        if (!row?.value) throw new Error("Stripe secret key not configured in settings");
        return row.value;
    }

    async getStripePublishable(): Promise<string> {
        const row = await this.settingsRepo.findOne({
            where: { key: "stripe_publishable_key" },
        });
        if (!row?.value) throw new Error("Stripe publishable key not configured in settings");
        return row.value;
    }

    // ── Validate services belong to salon and are active ──────────────────────

    async validateServices(salonId: number, serviceIds: number[]) {
        const services = await this.salonServiceRepo.find({
            where: serviceIds.map(id => ({ id, salon: { id: salonId }, status: true })),
            relations: { service: true },
        });

        if (services.length !== serviceIds.length) {
            throw new Error("One or more services are invalid or inactive");
        }
        return services;
    }

    // ── Get day availability ──────────────────────────────────────────────────

    async getDayAvailability(salonId: number, date: string) {
        const dayName = new Date(date + "T00:00:00")
            .toLocaleDateString("en-US", { weekday: "long" });

        const avail = await this.availabilityRepo.findOne({
            where: { salon: { id: salonId }, day_of_week: dayName },
        });

        if (!avail || avail.is_closed) {
            throw new Error("Salon is closed on this day");
        }
        return avail;
    }

    // ── Check slot capacity ───────────────────────────────────────────────────

    async checkSlotCapacity(
        salonId: number,
        date: string,
        startTime: string,
        totalDuration: number,
        capacity: number,
    ) {
        const needed = slotsNeeded(totalDuration, SLOT_INTERVAL_MINS);
        const requiredSlots = getLockedSlots(startTime, needed, SLOT_INTERVAL_MINS);

        for (const slot of requiredSlots) {
            const count = await this.bookingSlotsRepo
                .createQueryBuilder("bs")
                .innerJoin("bs.booking", "booking")
                .where("bs.salon_id = :salonId", { salonId })
                .andWhere("bs.slot_date = :date", { date })
                .andWhere("bs.start_time = :slot", { slot: slot + ":00" })
                .andWhere("booking.status IN (:...s)", { s: ["pending", "confirmed"] })
                .getCount();

            if (count >= capacity) {
                throw new Error(`Slot ${slot} is fully booked`);
            }
        }

        return { needed, requiredSlots };
    }

    // ── CREATE BOOKING (status = pending, awaiting payment) ───────────────────

    async createPendingBooking(
        customerId: number,
        body: CreateBookingBody,
    ) {
        return this.dataSource.transaction(async (manager) => {

            // 1. Validate
            const services = await this.validateServices(body.salon_id, body.service_ids);
            const avail = await this.getDayAvailability(body.salon_id, body.date);

            const totalPrice = services.reduce((s, sv) => s + Number(sv.price), 0);
            const totalDuration = services.reduce((s, sv) => s + Number(sv.duration), 0);

            // 2. Check capacity
            const { needed, requiredSlots } = await this.checkSlotCapacity(
                body.salon_id, body.date, body.start_time, totalDuration, avail.capacity
            );

            // 3. Create booking record
            const booking = manager.create(Bookings, {
                customer: { id: customerId },
                salon: { id: body.salon_id },
                total_price: totalPrice,
                total_duration: totalDuration,
                status: "pending",
            });
            const savedBooking = await manager.save(Bookings, booking);

            // 4. Create booking_services rows
            const bookingServices = services.map(svc =>
                manager.create(BookingServices, {
                    booking: { id: savedBooking.id },
                    service: { id: svc.service.id },
                    price: svc.price,
                    duration: svc.duration,
                })
            );
            await manager.save(BookingServices, bookingServices);

            // 5. Create booking_slots rows
            const slotRows = requiredSlots.map((slot, idx) => {
                const startMins = timeToMins(slot);
                const endMins = startMins + SLOT_INTERVAL_MINS;
                return manager.create(BookingSlots, {
                    booking: { id: savedBooking.id },
                    salon: { id: body.salon_id },
                    slot_date: body.date,
                    start_time: slot,
                    end_time: minsToTime(endMins),
                });
            });
            await manager.save(BookingSlots, slotRows);

            // 6. Create pending payment record
            const payment = manager.create(Payments, {
                booking: { id: savedBooking.id },
                amount: totalPrice,
                commission: 0,
                net_amount: totalPrice,
                status: "pending",
                transaction_status: "pending",
            });
            const savedPayment = await manager.save(Payments, payment);

            return {
                booking: savedBooking,
                payment: savedPayment,
                totalPrice,
                totalDuration,
            };
        });
    }

    // ── CONFIRM PAYMENT ───────────────────────────────────────────────────────

    async confirmPayment(
        bookingId: number,
        paymentIntentId: string,
        gatewayStatus: "paid" | "failed",
        rawResponse: string,
    ) {
        return this.dataSource.transaction(async (manager) => {

            // 1. Get booking + payment
            const booking = await manager.findOne(Bookings, {
                where: { id: bookingId },
                relations: { payments: true },
            });
            if (!booking) throw new Error("Booking not found");

            const payment = booking.payments?.[0];
            if (!payment) throw new Error("Payment record not found");

            const newBookingStatus = gatewayStatus === "paid" ? "confirmed" : "cancelled";
            const newPaymentStatus = gatewayStatus === "paid" ? "paid" : "failed";

            // 2. Update booking status
            await manager.update(Bookings, bookingId, {
                status: newBookingStatus,
            });

            // 3. Update payment record
            await manager.update(Payments, payment.id, {
                status: newPaymentStatus,
                transaction_status: newPaymentStatus,
                transaction_ref: paymentIntentId,
                payment_method: "stripe",
                paid_at: gatewayStatus === "paid" ? new Date() : undefined,
            });

            // 4. Log gateway event
            const log = manager.create(PaymentGatewayLogs, {
                payment: { id: payment.id },
                gateway_name: "stripe",
                gateway_payment_id: paymentIntentId,
                status: gatewayStatus,
                raw_response: rawResponse,
            });
            await manager.save(PaymentGatewayLogs, log);

            return { bookingId, status: newBookingStatus };
        });
    }

    // ── Get booking detail (for success page) ─────────────────────────────────

    async findBookingById(bookingId: number) {
        return this.bookingRepo.findOne({
            where: { id: bookingId },
            relations: {
                salon: true,
                booking_services: { service: true },
                booking_slots: true,
                payments: true,
            },
        });
    }


    async findByCustomer(
        customerId: number,
        page: number = 1,
        limit: number = 10,
        status?: string,
    ) {
        const skip = (page - 1) * limit;

        const qb = this.bookingRepo
            .createQueryBuilder("booking")
            .leftJoinAndSelect("booking.salon", "salon")
            .leftJoinAndSelect("salon.address", "address")
            .leftJoinAndSelect("salon.images", "images")
            .leftJoinAndSelect("booking.booking_services", "booking_services")
            .leftJoinAndSelect("booking_services.service", "service")
            .leftJoinAndSelect("booking.booking_slots", "booking_slots")
            .leftJoinAndSelect("booking.payments", "payments")
            .where("booking.customer_id = :customerId", { customerId })
            .orderBy("booking.created_at", "DESC")
            .skip(skip)
            .take(limit);

        if (status) {
            qb.andWhere("booking.status = :status", { status });
        }

        const [items, total] = await qb.getManyAndCount();

        return {
            items,
            pagination: {
                page,
                limit,
                total,
                total_pages: Math.ceil(total / limit),
            },
        };
    }

    // ── Cancel booking ────────────────────────────────────────────────────────────

    async cancelBooking(bookingId: number, customerId: number) {
        const booking = await this.bookingRepo.findOne({
            where: { id: bookingId, customer: { id: customerId } },
            relations: { payments: true },
        });

        if (!booking) throw new Error("Booking not found");

        if (!["pending", "confirmed"].includes(booking.status)) {
            throw new Error("Only pending or confirmed bookings can be cancelled");
        }

        await this.bookingRepo.update(bookingId, {
            status: "cancelled",
            cancelled_at: new Date(),
        });

        // Also mark payment as failed if it was pending
        if (booking.payments?.[0]?.status === "pending") {
            await this.paymentsRepo.update(booking.payments[0].id, {
                status: "failed",
                transaction_status: "failed",
            });
        }

        return { bookingId, status: "cancelled" };
    }


}