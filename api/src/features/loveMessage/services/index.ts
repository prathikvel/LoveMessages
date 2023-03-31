import { Types } from "mongoose";

import LoveMessage, { ILoveMessage } from "../models/LoveMessage";
import { MongoId } from "../../../types/mongodb";

// find all loveMessages
export const findLoveMessages = () => {
  return LoveMessage.find().lean().populate(["author", "recipient"]).exec();
};

// find all loveMessages by author
export const findLoveMessagesByAuthor = (author: MongoId) => {
  typeof author === "string" && (author = new Types.ObjectId(author));
  return LoveMessage.find({ author })
    .lean()
    .populate(["author", "recipient"])
    .exec();
};

// find all loveMessages by recipient
export const findLoveMessagesByRecipient = (recipient: MongoId) => {
  typeof recipient === "string" && (recipient = new Types.ObjectId(recipient));
  return LoveMessage.find({ recipient })
    .lean()
    .populate(["author", "recipient"])
    .exec();
};

// find all loveMessages viewed by recipient from author
export const findLoveMessagesViewed = (author: MongoId, recipient: MongoId) => {
  typeof author === "string" && (author = new Types.ObjectId(author));
  typeof recipient === "string" && (recipient = new Types.ObjectId(recipient));
  return LoveMessage.find({ author, recipient, viewedAt: { $exists: true } })
    .lean()
    .populate(["author", "recipient"])
    .exec();
};

// find loveMessage by id
export const findLoveMessageById = (id: MongoId) => {
  typeof id === "string" && (id = new Types.ObjectId(id));
  return LoveMessage.findById(id)
    .lean()
    .populate(["author", "recipient"])
    .exec();
};

// find random loveMessage from author to recipient
export const findRandomLoveMessage = async (
  author: MongoId,
  recipient: MongoId
) => {
  typeof author === "string" && (author = new Types.ObjectId(author));
  typeof recipient === "string" && (recipient = new Types.ObjectId(recipient));
  const filter = { author, recipient, viewedAt: { $exists: false } };
  const numNewLoveMessages = await LoveMessage.countDocuments(filter).exec();
  const randomN = Math.floor(Math.random() * numNewLoveMessages);
  const loveMessage = await LoveMessage.findOne(filter).skip(randomN).exec();

  if (loveMessage) {
    // set viewedAt
    loveMessage.viewedAt = new Date();
    const updatedLoveMessage = await loveMessage.save();
    // return populated loveMessage
    return await updatedLoveMessage.populate(["author", "recipient"]);
  }
  return null;
};

// find loveMessage authors for a given recipient
export const findLoveMessageAuthors = (recipient: MongoId) => {
  typeof recipient === "string" && (recipient = new Types.ObjectId(recipient));
  return LoveMessage.aggregate([
    { $match: { recipient } },
    {
      $group: {
        _id: "$author",
        latestAt: { $max: "$createdAt" },
        hasUnviewed: { $max: { $eq: [{ $type: "$viewedAt" }, "missing"] } },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        pipeline: [{ $project: { name: 1, username: 1, __v: 1 } }],
        as: "fromUsers",
      },
    },
    {
      $replaceWith: {
        $mergeObjects: [{ $arrayElemAt: ["$fromUsers", 0] }, "$$ROOT"],
      },
    },
    { $project: { fromUsers: 0 } },
  ]).exec();
};

// validate loveMessage id
export const isValidLoveMessageId = async (id: MongoId) => {
  typeof id === "string" && (id = new Types.ObjectId(id));
  if (await LoveMessage.exists({ _id: id }).lean().exec()) {
    return true;
  }
  throw new Error("Invalid Love Message ID");
};

// validate loveMessage user
export const isValidLoveMessageUser = async (id: MongoId, user: MongoId) => {
  typeof id === "string" && (id = new Types.ObjectId(id));
  typeof user === "string" && (user = new Types.ObjectId(user));
  const loveMessage = await LoveMessage.findById(id).lean().exec();
  if (loveMessage) {
    if (user.equals(loveMessage.author)) {
      return true;
    }
  }
  throw new Error("Unauthorized to view the Love Message");
};

// limit the number of loveMessages recipient can view from author per day
export const isWithinDailyLimit = async (
  author: MongoId,
  recipient: MongoId,
  dailyLimit: number
) => {
  typeof author === "string" && (author = new Types.ObjectId(author));
  typeof recipient === "string" && (recipient = new Types.ObjectId(recipient));
  const today = new Date(new Date().toISOString().slice(0, 10));
  const filter = { author, recipient, viewedAt: { $gte: today } };
  const numViewedToday = await LoveMessage.countDocuments(filter).exec();

  if (numViewedToday < dailyLimit) {
    return true;
  }
  throw new Error("Reached Daily Limit");
};

// create loveMessage
export const createLoveMessage = async (body: ILoveMessage) => {
  // create() is a thin wrapper around the save() function
  // source: https://masteringjs.io/tutorials/mongoose/create
  const loveMessage = await LoveMessage.create(body);
  return await loveMessage.populate(["author", "recipient"]);
};

// update loveMessage
export const updateLoveMessage = (id: MongoId, body: ILoveMessage) => {
  // known issue: findByIdAndX does not run traditional middleware
  // save() calls traditional middleware, but it is not necessary
  // sources: https://masteringjs.io/tutorials/mongoose/update,
  // https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate()
  typeof id === "string" && (id = new Types.ObjectId(id));
  const loveMessage = LoveMessage.findByIdAndUpdate(id, body, { new: true });
  return loveMessage.populate(["author", "recipient"]).exec();
};

// delete loveMessage
export const deleteLoveMessage = (id: MongoId) => {
  // known issue: findByIdAndX does not run traditional middleware
  // sources: https://masteringjs.io/tutorials/mongoose/delete-by-id,
  // https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete()
  typeof id === "string" && (id = new Types.ObjectId(id));
  const loveMessage = LoveMessage.findByIdAndDelete(id);
  return loveMessage.populate(["author", "recipient"]).exec();
};
