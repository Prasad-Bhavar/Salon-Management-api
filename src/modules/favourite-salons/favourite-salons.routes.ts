import { Router } from "express";
import { AppDataSource } from "~/config/database";
import { FavoriteSalons } from "~/modules/favourite-salons/favourite-salons.model";
import { Salons } from "~/modules/salons/salons.model";
import { FavouriteSalonsRepository } from "./favourite-salons.repository";
import { FavouriteSalonsService } from "./favourite-salons.service";
import { FavouriteSalonsController } from "./favourite-salons.controller";

const router = Router();

const repository = new FavouriteSalonsRepository(
    AppDataSource.getRepository(FavoriteSalons),
    AppDataSource.getRepository(Salons),
);

const service = new FavouriteSalonsService(repository);

const controller = new FavouriteSalonsController(service);

// GET  /favourite-salons             — list all favourites for logged-in customer
router.get("/", controller.list);

// GET  /favourite-salons/check/:salonId — check if a salon is favourited
router.get("/check/:salonId", controller.check);

// POST /favourite-salons/toggle/:salonId — add if not present, remove if present
router.post("/toggle/:salonId", controller.toggle);

// POST /favourite-salons/:salonId    — explicitly add
router.post("/:salonId", controller.add);

// DELETE /favourite-salons/:salonId  — explicitly remove
router.delete("/:salonId", controller.remove);

export default router;