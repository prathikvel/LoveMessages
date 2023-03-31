import AuthProvider from "./components/AuthProvider";
import RequireAuth from "./components/RequireAuth";
import useAuth from "./hooks/useAuth";
import { readUsers } from "./services";
import { User } from "./types";
import { LoginRoute } from "./routes";

const routes = { LoginRoute };

export { AuthProvider, RequireAuth, useAuth, readUsers };
export type { User };
export default routes;
