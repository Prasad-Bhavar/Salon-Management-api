import {
    BookingRepository,
} from "./booking.repository";

import Stripe from "stripe";

import {
    CreateBookingBody,
    ConfirmPaymentBody,
} from "./booking.types";

export class BookingService {

    constructor(

        private repository:
            BookingRepository
    ) { }

    //
    // LIST BOOKINGS
    //

    async listBookings(
        query: any
    ) {

        const safeQuery = {

            page:
                Number(query.page) || 1,

            limit:
                Number(query.limit) || 10,

            search:
                query.search,

            status:
                query.status,

            salon_id:
                query.salon_id
                    ? Number(
                        query.salon_id
                    )
                    : undefined,

            sort:
                query.sort,

            order:
                query.order,
        };

        const result =
            await this.repository.findAll(
                safeQuery
            );

        return {

            statusCode: 200,

            message:
                "Bookings fetched successfully",

            data: {

                data:
                    result.bookings,

                pagination: {

                    total:
                        result.total,

                    page:
                        safeQuery.page,

                    limit:
                        safeQuery.limit,

                    totalPages:
                        Math.ceil(
                            result.total /
                            safeQuery.limit
                        ),
                },
            },
        };
    }

    //
    // GET BOOKING
    //

    async getBookingById(
        params: any
    ) {

        const booking =
            await this.repository.findById(
                Number(params.id)
            );

        if (!booking) {

            throw {

                statusCode: 404,

                message:
                    "Booking not found",
            };
        }

        return {

            statusCode: 200,

            message:
                "Booking fetched successfully",

            data: booking,
        };
    }

    //
    // CREATE BOOKING + PAYMENT INTENT
    //

    async createBookingWithPaymentIntent(
        customerId: number,
        body: CreateBookingBody,
    ) {

        //
        // CREATE PENDING BOOKING
        //

        const {
            booking,
            payment,
            totalPrice,
        } =
            await this.repository.createPendingBooking(
                customerId,
                body
            );

        //
        // STRIPE KEYS
        //

        const stripeSecret =
            await this.repository.getStripeSecret();

        const stripePublishable =
            await this.repository.getStripePublishable();

        //
        // INIT STRIPE
        //

        const stripe =
            new Stripe(
                stripeSecret
            );

        //
        // CREATE PAYMENT INTENT
        //

        const paymentIntent =
            await stripe.paymentIntents.create({

                amount:
                    Math.round(
                        totalPrice * 100
                    ),

                currency: "inr",

                metadata: {

                    booking_id:
                        String(booking.id),

                    customer_id:
                        String(customerId),

                    payment_id:
                        String(payment.id),
                },

                description:
                    `Salon Booking #${booking.id}`,
            });

        //
        // RETURN RESPONSE
        //

        return {

            statusCode: 201,

            message:
                "Booking created. Complete payment to confirm.",

            data: {

                booking_id:
                    booking.id,

                payment_id:
                    payment.id,

                client_secret:
                    paymentIntent.client_secret,

                publishable_key:
                    stripePublishable,

                amount:
                    totalPrice,

                currency:
                    "inr",

                payment_intent_id:
                    paymentIntent.id,
            },
        };
    }

    //
    // CONFIRM PAYMENT
    //

    async confirmPayment(
        body: ConfirmPaymentBody
    ) {

        //
        // VALIDATION
        //

        if (
            !body.payment_intent_id
        ) {

            return {

                statusCode: 400,

                message:
                    "Payment intent id is required",

                data: null,
            };
        }

        //
        // GET STRIPE SECRET
        //

        const stripeSecret =
            await this.repository.getStripeSecret();

        //
        // INIT STRIPE
        //

        const stripe =
            new Stripe(
                stripeSecret
            );

        //
        // VERIFY PAYMENT INTENT
        //

        let paymentIntent: any;

        try {

            paymentIntent =
                await stripe.paymentIntents.retrieve(
                    body.payment_intent_id
                );

        } catch (err) {

            return {

                statusCode: 400,

                message:
                    "Invalid payment intent",

                data: null,
            };
        }

        //
        // STRICT PAYMENT STATUS CHECK
        //

        if (
            paymentIntent.status !==
            "succeeded"
        ) {

            //
            // MARK FAILED
            //

            if (
                body.booking_id
            ) {

                await this.repository.confirmPayment(

                    body.booking_id,

                    body.payment_intent_id,

                    "failed",

                    JSON.stringify(
                        paymentIntent
                    ),
                );
            }

            return {

                statusCode: 402,

                message:
                    "Payment not completed",

                data:
                    paymentIntent.status,
            };
        }

        //
        // GET BOOKING ID
        //

        const bookingId =
            body.booking_id ||
            Number(
                paymentIntent.metadata.booking_id
            );

        //
        // SAFETY CHECK
        //

        if (!bookingId) {

            return {

                statusCode: 400,

                message:
                    "Booking id not found",

                data: null,
            };
        }

        //
        // CONFIRM PAYMENT
        //

        const result =
            await this.repository.confirmPayment(

                bookingId,

                paymentIntent.id,

                "paid",

                JSON.stringify(
                    paymentIntent
                ),
            );

        //
        // RESPONSE
        //

        return {

            statusCode: 200,

            message:
                "Payment successful. Booking confirmed!",

            data:
                result,
        };
    }

    //
    // STRIPE WEBHOOK
    //

    async handleWebhook(

        rawBody: Buffer,

        signature: string,

        webhookSecret: string,
    ) {

        //
        // GET STRIPE SECRET
        //

        const stripeSecret =
            await this.repository.getStripeSecret();

        //
        // INIT STRIPE
        //

        const stripe =
            new Stripe(
                stripeSecret
            );

        //
        // CONSTRUCT EVENT
        //

        let event: any;

        try {

            event =
                stripe.webhooks.constructEvent(

                    rawBody,

                    signature,

                    webhookSecret,
                );

        } catch (error: any) {

            throw new Error(
                `Webhook signature verification failed: ${error.message}`
            );
        }

        //
        // PAYMENT SUCCESS
        //

        if (
            event.type ===
            "payment_intent.succeeded"
        ) {

            const paymentIntent =
                event.data.object as any; // Stripe.PaymentIntent;

            const bookingId =
                Number(
                    paymentIntent.metadata.booking_id
                );

            //
            // PREVENT DUPLICATE CONFIRMATION
            //

            if (bookingId) {

                await this.repository.confirmPayment(

                    bookingId,

                    paymentIntent.id,

                    "paid",

                    JSON.stringify(
                        paymentIntent
                    ),
                );
            }
        }

        //
        // PAYMENT FAILED
        //

        if (
            event.type ===
            "payment_intent.payment_failed"
        ) {

            const paymentIntent =
                event.data.object as any; // Stripe.PaymentIntent;

            const bookingId =
                Number(
                    paymentIntent.metadata.booking_id
                );

            if (bookingId) {

                await this.repository.confirmPayment(

                    bookingId,

                    paymentIntent.id,

                    "failed",

                    JSON.stringify(
                        paymentIntent
                    ),
                );
            }
        }

        //
        // RETURN
        //

        return {

            received: true,
        };
    }

    //
    // GET BOOKING DETAIL
    //

    async getBooking(
        bookingId: number
    ) {

        const booking =
            await this.repository.findBookingById(
                bookingId
            );

        if (!booking) {

            return {

                statusCode: 404,

                message:
                    "Booking not found",

                data: null,
            };
        }

        return {

            statusCode: 200,

            message:
                "Booking fetched",

            data:
                booking,
        };
    }

    //
    // STRIPE PUBLISHABLE KEY
    //

    async getPublishableKey() {

        const key =
            await this.repository.getStripePublishable();

        return {

            statusCode: 200,

            data: {

                publishable_key:
                    key,
            },
        };
    }



    async customerBookings(
        customerId: number,
        page: number,
        limit: number,
        status?: string,
    ) {
        const result = await this.repository.findByCustomer(customerId, page, limit, status);
        return { statusCode: 200, message: "Bookings fetched", data: result };
    }

    async cancelBooking(bookingId: number, customerId: number) {
        const result = await this.repository.cancelBooking(bookingId, customerId);
        return { statusCode: 200, message: "Booking cancelled successfully", data: result };
    }

}