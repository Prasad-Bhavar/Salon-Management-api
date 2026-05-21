import {
    Router,
} from "express";

import {
    AuthService,
} from "./auth.service";

import {
    AuthController,
} from "./auth.controller";

import {
    validate,
} from "~/middleware/validation.middleware";

import {
    loginSchema,
} from "./auth.validation";

const router =
    Router();

//
// INIT
//

const authService =
    new AuthService();

const authController =
    new AuthController(
        authService
    );

//
// LOGIN
//

router.post(

    "/login",

    validate(
        loginSchema,
        "body"
    ),

    authController.login
);

export default router;