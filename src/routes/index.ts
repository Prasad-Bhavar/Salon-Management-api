import { Router } from "express";



const router = Router();

router.use("/health-check", () => {
    console.log("Health check route");
});

export default router;