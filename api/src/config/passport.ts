import passport from "passport";

import User from "../features/auth/models/User";

// configure passport
export const config = () => {
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser() as any);
  passport.deserializeUser(User.deserializeUser());
};
