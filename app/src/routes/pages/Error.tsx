import { useRouteError } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const ErrorPage = () => {
  const error: any = useRouteError();
  const defaultErrorMessage = "Something went wrong.";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h1">Error {error.status}</Typography>
        <Typography variant="h2">
          {error.data ? error.data : defaultErrorMessage}
        </Typography>
      </Box>
    </Box>
  );
};

export default ErrorPage;
