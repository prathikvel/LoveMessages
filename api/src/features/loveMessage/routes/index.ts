import express from "express";
import { param, body } from "express-validator";
import { Types } from "mongoose";

import { IUser, isValidUserId } from "../../auth";
import {
  findLoveMessagesByAuthor,
  findLoveMessagesViewed,
  findLoveMessageById,
  findRandomLoveMessage,
  findLoveMessageAuthors,
  isValidLoveMessageId,
  isValidLoveMessageUser,
  isWithinDailyLimit,
  createLoveMessage,
  updateLoveMessage,
  deleteLoveMessage,
} from "../services";
import { validationHandler } from "../../../middleware/validation";
import { ClientError } from "../../../utils/errors";

const router = express.Router();

// validate param id
const isValidId = [
  param("id")
    .isString()
    .notEmpty()
    .isMongoId()
    .custom((value: string, {}) => isValidLoveMessageId(value))
    .custom((value: string, { req }) => {
      const user = req.user as IUser;
      return isValidLoveMessageUser(value, user._id);
    }),
  validationHandler("params"),
];

// validate param authorId
const isValidAuthorId = [
  param("authorId")
    .isString()
    .notEmpty()
    .isMongoId()
    .custom((value: string, {}) => isValidUserId(value))
    .custom((value: string, { req }) => {
      const user = req.user as IUser;
      return !user._id.equals(new Types.ObjectId(value));
    }),
  validationHandler("params"),
];

// validate body
const isValidBody = [
  body("recipient")
    .isString()
    .notEmpty()
    .isMongoId()
    .custom((value: string, {}) => isValidUserId(value))
    .custom((value: string, { req }) => {
      const user = req.user as IUser;
      return !user._id.equals(new Types.ObjectId(value));
    }),
  body("message").isString().notEmpty(),
  validationHandler("body"),
];

// get all loveMessages by author
router.get("/authored", (req, res, next) => {
  const user = req.user as IUser;
  findLoveMessagesByAuthor(user._id)
    .then((data) => res.status(200).json({ data: data }))
    .catch(next);
});

// get users who sent loveMessages to recipient
router.get("/received/users", (req, res, next) => {
  const user = req.user as IUser;
  findLoveMessageAuthors(user._id)
    .then((data) => res.status(200).json({ data: data }))
    .catch(next);
});

// get all loveMessages viewed by recipient
router.get(
  "/received/users/:authorId",
  ...isValidAuthorId,
  (req, res, next) => {
    const user = req.user as IUser;
    findLoveMessagesViewed(req.params.authorId, user._id)
      .then((data) => res.status(200).json({ data: data }))
      .catch(next);
  }
);

// get random unviewed loveMessage by recipient
router.get(
  "/received/users/:authorId/random",
  ...isValidAuthorId,
  (req, res, next) => {
    const user = req.user as IUser;
    const dailyLimit = Number(process.env.DAILY_LIMIT) || 5;
    isWithinDailyLimit(req.params.authorId, user._id, dailyLimit)
      .then(() =>
        findRandomLoveMessage(req.params.authorId, user._id)
          .then((data) => res.status(200).json({ data: data }))
          .catch(next)
      )
      .catch((err) => next(new ClientError(405, err.message)));
  }
);

// get loveMessage by id
router.get("/:id", ...isValidId, (req, res, next) => {
  findLoveMessageById(req.params.id)
    .then((data) => res.status(200).json({ data: data }))
    .catch(next);
});

// create loveMessage
router.post("/", ...isValidBody, (req, res, next) => {
  const user = req.user as IUser;
  const loveMessage = { author: user._id, ...req.body };
  createLoveMessage(loveMessage)
    .then((data) => res.status(201).json({ data: data }))
    .catch(next);
});

// update loveMessage
router.put("/:id", ...isValidId, ...isValidBody, (req, res, next) => {
  const user = req.user as IUser;
  const loveMessage = { author: user._id, ...req.body };
  updateLoveMessage(req.params.id, loveMessage)
    .then((data) => res.status(200).json({ data: data }))
    .catch(next);
});

// delete loveMessage
router.delete("/:id", ...isValidId, (req, res, next) => {
  deleteLoveMessage(req.params.id)
    .then((data) => res.status(200).json({ data: data }))
    .catch(next);
});

export default router;
