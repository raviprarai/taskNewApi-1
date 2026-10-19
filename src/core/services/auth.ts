import { Request } from "express";
import mongoose from "mongoose"
import { getMessages } from "../../utils/getMessages";
import { ServiceResponse } from "../../utils/serviceResponse";
import { generateJwtToken } from "../../utils/jwt";
import UserModel from "../../models/auth.model";
import SessionModel from "../../models/sessionModel";

export const createAccount = async (
    req: Request
): Promise<ServiceResponse<any>> => {
    const msg = getMessages(req);
    try {
        const { fullName, email, phone } = req.body;
        const existing = await UserModel.findOne({ phone });
        if (existing) {
            return { data: {}, message: msg.mobileAlready, status: 0 };
        }
        const existings = await UserModel.findOne({ email: email.trim().toLowerCase() });
        if (existings) {
            return { data: {}, message: msg.emailAlready, status: 0 };
        }

        const user = await UserModel.create({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
        });
        const payload = {
            _id: user._id,
            email: user.email,
        };
        const { token: access_token } = generateJwtToken(
            payload,
            "12h"
        );
        return {
            status: 1,
            message: msg.CreateAccount,
            data: {
                _id: user._id,
                email: user.email,
                access_token
            }
        };
    } catch (error: any) {
        console.error(" error:", error);
        return {
            status: -1,
            message: error.message || msg.errorMsg,
            data: {}
        };
    }
};

export const getUserSessions = async (
    req: Request
): Promise<ServiceResponse<any>> => {
    const msg = getMessages(req);

    try {
         const userId = req.userData?._id;

        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Check whether user exists
        const user = await UserModel.findById(userObjectId)
            .select("_id fullName email phone")
            .lean();

        if (!user) {
            return {
                status: 2,
                message: "User not found",
                data: {},
            };
        }

        const currentDate = new Date();

        const result = await SessionModel.aggregate([
            {
                $match: {
                    userId: userObjectId,
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
                $facet: {
                    upcomingSessions: [
                        {
                            $match: {
                                status: "BOOKED",
                                startTime: { $gte: currentDate },
                            },
                        },
                        {
                            $sort: { startTime: 1 },
                        },
                    ],
                    completedSessions: [
                        {
                            $match: {
                                status: "COMPLETED",
                            },
                        },
                        {
                            $sort: { completedAt: -1 },
                        },
                    ],
                },
            },
        ]);

        const sessions = result[0] || {
            upcomingSessions: [],
            completedSessions: [],
        };

        return {
            status: 1,
            message: "User sessions fetched successfully",
            data: {
                user,
                upcomingSessions: sessions.upcomingSessions,
                completedSessions: sessions.completedSessions,
            },
        };
    } catch (error: any) {
        console.error("getUserSessions error:", error);

        return {
            status: -1,
            message: error.message || msg.errorMsg,
            data: {},
        };
    }
};