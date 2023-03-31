import { Request, Response, NextFunction } from "express";

import { AuthenticationError } from "../../../utils/errors";

// require authentication
export const authenticationHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  next(new AuthenticationError("Unauthorized"));
};
