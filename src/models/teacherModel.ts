
import { Document, Model, Schema } from "mongoose";
import createModel from "../utils/models";

export interface ITeacher extends Document {
    fullName: string;
    email: string;
    specialization: string;
    experience: number;
    createdAt: Date;
    updatedAt: Date;
}

const teacherSchema = new Schema<ITeacher>(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        specialization: {
            type: String,
            required: true,
            trim: true,
        },
        experience: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        collection: "Teacher",
    }
);

const TeacherModel: Model<ITeacher> = createModel(
    "Teacher",
    teacherSchema
) as Model<ITeacher>;

export default TeacherModel;
