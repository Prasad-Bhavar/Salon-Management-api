import {
    Router,
} from "express";

import {
    AppDataSource,
} from "~/config/database";

import {
    SalonServices,
} from "~/modules/salon-services/salon-services.model";

import { Salons } from "~/modules/salons/salons.model";
import {
    ServiceCategories,
} from "~/modules/services/service-categories.model";

import {
    ServicesMaster,
} from "~/modules/services/services-master.model";

import {
    Bookings,
} from "~/modules/bookings/bookings.model";

import {
    OwnerServicesRepository,
} from "./owner-service.repository";

import {
    OwnerServicesService,
} from "./owner-service.service";

import {
    OwnerServicesController,
} from "./owner-service.controller";


const router =
    Router();

const repository =
    new OwnerServicesRepository(

        AppDataSource.getRepository(
            SalonServices
        ),

        AppDataSource.getRepository(
            ServiceCategories
        ),

        AppDataSource.getRepository(
            ServicesMaster
        ),

        AppDataSource.getRepository(
            Bookings
        ),
        AppDataSource.getRepository(Salons),
    );

const service =
    new OwnerServicesService(
        repository
    );

const controller =
    new OwnerServicesController(
        service
    );

router.get(
    "/",
    controller.list
);

router.get(
    "/categories",
    controller.categories
);

router.get(
    "/master-services",
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