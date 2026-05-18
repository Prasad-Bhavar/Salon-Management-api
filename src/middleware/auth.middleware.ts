import { Request, Response, NextFunction } from "express";
import { verifyToken } from "~/common/utils/jwt";
import { AppDataSource } from "~/config/database";
import { Users } from "~/modules/user/user.model";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                statusCode: 401,
                message: "Unauthorized: Token missing",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyToken(token);

        // Check user still exists
        const userRepo = AppDataSource.getRepository(Users);
        const user = await userRepo.findOne({
            where: { id: decoded.id },
            relations: ["role"],
        });

        if (!user || user.status !== "active") {
            return res.status(401).json({
                statusCode: 401,
                message: "Unauthorized: Invalid user",
            });
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role?.slug || "",

        };

        next();
    } catch (error) {
        return res.status(401).json({
            statusCode: 401,
            message: "Session Expired, Login again",
        });
    }
};