import { Router } from "express";

import { AppDataSource } from "~/config/database";

//
// MODELS
//

import { Salons } from "./salons.model";
import { Addresses } from "~/modules/addresses/addresses.model";
import { Users } from "~/modules/users/users.model";
import { Payments } from "~/modules/payments/payments.model";
import { Bookings } from "~/modules/bookings/bookings.model";
import { SalonBankDetails } from "./salon-bank-details.model";
import { Barbers } from "~/modules/barbers/barbers.model";

//
// REPOSITORY / SERVICE / CONTROLLER
//

import { SalonRepository } from "./salon.repository";
import { SalonService } from "./salon.service";
import { SalonController } from "./salon.controller";

//
// VALIDATION
//

import { validate } from "~/middleware/validation.middleware";

import {
    createSalonSchema,
    updateSalonSchema,
    salonIdParamSchema,
    listSalonsQuerySchema,
    updateSalonStatusSchema,
} from "./salon.validation";

//
// OPTIONAL RBAC
//

// import { checkRoute } from "~/middleware/rbac.middleware";

const router = Router();

//
// INITIALIZE REPOSITORIES
//

const salonRepo = new SalonRepository(

    AppDataSource.getRepository(Salons),

    AppDataSource.getRepository(Addresses),

    AppDataSource.getRepository(Users),

    AppDataSource.getRepository(Payments),

    AppDataSource.getRepository(Bookings),

    AppDataSource.getRepository(SalonBankDetails),

    AppDataSource.getRepository(Barbers)
);

//
// SERVICE
//

const salonService =
    new SalonService(salonRepo);

//
// CONTROLLER
//

const salonController =
    new SalonController(salonService);

//
// LIST SALONS
//

router.get(
    "/",
    salonController.listSalons
);

//
// GET OWNERS
//

router.get(
    "/owners",

    salonController.getOwners
);

//
// GET SALON DETAIL
//

router.get(
    "/:id",

    validate(
        salonIdParamSchema,
        "params"
    ),

    salonController.getSalon
);

//
// CREATE SALON
//

router.post(
    "/",

    // checkRoute("/salons"),

    validate(
        createSalonSchema,
        "body"
    ),

    salonController.createSalon
);

//
// UPDATE SALON
//

router.put(
    "/:id",

    // checkRoute("/salons"),

    validate(
        salonIdParamSchema,
        "params"
    ),

    validate(
        updateSalonSchema,
        "body"
    ),

    salonController.updateSalon
);

//
// UPDATE STATUS
//

router.put(
    "/:id/status",

    // checkRoute("/salons"),

    validate(
        salonIdParamSchema,
        "params"
    ),

    validate(
        updateSalonStatusSchema,
        "body"
    ),

    salonController.updateSalonStatus
);

export default router;