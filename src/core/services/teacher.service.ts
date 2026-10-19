
import { Request } from "express";
import TeacherModel from "../../models/teacherModel";
import { getMessages } from "../../utils/getMessages";
import { ServiceResponse } from "../../utils/serviceResponse";

export const createTeacher = async (
    req: Request
): Promise<ServiceResponse<any>> => {
    const msg = getMessages(req);

    try {
        const {
            fullName,
            email,
            specialization,
            experience,
        } = req.body;

        const existingTeacher = await TeacherModel.findOne({
            email: email.trim().toLowerCase(),
        });

        if (existingTeacher) {
            return {
                status: 0,
                message: "Teacher email already exists",
                data: {},
            };
        }

        const teacher = await TeacherModel.create({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            specialization: specialization.trim(),
            experience,
        });

        return {
            status: 1,
            message: "Teacher created successfully",
            data: teacher,
        };
    } catch (error: any) {
        console.error("createTeacher error:", error);

        if (error.code === 11000) {
            return {
                status: 0,
                message: "Teacher email already exists",
                data: {},
            };
        }

        return {
            status: -1,
            message: error.message || msg.errorMsg,
            data: {},
        };
    }
};
