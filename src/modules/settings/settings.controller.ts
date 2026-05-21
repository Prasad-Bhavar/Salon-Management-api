import {
    Request,
    Response,
} from "express";

import {
    SettingsService,
} from "./settings.service";

import {
    asyncHandler,
} from "~/common/utils/asyncHandler";

import {
    apiResponse,
} from "~/common/utils/apiResponse";

export class SettingsController {

    constructor(
        private service: SettingsService
    ) { }

    //
    // GET SETTINGS
    //

    getSettings =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const response =
                    await this.service.getSettings();

                return apiResponse(
                    res,
                    response
                );
            }
        );

    //
    // UPDATE SETTINGS
    //

    updateSettings =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const response =
                    await this.service.updateSettings(
                        req.body
                    );

                return apiResponse(
                    res,
                    response
                );
            }
        );
}