// owner-barbers.service.ts

import {
    BarbersRepository,
} from "./barbers.repository";

export class BarbersService {

    constructor(
        private repository:
            BarbersRepository
    ) { }

    //
    // LIST
    //

    async list(
        salonId: number
    ) {

        const barbers =
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
                "Barbers fetched successfully",

            data: {

                barbers,

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

        const barber =
            await this.repository.findById(
                id
            );

        return {

            statusCode: 200,

            message:
                "Barber fetched successfully",

            data: barber,
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
                "Barber created successfully",

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
                "Barber updated successfully",

            data: updated,
        };
    }

    //
    // SERVICES
    //

    async services() {

        const services =
            await this.repository.getServices();

        return {

            statusCode: 200,

            data: services,
        };
    }
}