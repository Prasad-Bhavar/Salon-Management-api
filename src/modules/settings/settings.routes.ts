import {
    Router,
} from "express";

import {
    AppDataSource,
} from "~/config/database";

import {
    Settings,
} from "./settings.model";

import {
    SettingsRepository,
} from "./settings.repository";

import {
    SettingsService,
} from "./settings.service";

import {
    SettingsController,
} from "./settings.controller";

const router =
    Router();

//
// INIT
//

const repository =
    new SettingsRepository(

        AppDataSource.getRepository(
            Settings
        )
    );

const service =
    new SettingsService(
        repository
    );

const controller =
    new SettingsController(
        service
    );

//
// ROUTES
//

router.get(
    "/",
    controller.getSettings
);

router.put(
    "/",
    controller.updateSettings
);

export default router;