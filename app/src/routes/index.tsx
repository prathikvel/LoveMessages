import { SnackbarProvider } from "notistack";
import { RouteObject, createBrowserRouter } from "react-router-dom";

import Layout from "../components/Layout";
import AuthRoutes, { AuthProvider } from "../features/auth";
import LoveMessageRoutes from "../features/loveMessage";
import ErrorPage from "./pages/Error";

const createAppRoutes = () => {
  const appRoutes: RouteObject[] = [];
  Object.values(AuthRoutes).forEach((v) => appRoutes.push(v));
  Object.values(LoveMessageRoutes).forEach((v) => appRoutes.push(v));
  return appRoutes;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <SnackbarProvider maxSnack={1}>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </SnackbarProvider>
    ),
    errorElement: <ErrorPage />,
    children: ([] as RouteObject[]).concat(createAppRoutes()),
  },
]);

export default router;
