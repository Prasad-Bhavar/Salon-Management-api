import { Repository } from "typeorm";
import { FavoriteSalons } from "./favourite-salons.model";
import { Salons } from "~/modules/salons/salons.model";

export class FavouriteSalonsRepository {

    constructor(
        private favouriteRepo: Repository<FavoriteSalons>,
        private salonRepo: Repository<Salons>,
    ) { }

    // ── LIST ──────────────────────────────────────────────────────────────────

    async findAll(customerId: number) {
        return this.favouriteRepo.find({
            where: {
                customer: { id: customerId },
            },
            relations: {
                salon: {
                    address: true,
                    images: true,
                },
            },
            order: { created_at: "DESC" },
        });
    }

    // ── FIND ONE ──────────────────────────────────────────────────────────────

    async findOne(customerId: number, salonId: number) {
        return this.favouriteRepo.findOne({
            where: {
                customer: { id: customerId },
                salon: { id: salonId },
            },
        });
    }

    // ── CREATE ────────────────────────────────────────────────────────────────

    async create(customerId: number, salonId: number) {
        const salon = await this.salonRepo.findOne({
            where: { id: salonId },
        });

        if (!salon) {
            return null;
        }

        const favourite = this.favouriteRepo.create({
            customer: { id: customerId },
            salon: { id: salonId },
        });

        return this.favouriteRepo.save(favourite);
    }

    // ── DELETE ────────────────────────────────────────────────────────────────

    async delete(customerId: number, salonId: number) {
        const existing = await this.findOne(customerId, salonId);

        if (!existing) {
            return null;
        }

        await this.favouriteRepo.remove(existing);
        return true;
    }

    // ── TOGGLE ────────────────────────────────────────────────────────────────

    async toggle(customerId: number, salonId: number) {
        const existing = await this.findOne(customerId, salonId);

        if (existing) {
            await this.favouriteRepo.remove(existing);
            return { action: "removed" };
        }

        const salon = await this.salonRepo.findOne({
            where: { id: salonId },
        });

        if (!salon) {
            return null;
        }

        const favourite = this.favouriteRepo.create({
            customer: { id: customerId },
            salon: { id: salonId },
        });

        await this.favouriteRepo.save(favourite);
        return { action: "added" };
    }

    // ── CHECK ─────────────────────────────────────────────────────────────────

    async isFavourite(customerId: number, salonId: number) {
        const count = await this.favouriteRepo.count({
            where: {
                customer: { id: customerId },
                salon: { id: salonId },
            },
        });

        return count > 0;
    }

    // ── COUNT ─────────────────────────────────────────────────────────────────

    async countBySalon(salonId: number) {
        return this.favouriteRepo.count({
            where: {
                salon: { id: salonId },
            },
        });
    }
}