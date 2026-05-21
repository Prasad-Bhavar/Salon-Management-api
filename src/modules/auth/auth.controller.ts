import {
    Request,
    Response,
} from "express";

import {
    AuthService,
} from "./auth.service";

import {
    asyncHandler,
} from "~/common/utils/asyncHandler";

import {
    apiResponse,
} from "~/common/utils/apiResponse";

export class AuthController {

    constructor(
        private service: AuthService
    ) { }

    //
    // LOGIN
    //

    login =
        asyncHandler(

            async (
                req: Request,
                res: Response
            ) => {
                const response =
                    await this.service.login(
                        req.body
                    );

                return apiResponse(
                    res,
                    response
                );
            }
        );
}