import {
    Router,
} from "express";

import {
    AppDataSource,
} from "~/config/database";

import {
    SlotLocks,
} from "./slot-locks.model";

import {
    BookingSlots,
} from "~/modules/bookings/booking-slots.model";

import {
    BlockedSlots,
} from "~/modules/bookings/blocked-slots.model";

import {
    SalonAvailability,
} from "~/modules/salons/salon-availability.model";

import {
    SlotLockingRepository,
} from "./slot-locking.repository";

import {
    SlotLockingService,
} from "./slot-locking.service";

import {
    SlotLockingController,
} from "./slot-locking.controller";

import {
    Settings,
} from "~/modules/settings/settings.model";

const router =
    Router();

//
// REPOSITORY
//

const repository =
    new SlotLockingRepository(

        AppDataSource.getRepository(
            SlotLocks
        ),

        AppDataSource.getRepository(
            BookingSlots
        ),

        AppDataSource.getRepository(
            BlockedSlots
        ),

        AppDataSource.getRepository(
            SalonAvailability
        ),
        AppDataSource.getRepository(
            Settings
        ),
    );

//
// SERVICE
//

const service =
    new SlotLockingService(
        repository
    );

//
// CONTROLLER
//

const controller =
    new SlotLockingController(
        service
    );

//
// ROUTES
//

// POST /slot-locking/lock

router.post(
    "/lock",
    controller.lock
);

export default router;