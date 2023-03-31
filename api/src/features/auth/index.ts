import { authenticationHandler } from "./middleware";
import { IUser } from "./models/User";
import routes from "./routes";
import { isValidUserId } from "./services";

export { authenticationHandler, IUser, isValidUserId };
export default routes;
