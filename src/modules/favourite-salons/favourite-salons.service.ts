import { FavouriteSalonsRepository } from "./favourite-salons.repository";

export class FavouriteSalonsService {

    constructor(
        private repository: FavouriteSalonsRepository
    ) { }

    //
    // LIST
    //

    async list(customerId: number) {

        const favourites = await this.repository.findAll(customerId);

        return {
            statusCode: 200,
            message: "Favourite salons fetched successfully",
            data: favourites,
        };
    }

    //
    // TOGGLE (add if not present, remove if present)
    //

    async toggle(customerId: number, salonId: number) {

        const result = await this.repository.toggle(customerId, salonId);

        if (result === null) {
            return {
                statusCode: 404,
                message: "Salon not found",
                data: null,
            };
        }

        return {
            statusCode: 200,
            message: result.action === "added"
                ? "Salon added to favourites"
                : "Salon removed from favourites",
            data: result,
        };
    }

    //
    // ADD
    //

    async add(customerId: number, salonId: number) {

        const existing = await this.repository.findOne(customerId, salonId);

        if (existing) {
            return {
                statusCode: 409,
                message: "Salon already in favourites",
                data: existing,
            };
        }

        const created = await this.repository.create(customerId, salonId);

        if (!created) {
            return {
                statusCode: 404,
                message: "Salon not found",
                data: null,
            };
        }

        return {
            statusCode: 201,
            message: "Salon added to favourites",
            data: created,
        };
    }

    //
    // REMOVE
    //

    async remove(customerId: number, salonId: number) {

        const result = await this.repository.delete(customerId, salonId);

        if (result === null) {
            return {
                statusCode: 404,
                message: "Favourite not found",
                data: null,
            };
        }

        return {
            statusCode: 200,
            message: "Salon removed from favourites",
            data: null,
        };
    }

    //
    // CHECK
    //

    async check(customerId: number, salonId: number) {

        const isFavourite = await this.repository.isFavourite(customerId, salonId);

        return {
            statusCode: 200,
            message: "Favourite status fetched",
            data: { is_favourite: isFavourite },
        };
    }
}