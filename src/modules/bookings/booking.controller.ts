import {
    Request,
    Response,
} from "express";

import { BookingService } from "./booking.service";

import { asyncHandler } from "~/common/utils/asyncHandler";

import { apiResponse } from "~/common/utils/apiResponse";
export class BookingController {

    constructor(

        private service: BookingService
    ) { }

    //
    // LIST BOOKINGS
    //

    listBookings =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const response =
                    await this.service.listBookings(
                        req.query
                    );

                return apiResponse(
                    res,
                    response
                );
            }
        );

    //
    // GET BOOKING
    //

    getBooking =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const response =
                    await this.service.getBookingById(
                        req.params
                    );

                return apiResponse(
                    res,
                    response
                );
            }
        );


    // ── POST /bookings  →  create pending booking + payment intent ─────────────

    create = asyncHandler(async (req: any, res: Response) => {
        const customerId = Number(req.user.id);
        const response = await this.service.createBookingWithPaymentIntent(
            customerId,
            req.body,
        );
        console.log("Booking creation response:", response);
        return apiResponse(res, response);
    });

    // ── POST /bookings/confirm-payment ─────────────────────────────────────────

    confirmPayment = asyncHandler(async (req: any, res: Response) => {
        const response = await this.service.confirmPayment(req.body);
        return apiResponse(res, response);
    });

    // ── POST /bookings/webhook  (Stripe webhook, no auth middleware) ───────────

    webhook = asyncHandler(async (req: Request, res: Response) => {
        const sig = req.headers["stripe-signature"] as string;
        const secret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

        const response = await this.service.handleWebhook(
            req.body as Buffer, // must use express.raw() for this route
            sig,
            secret,
        );
        res.json(response);
    });

    // ── GET /bookings/:id ──────────────────────────────────────────────────────

    detail = asyncHandler(async (req: Request, res: Response) => {
        const response = await this.service.getBooking(Number(req.params.id));
        return apiResponse(res, response);
    });

    // ── GET /bookings/stripe-key ───────────────────────────────────────────────

    stripeKey = asyncHandler(async (_req: Request, res: Response) => {
        const response: any = await this.service.getPublishableKey();
        return apiResponse(res, response);
    });


    customerList = asyncHandler(async (req: any, res: Response) => {
        const customerId = Number(req.user.id);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const status = req.query.status as string | undefined;

        const response = await this.service.customerBookings(customerId, page, limit, status);
        return apiResponse(res, response);
    });

    cancel = asyncHandler(async (req: any, res: Response) => {
        const customerId = Number(req.user.id);
        const bookingId = Number(req.params.id);
        const response = await this.service.cancelBooking(bookingId, customerId);
        return apiResponse(res, response);
    });

}


