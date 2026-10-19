
import { Document, Model, Schema } from "mongoose";
import createModel from "../utils/models";

export interface IUser extends Document {
    fullName: string;
    email: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        strict: true,
        collection: "User",
        versionKey: false,
        timestamps: true,
    }
);

const UserModel: Model<IUser> = createModel(
    "User",
    userSchema
) as Model<IUser>;

export default UserModel;
