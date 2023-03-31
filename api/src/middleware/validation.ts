import { Request, Response, NextFunction } from "express";
import { Location, validationResult, matchedData } from "express-validator";

import { ClientError } from "../utils/errors";

export const validationHandler =
  (location: Location) => (req: Request, res: Response, next: NextFunction) => {
    // handle validation errors
    const errors = validationResult(req).formatWith(
      // rename msg to message
      ({ msg: message, ...rest }) => ({ message, ...rest })
    );
    if (!errors.isEmpty()) {
      const message = `Invalid ${location}`;
      return next(new ClientError(406, message, { errors: errors.array() }));
    }

    // match data
    const matched = matchedData(req, {
      locations: [location],
      includeOptionals: true,
    });
    req[location] = matched;
    next();
  };
