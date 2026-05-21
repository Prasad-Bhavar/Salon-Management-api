import { Repository } from "typeorm";

import { Bookings } from "./bookings.model";

import { BookingListQuery } from "./booking.types";

export class BookingRepository {

    constructor(

        private bookingRepo: Repository<Bookings>
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
}