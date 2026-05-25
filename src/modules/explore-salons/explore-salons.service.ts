import { ExploreSalonsRepository } from "./explore-salons.repository";

import {
    ExploreSalonsQuery, AvailableSlotsPayload
} from "./explore-salons.types";

export class ExploreSalonsService {

    constructor(
        private repository:
            ExploreSalonsRepository
    ) { }

    //
    // LIST ALL EXPLORE SALONS
    //

    async list(
        customerId: number,
        query: ExploreSalonsQuery
    ) {

        const salons =
            await this.repository.findAll(
                customerId,
                query
            );

        return {

            statusCode: 200,

            message:
                "Salons fetched successfully",

            data: salons,
        };
    }


    //
    // DETAIL
    //

    async detail(
        customerId: number,
        salonId: number
    ) {

        const salon =
            await this.repository.findById(
                customerId,
                salonId
            );

        if (!salon) {

            return {

                statusCode: 404,

                message:
                    "Salon not found",

                data: null,
            };
        }

        return {

            statusCode: 200,

            message:
                "Salon details fetched successfully",

            data: salon,
        };
    }


    //
    // AVAILABLE DATES
    //

    async availableDates(
        salonId: number
    ) {

        const dates =
            await this.repository
                .getAvailableDates(
                    salonId
                );

        return {

            statusCode: 200,

            message:
                "Available dates fetched successfully",

            data: dates,
        };
    }

    //
    // SERVICES
    //

    async services(
        salonId: number
    ) {

        const services =
            await this.repository
                .getSalonServices(
                    salonId
                );

        return {

            statusCode: 200,

            message:
                "Salon services fetched successfully",

            data: services,
        };
    }

    //
    // AVAILABLE SLOTS
    //

    async availableSlots(
        salonId: number,
        payload: AvailableSlotsPayload
    ) {

        const slots =
            await this.repository
                .getAvailableSlots(
                    salonId,
                    payload
                );

        return {

            statusCode: 200,

            message:
                "Available slots fetched successfully",

            data: slots,
        };
    }
}