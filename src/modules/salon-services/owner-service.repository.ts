import { Repository } from "typeorm";
import { SalonServices } from "~/modules/salon-services/salon-services.model";
import { ServiceCategories } from "~/modules/services/service-categories.model";
import { ServicesMaster } from "~/modules/services/services-master.model";
import { Bookings } from "~/modules/bookings/bookings.model";
import { Salons } from "~/modules/salons/salons.model";

export class OwnerServicesRepository {

    constructor(
        private salonServiceRepo: Repository<SalonServices>,
        private categoryRepo: Repository<ServiceCategories>,
        private servicesRepo: Repository<ServicesMaster>,
        private bookingRepo: Repository<Bookings>,
        private salonRepo: Repository<Salons>,

    ) { }

    // ── LIST ──────────────────────────────────────────────────────────────────

    async findAll(salonId: number) {
        return this.salonServiceRepo.find({
            where: {
                salon: { id: salonId },
            },
            relations: {
                salon: true,
                service: {
                    category: true,
                },
            },
            order: { id: "DESC" },
        });
    }

    // ── DETAIL ────────────────────────────────────────────────────────────────

    async findById(id: number) {
        return this.salonServiceRepo.findOne({
            where: { id },
            relations: {
                salon: true,
                service: {
                    category: true,
                },
            },
        });
    }

    // ── CREATE ────────────────────────────────────────────────────────────────
    //
    // Problem: salonServiceRepo.create({ salon_id: 1, service_id: 2 }) does NOT
    // resolve relations — TypeORM needs actual entity references, not raw IDs.
    //

    async create(payload: any) {
        const { salon_id, service_id, price, duration, description, status } = payload;

        const salonService = this.salonServiceRepo.create({
            salon: { id: salon_id } as Salons,
            service: { id: service_id } as ServicesMaster,
            price,
            duration,
            description,
            status,
        });

        const saved = await this.salonServiceRepo.save(salonService);

        // Re-fetch with full relations so the response is complete
        return this.findById(saved.id);
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────

    async update(id: number, payload: any) {
        const { service_id, price, duration, description, status } = payload;

        await this.salonServiceRepo.update(id, {
            ...(service_id && { service: { id: service_id } as ServicesMaster }),
            price,
            duration,
            description,
            status,
        });

        return this.findById(id);
    }

    // ── CATEGORIES ────────────────────────────────────────────────────────────

    async getCategories() {
        return this.categoryRepo.find({
            order: { name: "ASC" },
        });
    }

    // ── SERVICES BY CATEGORY ──────────────────────────────────────────────────

    async getServicesByCategory(categoryId: number) {
        return this.servicesRepo.find({
            where: {
                category: { id: categoryId },
                is_active: true,
            },
            relations: { category: true },
            order: { name: "ASC" },
        });
    }

    // ── STATS ─────────────────────────────────────────────────────────────────

    async getStats(salonId: number) {
        const services = await this.findAll(salonId);

        return {
            total_services: services.length,
            active_services: services.filter((s) => s.status).length,
            inactive_services: services.filter((s) => !s.status).length,
            most_booked_service: "Haircut", // wire to bookings query later
        };
    }
}