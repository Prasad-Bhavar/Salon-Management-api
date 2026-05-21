// owner-barbers.validation.ts

import * as Yup from "yup";

export const createBarberSchema =
    Yup.object().shape({

        salon_id:
            Yup.number()
                .required(),

        name:
            Yup.string()
                .required(
                    "Barber name is required"
                )
                .max(255),

        email:
            Yup.string()
                .email(
                    "Invalid email"
                )
                .required(
                    "Email is required"
                ),

        contact1:
            Yup.string()
                .required(
                    "Contact number is required"
                )
                .max(20),

        gender:
            Yup.string()
                .oneOf([
                    "male",
                    "female",
                    "other",
                ])
                .required(),

        status:
            Yup.string()
                .oneOf([
                    "active",
                    "inactive",
                    "on_leave",
                ])
                .required(),

        specialization:
            Yup.string()
                .nullable()
                .max(500),

        services:
            Yup.array()
                .of(
                    Yup.number()
                )
                .min(
                    1,
                    "At least one service is required"
                )
                .required(),
    });

export const updateBarberSchema =
    createBarberSchema;