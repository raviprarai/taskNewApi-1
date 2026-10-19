
import Joi from "joi";

export const registerUserSchema = Joi.object({
    fullName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "Full name is required.",
            "string.min": "Full name must be at least 2 characters.",
            "string.max": "Full name cannot exceed 100 characters.",
            "any.required": "Full name is required.",
        }),

    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .required()
        .messages({
            "string.empty": "Email is required.",
            "string.email": "Please enter a valid email address.",
            "any.required": "Email is required.",
        }),

    phone: Joi.string()
        .trim()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            "string.empty": "Phone number is required.",
            "string.pattern.base": "Phone number must be exactly 10 digits.",
            "any.required": "Phone number is required.",
        }),
});
