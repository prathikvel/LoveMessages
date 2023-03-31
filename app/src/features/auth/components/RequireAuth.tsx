import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";

import Box from "@mui/material/Box";
import PulseLoader from "react-spinners/PulseLoader";

import useAuth from "../hooks/useAuth";

interface RequireAuthProps {
  component: React.ReactElement;
}

const RequireAuth = ({ component }: RequireAuthProps) => {
  const auth = useAuth();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  // if unauthenticated, notify user
  useEffect(() => {
    if (!auth.isLoading) {
      if (!auth.user) {
        enqueueSnackbar(auth.error as string, { variant: "error" });
      }
    }
  }, [auth, enqueueSnackbar]);

  // if loading
  if (auth.isLoading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="calc(100vh - 100px)"
      >
        <PulseLoader />
      </Box>
    );
  }

  // if unauthenticated
  if (!auth.user) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }

  // if authenticated
  return component;
};

export default RequireAuth;
