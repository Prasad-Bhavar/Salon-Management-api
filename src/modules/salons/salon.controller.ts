import { Request, Response } from "express";

import { SalonService } from "./salon.service";

import { asyncHandler } from "~/common/utils/asyncHandler";
import { apiResponse } from "~/common/utils/apiResponse";

export class SalonController {

    constructor(
        private service: SalonService
    ) { }

    //
    // LIST SALONS
    //

    listSalons = asyncHandler(
        async (req: Request, res: Response) => {
            const response =
                await this.service.listSalons(
                    req.query
                );
            return apiResponse(
                res,
                response
            );
        }
    );

    //
    // GET SALON BY ID
    //

    getSalon = asyncHandler(
        async (req: Request, res: Response) => {

            const response =
                await this.service.getSalonById(
                    req.params
                );
            return apiResponse(
                res,
                response
            );
        }
    );

    //
    // CREATE SALON
    //

    createSalon = asyncHandler(
        async (req: Request, res: Response) => {

            const response =
                await this.service.createSalon(
                    req.body
                );

            return apiResponse(
                res,
                response
            );
        }
    );

    //
    // UPDATE SALON
    //

    updateSalon = asyncHandler(
        async (req: Request, res: Response) => {

            const response =
                await this.service.updateSalon(
                    req.params,
                    req.body
                );

            return apiResponse(
                res,
                response
            );
        }
    );

    //
    // UPDATE STATUS
    //

    updateSalonStatus = asyncHandler(
        async (req: Request, res: Response) => {

            const response =
                await this.service.updateSalonStatus(
                    req.params,
                    req.body
                );

            return apiResponse(
                res,
                response
            );
        }
    );

    //
    // GET OWNERS
    //

    getOwners = asyncHandler(
        async (req: Request, res: Response) => {

            const response =
                await this.service.getOwners();

            return apiResponse(
                res,
                response
            );
        }
    );
}