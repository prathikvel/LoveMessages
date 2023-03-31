import { Helmet } from "react-helmet-async";

import Box from "@mui/material/Box";

import LoginForm from "../../components/LoginForm";

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="calc(90vh - 100px)"
      >
        <LoginForm />
      </Box>
    </>
  );
};

export default LoginPage;
