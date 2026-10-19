
import {
    Document,
    Model,
    Schema,
    Types,
} from "mongoose";
import createModel from "../utils/models";

export type SessionStatus =
    | "AVAILABLE"
    | "BOOKED"
    | "COMPLETED";

export interface ISession extends Document {
    teacherId: Types.ObjectId;
    userId: Types.ObjectId | null;
    startTime: Date;
    endTime: Date;
    status: SessionStatus;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
    {
        teacherId: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["AVAILABLE", "BOOKED", "COMPLETED"],
            default: "AVAILABLE",
            required: true,
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        collection: "Session",
    }
);

const SessionModel: Model<ISession> = createModel(
    "Session",
    sessionSchema
) as Model<ISession>;

export default SessionModel;
