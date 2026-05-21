import { Request, Response, NextFunction } from "express";
import { verifyToken } from "~/common/utils/jwt";
import { AppDataSource } from "~/config/database";
import { Users } from "~/modules/users/users.model";
import { Salons } from "~/modules/salons/salons.model";
export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
        salon_id?: number;
    };
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {

        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                statusCode: 401,
                message: "Unauthorized: Token missing",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyToken(token);

        const userRepo =
            AppDataSource.getRepository(Users);

        const salonRepo =
            AppDataSource.getRepository(Salons);

        const user =
            await userRepo.findOne({
                where: {
                    id: decoded.id,
                },
                relations: ["role"],
            });

        if (
            !user ||
            user.status !== "active"
        ) {
            return res.status(401).json({
                statusCode: 401,
                message: "Unauthorized: Invalid user",
            });
        }

        //
        // FETCH OWNER SALON
        //

        let salonId: number | undefined;

        if (user.role?.slug === "owner") {

            const salon =
                await salonRepo.findOne({
                    where: {
                        owner: {
                            id: user.id,
                        },
                    },
                });

            salonId = salon?.id;
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role?.slug || "",
            salon_id: salonId,
        };

        next();

    } catch (error) {

        return res.status(401).json({
            statusCode: 401,
            message: "Session Expired, Login again",
        });
    }
};