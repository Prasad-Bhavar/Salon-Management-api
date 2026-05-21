import { Repository } from "typeorm";

import { Salons } from "./salons.model";
import { Addresses } from "~/modules/addresses/addresses.model";
import { Users } from "~/modules/users/users.model";
import { Payments } from "~/modules/payments/payments.model";
import { Bookings } from "~/modules/bookings/bookings.model";
import { SalonBankDetails } from "./salon-bank-details.model";
import { Barbers } from "~/modules/barbers/barbers.model";

export class SalonRepository {
    constructor(
        private salonRepo: Repository<Salons>,
        private addressRepo: Repository<Addresses>,
        private userRepo: Repository<Users>,
        private paymentRepo: Repository<Payments>,
        private bookingRepo: Repository<Bookings>,
        private bankRepo: Repository<SalonBankDetails>,
        private barberRepo: Repository<Barbers>
    ) { }

    //
    // LIST SALONS
    //

    async findAll(query: any) {
        const {
            page,
            limit,
            search,
            status,
            salon_type,
            owner_id,
            sort = "created_at",
            order = "desc",
        } = query;

        const qb = this.salonRepo
            .createQueryBuilder("salon")
            .leftJoinAndSelect("salon.owner", "owner")
            .leftJoinAndSelect("salon.address", "address");

        //
        // SEARCH
        //

        if (search) {
            qb.andWhere(
                `
                (
                    LOWER(salon.name) LIKE LOWER(:search)
                    OR LOWER(owner.name) LIKE LOWER(:search)
                    OR LOWER(owner.email) LIKE LOWER(:search)
                    OR LOWER(salon.email) LIKE LOWER(:search)
                )
                `,
                {
                    search: `%${search}%`,
                }
            );
        }

        //
        // FILTERS
        //

        if (status) {
            qb.andWhere("salon.status = :status", {
                status,
            });
        }

        if (salon_type) {
            qb.andWhere("salon.salon_type = :salon_type", {
                salon_type,
            });
        }

        if (owner_id) {
            qb.andWhere("owner.id = :owner_id", {
                owner_id,
            });
        }

        //
        // SORTING
        //

        const sortableFields: any = {
            name: "salon.name",
            salon_type: "salon.salon_type",
            status: "salon.status",
            created_at: "salon.created_at",
        };

        if (sortableFields[sort]) {
            qb.orderBy(
                sortableFields[sort],
                order.toUpperCase()
            );
        } else {
            qb.orderBy(
                "salon.created_at",
                "DESC"
            );
        }

        //
        // PAGINATION
        //

        qb.skip((page - 1) * limit)
            .take(limit);

        const [salons, total] =
            await qb.getManyAndCount();

        //
        // REVENUE CALCULATION
        //

        const salonsWithRevenue = await Promise.all(
            salons.map(async (salon) => {

                const revenue = await this.paymentRepo
                    .createQueryBuilder("payment")
                    .leftJoin("payment.booking", "booking")
                    .where("booking.salon_id = :salonId", {
                        salonId: salon.id,
                    })
                    .andWhere("payment.status = :status", {
                        status: "paid",
                    })
                    .select([
                        "COALESCE(SUM(payment.amount),0) as total_revenue",
                        "COALESCE(SUM(payment.net_amount),0) as net_revenue",
                    ])
                    .getRawOne();

                return {
                    ...salon,
                    total_revenue: Number(revenue.total_revenue || 0),
                    net_revenue: Number(revenue.net_revenue || 0),
                };
            })
        );

        //
        // SORT REVENUE
        //

        if (
            sort === "total_revenue" ||
            sort === "net_revenue"
        ) {

            salonsWithRevenue.sort((a: any, b: any) => {

                const valA = a[sort];
                const valB = b[sort];

                if (order === "asc") {
                    return valA - valB;
                }

                return valB - valA;
            });
        }

        return {
            salons: salonsWithRevenue,
            total,
        };
    }

    //
    // FIND BY ID
    //

    async findById(id: number) {

        const salon = await this.salonRepo.findOne({

            where: {
                id,
            },

            relations: {

                owner: true,

                address: true,

                bank_details: true,

                bookings: {
                    customer: true,
                    booking_services: {
                        service: true,
                    },
                },
            },
        });

        if (!salon) {
            return null;
        }

        //
        // RECENT BOOKINGS
        //

        const recentBookings =
            salon.bookings
                ?.sort(
                    (a, b) =>
                        new Date(
                            b.created_at
                        ).getTime() -
                        new Date(
                            a.created_at
                        ).getTime()
                )
                ?.slice(0, 5);

        return {

            ...salon,

            recent_bookings:
                recentBookings,
        };
    }

    //
    // CREATE SALON
    //

    async create(payload: any) {

        //
        // CREATE ADDRESS
        //

        const address = this.addressRepo.create({
            line1: payload.address.line1,
            line2: payload.address.line2,
            city: payload.address.city,
            state: payload.address.state,
            pincode: payload.address.pincode,
        });

        const savedAddress =
            await this.addressRepo.save(address);

        //
        // CREATE SALON
        //

        const salon = this.salonRepo.create({
            name: payload.name,
            salon_type: payload.salon_type,
            email: payload.email,
            contact_number: payload.contact_number,
            status: payload.status,

            owner: {
                id: payload.owner_id,
            },

            address: {
                id: savedAddress.id,
            },
        });

        return this.salonRepo.save(salon);
    }

    //
    // UPDATE SALON
    //

    async update(id: number, payload: any) {

        const salon = await this.findById(id);

        if (!salon) {
            throw new Error("Salon not found");
        }

        //
        // UPDATE ADDRESS
        //

        if (payload.address) {

            await this.addressRepo.update(
                salon.address.id,
                {
                    line1: payload.address.line1,
                    line2: payload.address.line2,
                    city: payload.address.city,
                    state: payload.address.state,
                }
            );
        }

        //
        // UPDATE SALON
        //

        await this.salonRepo.update(id, {
            name: payload.name,
            salon_type: payload.salon_type,
            email: payload.email,
            contact_number: payload.contact_number,
            status: payload.status,

            owner: payload.owner_id
                ? {
                    id: payload.owner_id,
                }
                : undefined,
        });

        return this.findById(id);
    }

    //
    // FIND OWNERS
    //

    async findOwners() {

        return this.userRepo.find({
            where: {
                status: "active",
                role: {
                    slug: "owner",
                } as any,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
            relations: {
                role: true,
            },
            order: {
                name: "ASC",
            },
        });
    }

    //
    // GET SALON ANALYTICS
    //

    async getSalonAnalytics(salonId: number) {

        //
        // BOOKINGS
        //

        const totalBookings =
            await this.bookingRepo.count({
                where: {
                    salon: {
                        id: salonId,
                    },
                },
            });

        const completedBookings =
            await this.bookingRepo.count({
                where: {
                    salon: {
                        id: salonId,
                    },
                    status: "completed",
                },
            });

        const cancelledBookings =
            await this.bookingRepo.count({
                where: {
                    salon: {
                        id: salonId,
                    },
                    status: "cancelled",
                },
            });

        //
        // BARBERS
        //

        const totalBarbers =
            await this.barberRepo.count({
                where: {
                    salon: {
                        id: salonId,
                    },
                },
            });

        const activeBarbers =
            await this.barberRepo.count({
                where: {
                    salon: {
                        id: salonId,
                    },
                    status: "active",
                },
            });

        //
        // REVENUE
        //

        const revenue = await this.paymentRepo
            .createQueryBuilder("payment")
            .leftJoin("payment.booking", "booking")
            .where("booking.salon_id = :salonId", {
                salonId,
            })
            .andWhere("payment.status = :status", {
                status: "paid",
            })
            .select([
                "COALESCE(SUM(payment.amount),0) as total_revenue",
                "COALESCE(SUM(payment.commission),0) as total_commission",
                "COALESCE(SUM(payment.net_amount),0) as net_revenue",
            ])
            .getRawOne();

        return {
            total_bookings: totalBookings,
            completed_bookings: completedBookings,
            cancelled_bookings: cancelledBookings,

            total_barbers: totalBarbers,
            active_barbers: activeBarbers,

            total_revenue: Number(revenue.total_revenue || 0),
            total_commission: Number(revenue.total_commission || 0),
            net_revenue: Number(revenue.net_revenue || 0),
        };
    }

    //
    // RECENT BOOKINGS
    //

    async getRecentBookings(salonId: number) {

        return this.bookingRepo.find({
            where: {
                salon: {
                    id: salonId,
                },
            },

            relations: {
                customer: true,
                booking_services: true,
            },

            order: {
                created_at: "DESC",
            },

            take: 10,
        });
    }
}