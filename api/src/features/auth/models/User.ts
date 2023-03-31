import { Schema, model, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  username: string;
  __v: number;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
});

userSchema.plugin(passportLocalMongoose);

export default model<IUser>("User", userSchema);
