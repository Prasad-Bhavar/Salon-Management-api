// owner-barbers.routes.ts

import {
    Router,
} from "express";

import {
    AppDataSource,
} from "~/config/database";

import {
    Barbers,
} from "~/modules/barbers/barbers.model";

import {
    BarberServices,
} from "~/modules/barbers/barber-services.model";

import {
    Users,
} from "~/modules/users/users.model";

import {
    ServicesMaster,
} from "~/modules/services/services-master.model";

import {
    Bookings,
} from "~/modules/bookings/bookings.model";

import {
    Roles,
} from "~/modules/users/roles.model";

import {
    BarbersRepository,
} from "./barbers.repository";

import {
    BarbersService,
} from "./barbers.service";

import {
    BarbersController,
} from "./barbers.controller";

const router =
    Router();

const repository =
    new BarbersRepository(

        AppDataSource.getRepository(
            Barbers
        ),

        AppDataSource.getRepository(
            Users
        ),

        AppDataSource.getRepository(
            BarberServices
        ),

        AppDataSource.getRepository(
            ServicesMaster
        ),

        AppDataSource.getRepository(
            Bookings
        ),

        AppDataSource.getRepository(
            Roles
        ),
    );

const service =
    new BarbersService(
        repository
    );

const controller =
    new BarbersController(
        service
    );

router.get(
    "/",
    controller.list
);

router.get(
    "/services",
    controller.services
);

router.get(
    "/:id",
    controller.detail
);

router.post(
    "/",
    controller.create
);

router.put(
    "/:id",
    controller.update
);

export default router;