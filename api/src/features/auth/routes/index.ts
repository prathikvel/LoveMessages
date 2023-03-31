import express from "express";
import { param } from "express-validator";

import { findUsers, findUserById, isValidUserId } from "../services";
import { validationHandler } from "../../../middleware/validation";

const router = express.Router();

// validate param id
const isValidId = [
  param("id")
    .isString()
    .notEmpty()
    .isMongoId()
    .custom((value: string) => isValidUserId(value)),
  validationHandler("params"),
];

// get all users
router.get("/", (req, res, next) => {
  findUsers()
    .then((data) => res.status(200).json({ data: data }))
    .catch(next);
});

// get current user
router.get("/current", (req, res) => res.status(200).json({ data: req.user }));

// get user by id
router.get("/:id", ...isValidId, (req, res, next) => {
  findUserById(req.params.id)
    .then((data) => res.status(200).json({ data: data }))
    .catch(next);
});

export default router;
