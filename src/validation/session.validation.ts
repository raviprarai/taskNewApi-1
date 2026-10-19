
import Joi from "joi";

export const createSessionSchema = Joi.object({
    teacherId: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            "string.empty": "Teacher ID is required.",
            "string.hex": "Teacher ID must be a valid MongoDB ObjectId.",
            "string.length": "Teacher ID must be 24 characters long.",
            "any.required": "Teacher ID is required.",
        }),

    startTime: Joi.date()
        .iso()
        .required()
        .messages({
            "date.base": "Please provide a valid start time.",
            "any.required": "Start time is required.",
        }),

    endTime: Joi.date()
        .iso()
        .greater(Joi.ref("startTime"))
        .required()
        .messages({
            "date.base": "Please provide a valid end time.",
            "date.greater": "End time must be greater than start time.",
            "any.required": "End time is required.",
        }),
});
