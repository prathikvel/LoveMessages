import express from "express";
import passport from "passport";

import users, { authenticationHandler } from "../features/auth";
import loveMessages from "../features/loveMessage";

const router = express.Router();

// login
router.post(
  "/login",
  passport.authenticate("local", { failWithError: true }),
  (req, res) => {
    res.status(204).json({ data: null });
  }
);

// middlewares
router.use(authenticationHandler);

// logout
router.post("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.status(204).json({ data: null });
  });
});

// routes
router.use("/users", users);
router.use("/loveMessages", loveMessages);

export default router;
