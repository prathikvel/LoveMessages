import { Types } from "mongoose";

import User from "../models/User";
import { MongoId } from "../../../types/mongodb";

// find all users
export const findUsers = () => {
  return User.find().lean().exec();
};

// find user by id
export const findUserById = (id: MongoId) => {
  typeof id === "string" && (id = new Types.ObjectId(id));
  return User.findById(id).lean().exec();
};

// validate user by id
export const isValidUserId = async (id: MongoId) => {
  typeof id === "string" && (id = new Types.ObjectId(id));
  if (await User.exists({ _id: id }).exec()) {
    return true;
  }
  throw new Error("Invalid User ID");
};
