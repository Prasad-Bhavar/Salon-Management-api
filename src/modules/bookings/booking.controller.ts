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
}