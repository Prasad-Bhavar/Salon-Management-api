import { BookingRepository } from "./booking.repository";

export class BookingService {

    constructor(

        private repository: BookingRepository
    ) { }

    //
    // LIST BOOKINGS
    //

    async listBookings(
        query: any
    ) {

        const safeQuery = {

            page:
                Number(query.page) || 1,

            limit:
                Number(query.limit) || 10,

            search:
                query.search,

            status:
                query.status,

            salon_id:
                query.salon_id
                    ? Number(
                        query.salon_id
                    )
                    : undefined,

            sort:
                query.sort,

            order:
                query.order,
        };

        const result =
            await this.repository.findAll(
                safeQuery
            );

        return {

            statusCode: 200,

            message:
                "Bookings fetched successfully",

            data: {

                data:
                    result.bookings,

                pagination: {

                    total:
                        result.total,

                    page:
                        safeQuery.page,

                    limit:
                        safeQuery.limit,

                    totalPages:
                        Math.ceil(
                            result.total /
                            safeQuery.limit
                        ),
                },
            },
        };
    }

    //
    // GET BOOKING
    //

    async getBookingById(
        params: any
    ) {

        const booking =
            await this.repository.findById(
                Number(params.id)
            );

        if (!booking) {

            throw {

                statusCode: 404,

                message:
                    "Booking not found",
            };
        }

        return {

            statusCode: 200,

            message:
                "Booking fetched successfully",

            data: booking,
        };
    }
}