import { Router } from "express";

import salonRoutes from "../modules/salons/salon.routes";
import bookingRoutes from "~/modules/bookings/booking.routes";
import settingRoutes from "~/modules/settings/settings.routes";
import authRoutes from "~/modules/auth/auth.routes";
import salonServiceRoutes from "~/modules/salon-services/owner-service.routes";
import { authMiddleware } from "~/middleware/auth.middleware";
import barberRoutes from "~/modules/barbers/barbers.routes";
import favouriteSalonsRoutes from "~/modules/favourite-salons/favourite-salons.routes";
import exploreSalonsRoutes from "~/modules/explore-salons/explore-salons.routes";
import slotLockingRoutes from "~/modules/slot-locking/slot-locking.routes";
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


//customer routes
router.use("/favourite-salons", authMiddleware, favouriteSalonsRoutes);
router.use("/explore-salons", authMiddleware, exploreSalonsRoutes);

router.use("/slot-locking", authMiddleware, slotLockingRoutes);
export default router;