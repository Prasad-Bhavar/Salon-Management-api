import bcrypt from "bcrypt";

import {
    AppDataSource,
} from "~/config/database";

import {
    Users,
} from "~/modules/users/users.model";

import {
    generateToken,
} from "~/common/utils/jwt";

export class AuthService {

    private userRepo =
        AppDataSource.getRepository(
            Users
        );

    //
    // LOGIN
    //

    async login(body: {

        email: string;

        password: string;

    }) {

        try {

            const {
                email,
                password,
            } = body;

            //
            // FIND USER
            //

            const user =
                await this.userRepo

                    .createQueryBuilder(
                        "user"
                    )

                    .leftJoinAndSelect(
                        "user.role",
                        "role"
                    )

                    .addSelect(
                        "user.password"
                    )

                    .where(
                        "LOWER(user.email) = LOWER(:email)",
                        {
                            email,
                        }
                    )

                    .getOne();

            //
            // INVALID USER
            //

            if (!user) {

                throw {

                    statusCode: 401,

                    message:
                        "Invalid email or password",
                };
            }

            //
            // INACTIVE USER
            //

            if (
                user.status !==
                "active"
            ) {

                throw {

                    statusCode: 403,

                    message:
                        "User account is inactive",
                };
            }

            //
            // CHECK PASSWORD
            //

            const isMatch =
                await bcrypt.compare(

                    password,

                    user.password
                );

            if (!isMatch) {

                throw {

                    statusCode: 401,

                    message:
                        "Invalid email or password",
                };
            }

            //
            // GENERATE TOKEN
            //

            const token =
                generateToken({

                    id:
                        user.id,

                    email:
                        user.email,

                    role:
                        user.role?.slug ||
                        "",
                });

            //
            // RESPONSE
            //

            return {

                statusCode: 200,

                message:
                    "Login successful",

                data: {

                    id:
                        user.id,

                    name:
                        user.name,

                    email:
                        user.email,

                    role:
                        user.role?.slug ||
                        null,

                    token,
                },
            };

        } catch (error: any) {

            if (
                error.statusCode &&
                error.message
            ) {

                throw error;
            }

            throw {

                statusCode: 500,

                message:
                    "Something went wrong. Please try again.",
            };
        }
    }
}