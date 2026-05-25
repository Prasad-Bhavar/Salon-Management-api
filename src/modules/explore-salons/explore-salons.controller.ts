import {
    Request,
    Response,
} from "express";

import {
    asyncHandler,
} from "~/common/utils/asyncHandler";

import {
    apiResponse,
} from "~/common/utils/apiResponse";

import {
    ExploreSalonsService,
} from "./explore-salons.service";

export class ExploreSalonsController {

    constructor(
        private service:
            ExploreSalonsService
    ) { }

    //
    // LIST EXPLORE SALONS
    // GET /explore-salons
    //

    list =
        asyncHandler(
            async (
                req: any,
                res: Response
            ) => {

                const customerId =
                    Number(req.user.id);

                const response =
                    await this.service.list(
                        customerId,
                        {
                            page:
                                req.query.page
                                    ? Number(req.query.page)
                                    : 1,

                            limit:
                                req.query.limit
                                    ? Number(req.query.limit)
                                    : 10,

                            search:
                                req.query.search,

                            city:
                                req.query.city,

                            salon_type:
                                req.query.salon_type,
                        }
                    );

                return apiResponse(
                    res,
                    response
                );
            }
        );


    //
    // DETAIL
    // GET /explore-salons/:salonId
    //

    detail =
        asyncHandler(
            async (
                req: any,
                res: Response
            ) => {

                const customerId =
                    Number(req.user.id);

                const salonId =
                    Number(req.params.salonId);

                const response =
                    await this.service.detail(
                        customerId,
                        salonId
                    );

                return apiResponse(
                    res,
                    response
                );
            }
        );

    //
    // AVAILABLE DATES
    // GET /explore-salons/:salonId/available-dates
    //

    availableDates =
        asyncHandler(
            async (
                req: any,
                res: Response
            ) => {

                const salonId =
                    Number(
                        req.params.salonId
                    );

                const response =
                    await this.service.availableDates(
                        salonId
                    );

                return apiResponse(
                    res,
                    response
                );
            }
        );

    //
    // SERVICES
    // GET /explore-salons/:salonId/services
    //

    services =
        asyncHandler(
            async (
                req: any,
                res: Response
            ) => {

                const salonId =
                    Number(
                        req.params.salonId
                    );

                const response =
                    await this.service.services(
                        salonId
                    );

                return apiResponse(
                    res,
                    response
                );
            }
        );

    //
    // AVAILABLE SLOTS
    // POST /explore-salons/:salonId/available-slots
    //

    availableSlots =
        asyncHandler(
            async (
                req: any,
                res: Response
            ) => {

                const salonId =
                    Number(
                        req.params.salonId
                    );

                const response =
                    await this.service.availableSlots(
                        salonId,
                        {
                            date:
                                req.body.date,

                            service_ids:
                                req.body.service_ids,
                        }
                    );

                return apiResponse(
                    res,
                    response
                );
            }
        );
}