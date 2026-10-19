
import { Request } from "express";
import SessionModel from "../../models/sessionModel";
import TeacherModel from "../../models/teacherModel";
import { getMessages } from "../../utils/getMessages";
import { ServiceResponse } from "../../utils/serviceResponse";
import UserModel from "../../models/auth.model";
import mongoose from "mongoose";

export const createSession = async (
    req: Request
): Promise<ServiceResponse<any>> => {
    const msg = getMessages(req);

    try {
        const { teacherId, startTime, endTime } = req.body;
        const userId = req.userData?._id;

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime()) ||
            end <= start
        ) {
            return {
                status: 0,
                message: "Valid dates are required and endTime must be greater than startTime",
                data: {},
            };
        }

        const teacher = await TeacherModel.findById(teacherId);

        if (!teacher) {
            return {
                status: 2,
                message: "Teacher not found",
                data: {},
            };
        }

        const session = await SessionModel.create({
            teacherId: teacher._id,
            userId: userId || null,
            startTime: start,
            endTime: end,
        });

        return {
            status: 1,
            message: "Session created successfully",
            data: session,
        };
    } catch (error: any) {
        console.error("createSession error:", error);

        return {
            status: -1,
            message: error.message || msg.errorMsg,
            data: {},
        };
    }
};

export const getAvailableSessions = async (
    req: Request
): Promise<ServiceResponse<any>> => {
    const msg = getMessages(req);

    try {
        const { dateTimestamp } = req.query;
        if (
            typeof dateTimestamp !== "string" ||
            dateTimestamp.trim() === ""
        ) {
            return {
                status: 0,
                message: "dateTimestamp is required",
                data: {},
            };
        }

        const timestamp = Number(dateTimestamp);

        if (!Number.isFinite(timestamp)) {
            return {
                status: 0,
                message: "Invalid dateTimestamp",
                data: {},
            };
        }

        const selectedDate = new Date(timestamp);

        if (Number.isNaN(selectedDate.getTime())) {
            return {
                status: 0,
                message: "Invalid dateTimestamp",
                data: {},
            };
        }

        const startOfDay = new Date(selectedDate);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

        // MongoDB Aggregation Pipeline
        const sessions = await SessionModel.aggregate([
            {
                $match: {
                    status: "AVAILABLE",
                    startTime: {
                        $gte: startOfDay,
                        $lt: endOfDay,
                    },
                },
            },
            {
                $lookup: {
                    from: "Teacher",
                    localField: "teacherId",
                    foreignField: "_id",
                    as: "teacher",
                },
            },
            {
                $unwind: {
                    path: "$teacher",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    teacherId: 1,
                    userId: 1,
                    startTime: 1,
                    endTime: 1,
                    status: 1,
                    completedAt: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    teacher: {
                        _id: "$teacher._id",
                        fullName: "$teacher.fullName",
                        email: "$teacher.email",
                        specialization: "$teacher.specialization",
                        experience: "$teacher.experience",
                    },
                },
            },
            {
                $sort: {
                    startTime: 1,
                },
            },
        ]);

        return {
            status: 1,
            message: "Available sessions fetched successfully",
            data: sessions,
        };
    } catch (error: any) {
        console.error("getAvailableSessions error:", error);

        return {
            status: -1,
            message: error.message || msg.errorMsg,
            data: {},
        };
    }
};

export const bookSession = async (
    req: Request
): Promise<ServiceResponse<any>> => {
    const msg = getMessages(req);

    try {
        const { id } = req.params;

        // Get userId from verified JWT token
        const userId = req.userData?._id;

        if (!userId) {
            return {
                status: 0,
                message: "Unauthorized user",
                data: {},
            };
        }

        // Validate session ID
        if (!mongoose.isValidObjectId(id)) {
            return {
                status: 0,
                message: "Invalid session ID",
                data: {},
            };
        }

        // Check user exists
        const user = await UserModel.findById(userId);

        if (!user) {
            return {
                status: 2,
                message: "User not found",
                data: {},
            };
        }

        // Atomically book only an AVAILABLE session
        const session = await SessionModel.findOneAndUpdate(
            {
                _id: id,
                status: "AVAILABLE",
            },
            {
                $set: {
                    userId: user._id,
                    status: "BOOKED",
                },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!session) {
            // Find why booking failed
            const existingSession = await SessionModel.findById(id);

            if (!existingSession) {
                return {
                    status: 2,
                    message: "Session not found",
                    data: {},
                };
            }

            return {
                status: 0,
                message: "Session is not available for booking",
                data: {},
            };
        }

        return {
            status: 1,
            message: "Session booked successfully",
            data: session,
        };
    } catch (error: any) {
        console.error("bookSession error:", error);

        return {
            status: -1,
            message: error.message || msg.errorMsg,
            data: {},
        };
    }
};

export const completeSession = async (
    req: Request
): Promise<ServiceResponse<any>> => {
    const msg = getMessages(req);

    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return {
                status: 0,
                message: "Invalid session ID",
                data: {},
            };
        }

        const session = await SessionModel.findOneAndUpdate(
            {
                _id: id,
                status: "BOOKED",
            },
            {
                $set: {
                    status: "COMPLETED",
                    completedAt: new Date(),
                },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!session) {
            const existingSession = await SessionModel.findById(id);

            if (!existingSession) {
                return {
                    status: 2,
                    message: "Session not found",
                    data: {},
                };
            }

            return {
                status: 0,
                message: "Only BOOKED sessions can be marked as completed",
                data: {},
            };
        }

        return {
            status: 1,
            message: "Session marked as completed successfully",
            data: session,
        };
    } catch (error: any) {
        console.error("completeSession error:", error);

        return {
            status: -1,
            message: error.message || msg.errorMsg,
            data: {},
        };
    }
};
