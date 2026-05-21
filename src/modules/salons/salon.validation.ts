import * as Yup from "yup";

//
// ENUMS
//

const SALON_STATUS = [
    "active",
    "inactive",
    "pending",
    "blocked",
] as const;

const SALON_TYPES = [
    "male",
    "female",
    "unisex",
] as const;

//
// ADDRESS VALIDATION
//

const addressValidation = Yup.object().shape({
    line1: Yup.string()
        .trim()
        .min(2, "Address line 1 is required")
        .max(255, "Address line 1 cannot exceed 255 characters")
        .required("Address line 1 is required"),

    line2: Yup.string()
        .trim()
        .max(255, "Address line 2 cannot exceed 255 characters")
        .nullable(),

    city: Yup.string()
        .trim()
        .min(2, "City is required")
        .max(100, "City cannot exceed 100 characters")
        .required("City is required"),

    state: Yup.string()
        .trim()
        .min(2, "State is required")
        .max(100, "State cannot exceed 100 characters")
        .required("State is required"),

    pincode: Yup.string()
        .trim()
        .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
        .required("Pincode is required"),
});

//
// CREATE SALON
//

export const createSalonSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .min(2, "Salon name must be at least 2 characters")
        .max(255, "Salon name cannot exceed 255 characters")
        .required("Salon name is required"),

    salon_type: Yup.string()
        .oneOf(SALON_TYPES, "Invalid salon type")
        .required("Salon type is required"),

    owner_id: Yup.number()
        .typeError("Owner is required")
        .required("Owner is required"),

    status: Yup.string()
        .oneOf(SALON_STATUS, "Invalid status")
        .required("Status is required"),

    email: Yup.string()
        .trim()
        .email("Invalid email address")
        .max(255, "Email cannot exceed 255 characters")
        .required("Salon email is required"),

    contact_number: Yup.string()
        .trim()
        .matches(
            /^[0-9]{10}$/,
            "Contact number must be 10 digits"
        )
        .required("Contact number is required"),

    address: addressValidation.required(),
});

//
// UPDATE SALON
//

export const updateSalonSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .min(2, "Salon name must be at least 2 characters")
        .max(255, "Salon name cannot exceed 255 characters"),

    salon_type: Yup.string()
        .oneOf(SALON_TYPES, "Invalid salon type"),

    owner_id: Yup.number()
        .typeError("Owner is required"),

    status: Yup.string()
        .oneOf(SALON_STATUS, "Invalid status"),

    email: Yup.string()
        .trim()
        .email("Invalid email address")
        .max(255, "Email cannot exceed 255 characters"),

    contact_number: Yup.string()
        .trim()
        .matches(
            /^[0-9]{10}$/,
            "Contact number must be 10 digits"
        ),

    address: addressValidation,
});

//
// PARAM VALIDATION
//

export const salonIdParamSchema = Yup.object().shape({
    id: Yup.number()
        .typeError("Salon id must be a number")
        .required("Salon id is required"),
});

//
// LIST QUERY VALIDATION
//

export const listSalonsQuerySchema = Yup.object().shape({
    page: Yup.number()
        .typeError("Page must be a number")
        .positive()
        .integer(),

    limit: Yup.number()
        .typeError("Limit must be a number")
        .positive()
        .integer()
        .max(100),

    search: Yup.string()
        .trim(),

    status: Yup.string()
        .oneOf(SALON_STATUS),

    salon_type: Yup.string()
        .oneOf(SALON_TYPES),

    owner_id: Yup.number()
        .typeError("Owner id must be a number"),

    sort: Yup.string(),

    order: Yup.string()
        .oneOf(["asc", "desc"]),
});

//
// STATUS UPDATE
//

export const updateSalonStatusSchema = Yup.object().shape({
    status: Yup.string()
        .oneOf(SALON_STATUS, "Invalid status")
        .required("Status is required"),
});