import { useFormik } from "formik";
import * as yup from "yup";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import useAuth from "../hooks/useAuth";
import { Credentials } from "../types";

const validationSchema: yup.ObjectSchema<Credentials> = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const LoginForm = () => {
  // auth
  const auth = useAuth();

  // form
  const formik = useFormik<Credentials>({
    initialValues: { username: "", password: "" },
    validationSchema: validationSchema,
    onSubmit: (values) => auth.onLogin(values),
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Stack spacing={2}>
        {auth.error && <Alert severity="error">{auth.error}</Alert>}

        <TextField
          label="Username"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button type="submit">Login</Button>
      </Stack>
    </Box>
  );
};

export default LoginForm;
