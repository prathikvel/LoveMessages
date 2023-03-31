import { Schema, model, Types } from "mongoose";

export interface ILoveMessage {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  recipient: Types.ObjectId;
  message: string;
  viewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const loveMessageSchema = new Schema<ILoveMessage>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
    viewedAt: Date,
  },
  { timestamps: true }
);

export default model<ILoveMessage>("LoveMessage", loveMessageSchema);
