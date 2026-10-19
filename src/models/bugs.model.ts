import mongoose, { Document, Schema, Model } from "mongoose";

export interface IRequest {
  method?: string;
  url?: string;
  headers?: Record<string, any>;
  body?: Record<string, any>;
}

export interface IBugs extends Document {
  error: string;
  status: number;
  code: string;
  meta: Record<string, any>;
  request: IRequest;
  createdAt: Date;
  updatedAt: Date;
}

const BugsSchema: Schema<IBugs> = new Schema(
  {
    error: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Number,
      default: 500,
    },
    code: {
      type: String,
      default: "ERR_GENERIC",
      index: true,
    },
    meta: {
      type: Schema.Types.Mixed,
      default: {},
    },
    request: {
      method: {
        type: String,
      },
      url: {
        type: String,
      },
      headers: {
        type: Schema.Types.Mixed,
      },
      body: {
        type: Schema.Types.Mixed,
      },
    },
  },
  {
    timestamps: true,
    collection: "bugs",
  }
);

BugsSchema.index({ createdAt: -1 });

const BugsModel: Model<IBugs> = mongoose.model<IBugs>(
  "Bugs",
  BugsSchema
);

export default BugsModel;