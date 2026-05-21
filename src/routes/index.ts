import { Router } from "express";

import salonRoutes from "../modules/salons/salon.routes";
import bookingRoutes from "~/modules/bookings/booking.routes";
import settingRoutes from "~/modules/settings/settings.routes";
import authRoutes from "~/modules/auth/auth.routes";
import salonServiceRoutes from "~/modules/salon-services/owner-service.routes";
import { authMiddleware } from "~/middleware/auth.middleware";
import barberRoutes from "~/modules/barbers/barbers.routes";
const router = Router();

router.use("/health-check", () => {
    console.log("Health check route");
});
router.use("/auth", authRoutes);

//admin routes
router.use("/salons", authMiddleware, salonRoutes);
router.use("/bookings", authMiddleware, bookingRoutes);
router.use("/settings", authMiddleware, settingRoutes);

//owner routes
router.use('/salon-services', authMiddleware, salonServiceRoutes);
router.use('/barbers', authMiddleware, barberRoutes);

export default router;