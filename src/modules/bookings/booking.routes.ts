import { Router } from "express";
import express from "express";
import { AppDataSource } from "~/config/database";

import { Bookings } from "./bookings.model";

import { BookingRepository } from "./booking.repository";

import { BookingService } from "./booking.service";

import { BookingController } from "./booking.controller";

import { BookingServices } from "~/modules/bookings/booking-services.model";
import { BookingSlots } from "~/modules/bookings/booking-slots.model";
import { SalonServices } from "~/modules/salon-services/salon-services.model";
import { SalonAvailability } from "~/modules/salons/salon-availability.model";
import { Payments } from "~/modules/payments/payments.model";
import { PaymentGatewayLogs } from "~/modules/payments/payment-gateway-logs.model";
import { Settings } from "~/modules/settings/settings.model";

const router = Router();

//
// INIT
//

const bookingRepo =
    new BookingRepository(
        AppDataSource,
        AppDataSource.getRepository(Bookings),
        AppDataSource.getRepository(BookingServices),
        AppDataSource.getRepository(BookingSlots),
        AppDataSource.getRepository(SalonServices),
        AppDataSource.getRepository(SalonAvailability),
        AppDataSource.getRepository(Payments),
        AppDataSource.getRepository(PaymentGatewayLogs),
        AppDataSource.getRepository(Settings),
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
// WEBHOOK
//

router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    bookingController.webhook,
);

//
// STRIPE
//

router.get(
    "/stripe-key",
    bookingController.stripeKey
);

//
// CUSTOMER BOOKINGS
//

router.get(
    "/customer",
    bookingController.customerList
);

//
// CONFIRM BOOKING
//

router.get(
    "/confirm/:id",
    bookingController.detail
);

router.post(
    "/confirm",
    bookingController.create
);

router.post(
    "/confirm-payment",
    bookingController.confirmPayment
);

//
// CANCEL BOOKING
//

router.post(
    "/:id/cancel",
    bookingController.cancel
);

//
// LIST BOOKINGS
//

router.get(
    "/",
    bookingController.listBookings
);

//
// GET SINGLE BOOKING
// KEEP THIS ALWAYS LAST
//

router.get(
    "/:id",
    bookingController.getBooking
);
export default router;