import { Request, Response } from "express";
import { asyncHandler } from "~/common/utils/asyncHandler";
import { apiResponse } from "~/common/utils/apiResponse";
import { FavouriteSalonsService } from "./favourite-salons.service";

export class FavouriteSalonsController {

    constructor(
        private service: FavouriteSalonsService
    ) { }

    //
    // LIST — GET /favourite-salons
    //

    list = asyncHandler(async (req: any, res: Response) => {

        const customerId = Number(req.user.id);

        const response = await this.service.list(customerId);

        return apiResponse(res, response);
    });

    //
    // TOGGLE — POST /favourite-salons/toggle/:salonId
    //

    toggle = asyncHandler(async (req: any, res: Response) => {

        const customerId = Number(req.user.id);
        const salonId = Number(req.params.salonId);

        const response = await this.service.toggle(customerId, salonId);

        return apiResponse(res, response);
    });

    //
    // ADD — POST /favourite-salons/:salonId
    //

    add = asyncHandler(async (req: any, res: Response) => {

        const customerId = Number(req.user.id);
        const salonId = Number(req.params.salonId);

        const response = await this.service.add(customerId, salonId);

        return apiResponse(res, response);
    });

    //
    // REMOVE — DELETE /favourite-salons/:salonId
    //

    remove = asyncHandler(async (req: any, res: Response) => {

        const customerId = Number(req.user.id);
        const salonId = Number(req.params.salonId);

        const response = await this.service.remove(customerId, salonId);

        return apiResponse(res, response);
    });

    //
    // CHECK — GET /favourite-salons/check/:salonId
    //

    check = asyncHandler(async (req: any, res: Response) => {

        const customerId = Number(req.user.id);
        const salonId = Number(req.params.salonId);

        const response = await this.service.check(customerId, salonId);

        return apiResponse(res, response);
    });
}