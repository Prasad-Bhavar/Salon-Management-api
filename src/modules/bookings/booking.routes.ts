import { Router } from "express";

import { AppDataSource } from "~/config/database";

import { Bookings } from "./bookings.model";

import { BookingRepository } from "./booking.repository";

import { BookingService } from "./booking.service";

import { BookingController } from "./booking.controller";

const router = Router();

//
// INIT
//

const bookingRepo =
    new BookingRepository(

        AppDataSource.getRepository(
            Bookings
        )
    );

const bookingService =
    new BookingService(
        bookingRepo
    );

const bookingController =
    new BookingController(
        bookingService
    );

//
// LIST
//

router.get(
    "/",
    bookingController.listBookings
);

//
// DETAIL
//

router.get(
    "/:id",
    bookingController.getBooking
);

export default router;