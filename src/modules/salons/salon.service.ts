import { SalonRepository } from "./salon.repository";

export class SalonService {

    constructor(
        private repository: SalonRepository
    ) { }

    //
    // LIST SALONS
    //

    async listSalons(query: any) {

        try {

            const safeQuery = {
                page: Number(query.page) || 1,

                limit: Number(query.limit) || 10,

                search: query.search,

                status: query.status,

                salon_type: query.salon_type,

                owner_id: query.owner_id
                    ? Number(query.owner_id)
                    : undefined,

                sort: query.sort,

                order: query.order,
            };

            const result =
                await this.repository.findAll(
                    safeQuery
                );

            return {

                statusCode: 200,

                message:
                    "Salons fetched successfully",

                data: {
                    data: result.salons,

                    pagination: {
                        total: result.total,

                        page: safeQuery.page,

                        limit: safeQuery.limit,

                        totalPages: Math.ceil(
                            result.total /
                            safeQuery.limit
                        ),
                    },
                },
            };

        } catch (error: any) {

            throw {

                statusCode:
                    error.statusCode || 500,

                message:
                    error.message ||
                    "Failed to fetch salons",
            };
        }
    }

    //
    // GET SALON DETAIL
    //

    async getSalonById(params: any) {

        try {

            const salon =
                await this.repository.findById(
                    Number(params.id)
                );

            if (!salon) {

                throw {
                    statusCode: 404,
                    message: "Salon not found",
                };
            }

            //
            // ANALYTICS
            //

            const analytics =
                await this.repository
                    .getSalonAnalytics(
                        salon.id
                    );

            //
            // RECENT BOOKINGS
            //

            const recentBookings =
                await this.repository
                    .getRecentBookings(
                        salon.id
                    );

            return {

                statusCode: 200,

                message:
                    "Salon fetched successfully",

                data: {
                    ...salon,

                    analytics,

                    recent_bookings:
                        recentBookings,
                },
            };

        } catch (error: any) {

            throw {

                statusCode:
                    error.statusCode || 500,

                message:
                    error.message ||
                    "Failed to fetch salon",
            };
        }
    }

    //
    // CREATE SALON
    //

    async createSalon(body: any) {

        try {

            const salon =
                await this.repository.create(
                    body
                );

            return {

                statusCode: 201,

                message:
                    "Salon created successfully",

                data: salon,
            };

        } catch (error: any) {

            throw {

                statusCode:
                    error.statusCode || 500,

                message:
                    error.message ||
                    "Failed to create salon",
            };
        }
    }

    //
    // UPDATE SALON
    //

    async updateSalon(
        params: any,
        body: any
    ) {

        try {

            const id = Number(params.id);

            //
            // CHECK EXISTING
            //

            const existing =
                await this.repository.findById(id);

            if (!existing) {

                throw {
                    statusCode: 404,
                    message: "Salon not found",
                };
            }

            //
            // UPDATE
            //

            const updated =
                await this.repository.update(
                    id,
                    body
                );

            return {

                statusCode: 200,

                message:
                    "Salon updated successfully",

                data: updated,
            };

        } catch (error: any) {

            throw {

                statusCode:
                    error.statusCode || 500,

                message:
                    error.message ||
                    "Failed to update salon",
            };
        }
    }

    //
    // UPDATE STATUS
    //

    async updateSalonStatus(
        params: any,
        body: any
    ) {

        try {

            const id = Number(params.id);

            const salon =
                await this.repository.findById(id);

            if (!salon) {

                throw {
                    statusCode: 404,
                    message: "Salon not found",
                };
            }

            //
            // UPDATE STATUS
            //

            const updated =
                await this.repository.update(
                    id,
                    {
                        status: body.status,
                    }
                );

            return {

                statusCode: 200,

                message:
                    "Salon status updated successfully",

                data: updated,
            };

        } catch (error: any) {

            throw {

                statusCode:
                    error.statusCode || 500,

                message:
                    error.message ||
                    "Failed to update salon status",
            };
        }
    }

    //
    // GET OWNERS
    //

    async getOwners() {

        try {

            const owners =
                await this.repository.findOwners();
            return {

                statusCode: 200,

                message:
                    "Owners fetched successfully",

                data: owners,
            };

        } catch (error: any) {

            throw {

                statusCode:
                    error.statusCode || 500,

                message:
                    error.message ||
                    "Failed to fetch owners",
            };
        }
    }
}