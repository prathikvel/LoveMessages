import bodyParser from "body-parser";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import mongoSanitize from "express-mongo-sanitize";
import MongoStore from "connect-mongo";
import passport from "passport";
import session from "express-session";

import * as db from "./config/database";
import * as pp from "./config/passport";
import * as seed from "./config/seed";
import routes from "./routes";
import { ClientError } from "./utils/errors";

// config
db.connect();
pp.config();
seed.initialUsers();

// middleware
const app = express();
app.use(bodyParser.json());
app.set("trust proxy", 1);
app.use(
  session({
    name: "sessionId",
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET as string,
    cookie: { httpOnly: true, sameSite: true, secure: "auto" },
    store:
      process.env.NODE_ENV !== "production"
        ? new session.MemoryStore()
        : MongoStore.create({ client: mongoose.connection.getClient() as any }),
  })
);
app.use(helmet());
app.disable("x-powered-by");
app.use(mongoSanitize());
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/api", routes);
app.get("*", (req, res, next) => next(new ClientError(404, "Not Found")));

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // sanitize for production
  err = JSON.parse(JSON.stringify(err));
  const { errorProd, errorDev, ...origErr } = err;
  if (process.env.NODE_ENV === "production") {
    const { name, status, message } = origErr;
    err = { name, status, message, ...errorProd };
  } else {
    err = { ...origErr, ...errorProd, ...errorDev };
  }
  res.status(err?.status || 500).json({ error: err });
});

// listen
app.listen(3000, () => console.log("Server is up on port", 3000));
