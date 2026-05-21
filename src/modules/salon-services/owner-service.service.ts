import {
    OwnerServicesRepository,
} from "./owner-service.repository";

export class OwnerServicesService {

    constructor(
        private repository:
            OwnerServicesRepository
    ) { }

    //
    // LIST
    //

    async list(
        salonId: number
    ) {

        const services =
            await this.repository.findAll(
                salonId
            );

        const stats =
            await this.repository.getStats(
                salonId
            );

        return {

            statusCode: 200,

            message:
                "Services fetched successfully",

            data: {

                services,

                stats,
            },
        };
    }

    //
    // DETAIL
    //

    async detail(
        id: number
    ) {

        const service =
            await this.repository.findById(
                id
            );

        return {

            statusCode: 200,

            message:
                "Service fetched successfully",

            data: service,
        };
    }

    //
    // CREATE
    //

    async create(
        body: any
    ) {

        const created =
            await this.repository.create(
                body
            );

        return {

            statusCode: 201,

            message:
                "Service created successfully",

            data: created,
        };
    }

    //
    // UPDATE
    //

    async update(
        id: number,
        body: any
    ) {

        const updated =
            await this.repository.update(
                id,
                body
            );

        return {

            statusCode: 200,

            message:
                "Service updated successfully",

            data: updated,
        };
    }

    //
    // CATEGORIES
    //

    async categories() {

        const categories =
            await this.repository.getCategories();

        return {

            statusCode: 200,

            data: categories,
        };
    }

    //
    // SERVICES
    //

    async services(
        categoryId: number
    ) {

        const services =
            await this.repository.getServicesByCategory(
                categoryId
            );

        return {

            statusCode: 200,

            data: services,
        };
    }
}