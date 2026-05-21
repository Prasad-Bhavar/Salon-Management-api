
import {
    Repository,
} from "typeorm";

import {
    Barbers,
} from "~/modules/barbers/barbers.model";

import {
    Users,
} from "~/modules/users/users.model";

import {
    BarberServices,
} from "~/modules/barbers/barber-services.model";

import {
    ServicesMaster,
} from "~/modules/services/services-master.model";

import {
    Bookings,
} from "~/modules/bookings/bookings.model";

import {
    Roles,
} from "~/modules/users/roles.model";

export class BarbersRepository {

    constructor(

        private barberRepo:
            Repository<Barbers>,

        private userRepo:
            Repository<Users>,

        private barberServicesRepo:
            Repository<BarberServices>,

        private servicesRepo:
            Repository<ServicesMaster>,

        private bookingRepo:
            Repository<Bookings>,

        private rolesRepo:
            Repository<Roles>,
    ) { }

    //
    // LIST
    //

    async findAll(
        salonId: number
    ) {

        return this.barberRepo.find({

            where: {
                salon: {
                    id: salonId,
                },
            },

            relations: {

                user: true,

                barber_services: {
                    service: true,
                },
            },

            order: {
                id: "DESC",
            },
        });
    }

    //
    // DETAIL
    //

    async findById(id: number) {

        return this.barberRepo.findOne({

            where: { id },

            relations: {

                user: true,

                barber_services: {

                    service: {

                        salon_services: {
                            salon: true,
                        },

                        // salon: true,
                    },
                },

                preferred_bookings: true,
            },
        });
    }

    //
    // CREATE
    //

    async create(
        payload: any
    ) {

        const barberRole =
            await this.rolesRepo.findOne({
                where: {
                    slug: "barber",
                },
            });

        //
        // CREATE USER
        //

        const user =
            this.userRepo.create({

                name:
                    payload.name,

                email:
                    payload.email,

                password:
                    "123456",

                contact1:
                    payload.contact1,

                gender:
                    payload.gender,

                status:
                    payload.status === "active"
                        ? "active"
                        : "inactive",

                role:
                    barberRole!,
            });

        const savedUser =
            await this.userRepo.save(
                user
            );

        //
        // CREATE BARBER
        //

        const barber =
            this.barberRepo.create({

                user:
                    savedUser,

                salon: {
                    id:
                        payload.salon_id,
                },

                specialization:
                    payload.specialization,

                status:
                    payload.status,
            });

        const savedBarber =
            await this.barberRepo.save(
                barber
            );

        //
        // ASSIGN SERVICES
        //

        if (
            payload.services?.length
        ) {

            const services =
                payload.services.map(
                    (
                        serviceId: number
                    ) => {

                        return this.barberServicesRepo.create({

                            barber:
                                savedBarber,

                            service: {
                                id:
                                    serviceId,
                            } as ServicesMaster,
                        });
                    }
                );

            await this.barberServicesRepo.save(
                services
            );
        }

        return this.findById(
            savedBarber.id
        );
    }

    //
    // UPDATE
    //

    async update(
        id: number,
        payload: any
    ) {

        const barber =
            await this.findById(id);

        if (!barber)
            return null;

        //
        // UPDATE USER
        //

        await this.userRepo.update(

            barber.user.id,

            {

                name:
                    payload.name,

                email:
                    payload.email,

                contact1:
                    payload.contact1,

                gender:
                    payload.gender,

                status:
                    payload.status === "active"
                        ? "active"
                        : "inactive",
            }
        );

        //
        // UPDATE BARBER
        //

        await this.barberRepo.update(

            id,

            {

                specialization:
                    payload.specialization,

                status:
                    payload.status,
            }
        );

        //
        // RESET SERVICES
        //

        await this.barberServicesRepo.delete({

            barber: {
                id,
            },
        });

        //
        // REASSIGN SERVICES
        //

        if (
            payload.services?.length
        ) {

            const services =
                payload.services.map(
                    (
                        serviceId: number
                    ) => {

                        return this.barberServicesRepo.create({

                            barber: {
                                id,
                            } as Barbers,

                            service: {
                                id:
                                    serviceId,
                            } as ServicesMaster,
                        });
                    }
                );

            await this.barberServicesRepo.save(
                services
            );
        }

        return this.findById(
            id
        );
    }

    //
    // SERVICES
    //

    async getServices() {

        return this.servicesRepo.find({

            where: {
                is_active: true,
            },

            relations: {
                category: true,
            },

            order: {
                name: "ASC",
            },
        });
    }

    //
    // STATS
    //

    async getStats(
        salonId: number
    ) {

        const barbers =
            await this.findAll(
                salonId
            );

        return {

            total_staff:
                barbers.length,

            active_staff:
                barbers.filter(
                    (b) =>
                        b.status === "active"
                ).length,
        };
    }
}