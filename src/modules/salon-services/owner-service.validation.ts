import * as Yup from "yup";

export const createSalonServiceSchema =
    Yup.object().shape({

        salon_id:
            Yup.number()
                .required(),

        category_id:
            Yup.number()
                .required(
                    "Category is required"
                ),

        service_id:
            Yup.number()
                .required(
                    "Service is required"
                ),

        price:
            Yup.number()
                .required(
                    "Price is required"
                )
                .min(1),

        duration:
            Yup.number()
                .required(
                    "Duration is required"
                )
                .min(15),

        description:
            Yup.string()
                .nullable()
                .max(500),

        status:
            Yup.boolean()
                .required(),
    });

export const updateSalonServiceSchema =
    createSalonServiceSchema;