import { Repository } from "typeorm";

import { Salons } from "~/modules/salons/salons.model";
import { FavoriteSalons } from "~/modules/favourite-salons/favourite-salons.model";
import {
    BookingSlots,
} from "~/modules/bookings/booking-slots.model";

import {
    SlotLocks,
} from "~/modules/slot-locking/slot-locks.model";

import {
    BlockedSlots,
} from "~/modules/bookings/blocked-slots.model";

import {
    SalonAvailability,
} from "~/modules/salons/salon-availability.model";

import {
    SalonServices,
} from "~/modules/salon-services/salon-services.model";

import {
    AvailableSlotsPayload,
} from "./explore-salons.types";

import {
    generateSlots,
} from "~/common/utils/slot-generator.util";

import {
    timeToMinutes,
    minutesToTime,
} from "~/common/utils/time.util";
import { ExploreSalonsQuery } from "./explore-salons.types";

export class ExploreSalonsRepository {

    constructor(

        private salonRepo:
            Repository<Salons>,

        private favouriteRepo:
            Repository<FavoriteSalons>,

        private bookingSlotRepo?:
            Repository<BookingSlots>,

        private slotLockRepo?:
            Repository<SlotLocks>,

        private blockedSlotRepo?:
            Repository<BlockedSlots>,

        private availabilityRepo?:
            Repository<SalonAvailability>,

        private salonServiceRepo?:
            Repository<SalonServices>,
    ) { }

    async findAll(
        customerId: number,
        query: ExploreSalonsQuery
    ) {

        const page =
            Number(query.page) || 1;

        const limit =
            Number(query.limit) || 10;

        const skip =
            (page - 1) * limit;

        //
        // QUERY BUILDER
        //

        const qb =
            this.salonRepo
                .createQueryBuilder("salon")

                //
                // RELATIONS
                //

                .leftJoinAndSelect(
                    "salon.address",
                    "address"
                )

                .leftJoinAndSelect(
                    "salon.images",
                    "images"
                )

                .leftJoin(
                    "salon.reviews",
                    "reviews"
                )

                .leftJoin(
                    "salon_services",
                    "salonServices",
                    "salonServices.salon_id = salon.id"
                )

                .leftJoin(
                    "favorite_salons",
                    "favourites",
                    `
                    favourites.salon_id = salon.id
                    AND favourites.customer_id = :customerId
                    `,
                    { customerId }
                )

                //
                // ONLY ACTIVE SALONS
                //

                .where(
                    "salon.status = :status",
                    {
                        status: "active",
                    }
                );

        //
        // SEARCH FILTER
        //

        if (query.search) {

            qb.andWhere(
                `
                LOWER(salon.name)
                LIKE LOWER(:search)
                `,
                {
                    search: `%${query.search}%`,
                }
            );
        }

        //
        // CITY FILTER
        //

        if (query.city) {

            qb.andWhere(
                `
                LOWER(address.city)
                LIKE LOWER(:city)
                `,
                {
                    city: `%${query.city}%`,
                }
            );
        }

        //
        // SALON TYPE FILTER
        //

        if (query.salon_type) {

            qb.andWhere(
                `
                salon.salon_type = :salon_type
                `,
                {
                    salon_type: query.salon_type,
                }
            );
        }

        //
        // SELECT REQUIRED FIELDS
        //

        qb.select([

            "salon.id",
            "salon.name",
            "salon.salon_type",
            "salon.status",
            "salon.contact_number",
            "salon.created_at",

            "address.id",
            "address.area",
            "address.city",
            "address.state",

            "images.id",
            "images.image_url",
        ]);

        //
        // AGGREGATES
        //

        qb.addSelect(`
            COALESCE(AVG(reviews.rating), 0)
        `, "rating");

        qb.addSelect(`
            COUNT(DISTINCT reviews.id)
        `, "review_count");

        qb.addSelect(`
            COALESCE(MIN(salonServices.price), 0)
        `, "starting_price");

        qb.addSelect(`
            CASE
                WHEN COUNT(DISTINCT favourites.id) > 0
                THEN true
                ELSE false
            END
        `, "is_favourite");

        //
        // GROUP BY
        //

        qb.groupBy("salon.id")
            .addGroupBy("address.id")
            .addGroupBy("images.id");

        //
        // ORDER
        //

        qb.orderBy(
            "salon.created_at",
            "DESC"
        );

        //
        // PAGINATION
        //

        qb.skip(skip)
            .take(limit);

        //
        // EXECUTE
        //

        const [items, total] =
            await qb.getManyAndCount();

        //
        // RAW DATA
        //

        const raw =
            await qb.getRawMany();

        //
        // MAP RESPONSE
        //

        const mappedItems =
            items.map((salon, index) => ({

                ...salon,

                rating:
                    Number(
                        raw[index]?.rating || 0
                    ),

                review_count:
                    Number(
                        raw[index]?.review_count || 0
                    ),

                starting_price:
                    Number(
                        raw[index]?.starting_price || 0
                    ),

                is_favourite:
                    raw[index]?.is_favourite === true
                    || raw[index]?.is_favourite === "true",
            }));

        return {

            items: mappedItems,

            pagination: {
                page,
                limit,
                total,
                total_pages:
                    Math.ceil(total / limit),
            },
        };
    }


    //
    // FIND DETAIL
    //

    async findById(
        customerId: number,
        salonId: number
    ) {

        //
        // MAIN QUERY
        //

        const qb =
            this.salonRepo
                .createQueryBuilder("salon")

                //
                // RELATIONS
                //

                .leftJoinAndSelect(
                    "salon.address",
                    "address"
                )

                .leftJoinAndSelect(
                    "salon.images",
                    "images"
                )

                .leftJoinAndSelect(
                    "salon.availability",
                    "availability"
                )

                .leftJoinAndSelect(
                    "salon.reviews",
                    "reviews"
                )

                .leftJoinAndSelect(
                    "reviews.customer",
                    "customer"
                )

                .leftJoinAndSelect(
                    "reviews.images",
                    "reviewImages"
                )

                .leftJoin(
                    "favorite_salons",
                    "favourites",
                    `
                favourites.salon_id = salon.id
                AND favourites.customer_id = :customerId
                `,
                    { customerId }
                )

                .leftJoin(
                    "salon_services",
                    "salonServices",
                    `
                salonServices.salon_id = salon.id
                `
                )

                .leftJoinAndSelect(
                    "salonServices.service",
                    "service"
                )

                .leftJoinAndSelect(
                    "service.category",
                    "category"
                )

                //
                // FILTER
                //

                .where(
                    "salon.id = :salonId",
                    { salonId }
                )

                .andWhere(
                    "salon.status = :status",
                    {
                        status: "active",
                    }
                );

        //
        // FAVOURITE
        //

        qb.addSelect(`
        CASE
            WHEN COUNT(DISTINCT favourites.id) > 0
            THEN true
            ELSE false
        END
    `, "is_favourite");

        //
        // GROUP BY
        //

        qb.groupBy("salon.id")
            .addGroupBy("address.id")
            .addGroupBy("images.id")
            .addGroupBy("availability.id")
            .addGroupBy("reviews.id")
            .addGroupBy("customer.id")
            .addGroupBy("reviewImages.id")
            .addGroupBy("salonServices.id")
            .addGroupBy("service.id")
            .addGroupBy("category.id");

        //
        // EXECUTE
        //

        const salon =
            await qb.getOne();

        if (!salon) {
            return null;
        }

        //
        // RAW
        //

        const raw =
            await qb.getRawOne();

        //
        // REVIEW STATS
        //

        const reviewStats =
            await this.salonRepo
                .createQueryBuilder("salon")

                .leftJoin(
                    "salon.reviews",
                    "reviews"
                )

                .select(`
                COALESCE(
                    AVG(reviews.rating),
                    0
                )
            `, "rating")

                .addSelect(`
                COUNT(reviews.id)
            `, "review_count")

                .where(
                    "salon.id = :salonId",
                    { salonId }
                )

                .getRawOne();

        //
        // RESPONSE
        //

        return {

            ...salon,

            rating:
                Number(
                    reviewStats?.rating || 0
                ),

            review_count:
                Number(
                    reviewStats?.review_count || 0
                ),

            is_favourite:
                raw?.is_favourite === true
                || raw?.is_favourite === "true",
        };
    }

    //
    // AVAILABLE DATES
    //

    async getAvailableDates(
        salonId: number
    ) {

        //
        // SALON AVAILABILITY
        //

        const availability =
            await this.salonRepo
                .manager
                .getRepository(
                    "salon_availability"
                )
                .find({
                    where: {
                        salon: {
                            id: salonId,
                        },
                    },
                });

        //
        // MAP DAYS
        //

        const availableDays =
            availability
                .filter(
                    (item: any) =>
                        !item.is_closed
                )
                .map(
                    (item: any) =>
                        item.day_of_week
                            .toLowerCase()
                );

        //
        // NEXT 30 DAYS
        //

        const available_dates: string[] = [];

        const closed_dates: string[] = [];

        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const date =
                new Date();

            date.setDate(
                date.getDate() + i
            );

            const dayName =
                date
                    .toLocaleDateString(
                        "en-US",
                        {
                            weekday: "long",
                        }
                    )
                    .toLowerCase();

            const formatted =
                date
                    .toISOString()
                    .split("T")[0];

            //
            // CHECK DAY
            //

            if (
                availableDays.includes(
                    dayName
                )
            ) {

                available_dates.push(
                    formatted
                );

            } else {

                closed_dates.push(
                    formatted
                );
            }
        }

        return {

            available_dates,

            closed_dates,
        };
    }

    //
    // GET SALON SERVICES
    //

    async getSalonServices(
        salonId: number
    ) {

        const services =
            await this.salonRepo
                .manager
                .getRepository(
                    "salon_services"
                )
                .createQueryBuilder(
                    "salonService"
                )

                //
                // RELATIONS
                //

                .leftJoinAndSelect(
                    "salonService.service",
                    "service"
                )

                .leftJoinAndSelect(
                    "service.category",
                    "category"
                )

                //
                // FILTER
                //

                .where(
                    "salonService.salon_id = :salonId",
                    { salonId }
                )

                .andWhere(
                    "salonService.status = true"
                )

                //
                // ORDER
                //

                .orderBy(
                    "category.name",
                    "ASC"
                )

                .addOrderBy(
                    "service.name",
                    "ASC"
                )

                //
                // EXECUTE
                //

                .getMany();

        //
        // GROUP BY CATEGORY
        //

        const grouped: Record<
            string,
            any[]
        > = {};

        for (const item of services) {

            const categoryName =
                item.service.category.name;

            if (
                !grouped[categoryName]
            ) {

                grouped[categoryName] = [];
            }

            grouped[
                categoryName
            ].push({

                id:
                    item.id,

                service_id:
                    item.service.id,

                name:
                    item.service.name,

                description:
                    item.description
                    || item.service.description,

                image:
                    item.service.image,

                duration:
                    item.duration,

                price:
                    item.price,

                gender_type:
                    item.service.gender_type,
            });
        }

        //
        // FINAL RESPONSE
        //

        return Object.entries(
            grouped
        ).map(
            ([category, services]) => ({

                category,

                services,
            })
        );
    }

    //
    // AVAILABLE SLOTS
    //

    async getAvailableSlots(
        salonId: number,
        payload: AvailableSlotsPayload
    ) {

        //
        // GET WEEKDAY
        //

        const selectedDate =
            new Date(payload.date);

        const weekday =
            selectedDate
                .toLocaleDateString(
                    "en-US",
                    {
                        weekday: "long",
                    }
                );

        //
        // AVAILABILITY
        //

        const availability =
            await this.availabilityRepo!
                .findOne({
                    where: {
                        salon: {
                            id: salonId,
                        },
                        day_of_week:
                            weekday,
                        is_closed: false,
                    },
                });

        if (!availability) {

            return {
                slots: [],
            };
        }

        //
        // TOTAL SERVICE DURATION
        //

        const salonServices =
            await this.salonServiceRepo!
                .createQueryBuilder(
                    "salonService"
                )
                .whereInIds(
                    payload.service_ids
                )
                .getMany();

        const totalDuration =
            salonServices.reduce(
                (
                    sum,
                    item
                ) =>
                    sum + item.duration,
                0
            );

        //
        // GENERATE ALL START SLOTS
        //

        const slots =
            generateSlots({

                start_time:
                    availability.start_time,

                end_time:
                    availability.end_time,

                slot_interval: 15,
            });

        //
        // EXISTING BOOKINGS
        //

        const bookingSlots =
            await this.bookingSlotRepo!
                .find({
                    where: {
                        salon: {
                            id: salonId,
                        },
                        slot_date:
                            payload.date,
                    },
                });

        //
        // ACTIVE LOCKS
        //

        const locks =
            await this.slotLockRepo!
                .createQueryBuilder(
                    "lock"
                )
                .where(
                    "lock.salon_id = :salonId",
                    { salonId }
                )
                .andWhere(
                    "lock.slot_date = :date",
                    {
                        date:
                            payload.date,
                    }
                )
                .andWhere(
                    "lock.locked_until > NOW()"
                )
                .getMany();

        //
        // BLOCKED SLOTS
        //

        const blockedSlots =
            await this.blockedSlotRepo!
                .find({
                    where: {
                        salon: {
                            id: salonId,
                        },
                        date:
                            payload.date,
                    },
                });

        //
        // FINAL RESPONSE
        //

        const availableSlots: any[] = [];

        for (const slot of slots) {

            const startMinutes =
                timeToMinutes(slot);

            const endMinutes =
                startMinutes +
                totalDuration;

            //
            // END TIME
            //

            if (
                endMinutes >
                timeToMinutes(
                    availability.end_time
                )
            ) {

                continue;
            }

            const slotEndTime =
                minutesToTime(
                    endMinutes
                );

            //
            // BLOCKED CHECK
            //

            const blocked =
                blockedSlots.some(
                    (item) => {

                        const blockedStart =
                            timeToMinutes(
                                item.start_time
                            );

                        const blockedEnd =
                            timeToMinutes(
                                item.end_time
                            );

                        return (
                            startMinutes <
                            blockedEnd
                            &&
                            endMinutes >
                            blockedStart
                        );
                    }
                );

            if (blocked) {
                continue;
            }

            //
            // COUNT OVERLAPS
            //

            let overlapCount = 0;

            //
            // BOOKINGS
            //

            for (const booking of bookingSlots) {

                const bookingStart =
                    timeToMinutes(
                        booking.start_time
                    );

                const bookingEnd =
                    timeToMinutes(
                        booking.end_time
                    );

                const overlaps =
                    (
                        startMinutes <
                        bookingEnd
                    )
                    &&
                    (
                        endMinutes >
                        bookingStart
                    );

                if (overlaps) {
                    overlapCount++;
                }
            }

            //
            // LOCKS
            //

            for (const lock of locks) {

                const lockStart =
                    timeToMinutes(
                        lock.start_time
                    );

                const lockEnd =
                    timeToMinutes(
                        lock.end_time
                    );

                const overlaps =
                    (
                        startMinutes <
                        lockEnd
                    )
                    &&
                    (
                        endMinutes >
                        lockStart
                    );

                if (overlaps) {
                    overlapCount++;
                }
            }

            //
            // CAPACITY CHECK
            //

            const remainingCapacity =
                availability.capacity
                - overlapCount;

            availableSlots.push({

                start_time: slot,

                end_time:
                    slotEndTime,

                available:
                    remainingCapacity > 0,

                remaining_capacity:
                    remainingCapacity > 0
                        ? remainingCapacity
                        : 0,
            });
        }

        return {
            slots:
                availableSlots,
        };
    }
}