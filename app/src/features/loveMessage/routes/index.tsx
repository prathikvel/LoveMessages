import { RouteObject } from "react-router-dom";

import { RequireAuth } from "../../auth";
import AuthoredPage from "./pages/Authored";
import ReceivedPage from "./pages/Received";

export const AuthoredRoute: RouteObject = {
  path: "loveMessages/authored",
  element: <RequireAuth component={<AuthoredPage />} />,
};

export const ReceivedRoute: RouteObject = {
  path: "loveMessages/received",
  element: <RequireAuth component={<ReceivedPage />} />,
};
