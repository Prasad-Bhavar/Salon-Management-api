import { Router } from "express";

import {
    AppDataSource,
} from "~/config/database";

import {
    Salons,
} from "~/modules/salons/salons.model";

import {
    FavoriteSalons,
} from "~/modules/favourite-salons/favourite-salons.model";

import {
    BookingSlots,
} from "~/modules/bookings/booking-slots.model";

import {
    SlotLocks,
} from "~/modules/slot-locking/slot-locks.model";

import {
    BlockedSlots,
} from "~/modules/bookings/blocked-slots.model";

import {
    SalonAvailability,
} from "~/modules/salons/salon-availability.model";

import {
    SalonServices,
} from "~/modules/salon-services/salon-services.model";

import {
    ExploreSalonsRepository,
} from "./explore-salons.repository";

import {
    ExploreSalonsService,
} from "./explore-salons.service";

import {
    ExploreSalonsController,
} from "./explore-salons.controller";

const router = Router();

//
// REPOSITORY
//

const repository =
    new ExploreSalonsRepository(

        AppDataSource.getRepository(
            Salons
        ),

        AppDataSource.getRepository(
            FavoriteSalons
        ),

        AppDataSource.getRepository(
            BookingSlots
        ),

        AppDataSource.getRepository(
            SlotLocks
        ),

        AppDataSource.getRepository(
            BlockedSlots
        ),

        AppDataSource.getRepository(
            SalonAvailability
        ),

        AppDataSource.getRepository(
            SalonServices
        ),
    );

//
// SERVICE
//

const service =
    new ExploreSalonsService(
        repository
    );

//
// CONTROLLER
//

const controller =
    new ExploreSalonsController(
        service
    );

//
// ROUTES
//

// GET /explore-salons
router.get(
    "/",
    controller.list
);


//
// GET DETAIL
//

router.get(
    "/:salonId",
    controller.detail
);

//
// AVAILABLE DATES
//

router.get(
    "/:salonId/available-dates",
    controller.availableDates
);

//
// SERVICES
//

router.get(
    "/:salonId/services",
    controller.services
);

//
// AVAILABLE SLOTS
//

router.post(
    "/:salonId/available-slots",
    controller.availableSlots
);

export default router;