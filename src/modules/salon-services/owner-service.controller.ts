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
    OwnerServicesService,
} from "./owner-service.service";

export class OwnerServicesController {

    constructor(
        private service:
            OwnerServicesService
    ) { }

    list =
        asyncHandler(
            async (
                req: any,
                res: Response
            ) => {

                const salonId =
                    Number(
                        req.user.salon_id!
                    );

                const response =
                    await this.service.list(
                        salonId
                    );

                return apiResponse(
                    res,
                    response
                );
            }
        );

    detail =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const response =
                    await this.service.detail(
                        Number(
                            req.params.id
                        )
                    );

                return apiResponse(
                    res,
                    response
                );
            }
        );

    create =
        asyncHandler(
            async (
                req: any,
                res: any
            ) => {

                const response =
                    await this.service.create({
                        ...req.body,
                        salon_id: req.user.salon_id!
                    }
                    );

                return apiResponse(
                    res,
                    response
                );
            }
        );

    update =
        asyncHandler(
            async (
                req: any,
                res: Response
            ) => {

                const response =
                    await this.service.update(

                        Number(req.params.id),

                        {
                            ...req.body,
                            salon_id:
                                req.user!.salon_id,
                        }
                    );

                return apiResponse(
                    res,
                    response
                );
            }
        );

    categories =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const response: any =
                    await this.service.categories();

                return apiResponse(
                    res,
                    response
                );
            }
        );

    services =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const response: any =
                    await this.service.services(

                        Number(
                            req.query.category_id
                        )
                    );

                return apiResponse(
                    res,
                    response
                );
            }
        );
}