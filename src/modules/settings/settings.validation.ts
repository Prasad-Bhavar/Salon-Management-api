import * as Yup from "yup";

export const updateSettingsSchema =
    Yup.object().shape({

        platform_commission:
            Yup.number()
                .typeError(
                    "Commission must be a number"
                )
                .min(
                    0,
                    "Minimum commission is 0%"
                )
                .max(
                    100,
                    "Maximum commission is 100%"
                )
                .required(
                    "Platform commission is required"
                ),

        slot_duration:
            Yup.number()

                .typeError(
                    "Slot duration must be a number"
                )
                .oneOf(
                    [15, 30, 45, 60],
                    "Invalid slot duration"
                )
                .required(
                    "Slot duration is required"
                ),
    });