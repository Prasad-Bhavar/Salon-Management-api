import jwt, { SignOptions } from "jsonwebtoken";

interface JwtPayload {
    id: number;
    email: string;
    role: string;
}

const signOptions: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"],
};

export const generateToken = (payload: JwtPayload): string => {
    const jwtSecret = process.env.JWT_SECRET as string;
    if (!jwtSecret) {
        throw {
            statusCode: 500,
            message: "Login failed",
        };
    }
    return jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        signOptions
    );
};

export const verifyToken = (token: string): JwtPayload => {

    return jwt.verify(
        token,
        process.env.JWT_SECRET as string
    ) as JwtPayload;
};

export function generateResetToken(payload: any, expiresIn = process.env.RESET_LINK_EXPIRES_IN) {
    const JWT_RESET_SECRET = process.env.JWT_SECRET;
    if (!JWT_RESET_SECRET) {
        throw {
            statusCode: 500,
            message: "token failed",
        };
    }
    return jwt.sign(payload, JWT_RESET_SECRET, {
        expiresIn: expiresIn as SignOptions["expiresIn"],
    });
}