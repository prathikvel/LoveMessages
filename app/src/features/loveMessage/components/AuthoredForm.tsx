import { useFormik } from "formik";
import { useState, useEffect } from "react";
import * as yup from "yup";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { readUsers, User } from "../../auth";
import UserSelect from "./UserSelect";
import { LoveMessage, LoveMessageBody } from "../types";
import { Status } from "../../../types/status";
import "../../../utils/yup";

interface AuthoredFormProps {
  initial?: LoveMessage;
  add: {
    status: Status | null;
    isLoading: boolean;
    addItem: (body: LoveMessageBody, recipient: User, cb?: Function) => void;
  };
  edit: {
    status: Status | null;
    isLoading: boolean;
    // prettier-ignore
    editItem: (id: string, body: LoveMessageBody, recipient: User, cb?: Function) => void;
  };
  onSubmit: () => void;
}

const validationSchema: yup.ObjectSchema<LoveMessageBody> = yup.object({
  recipient: yup
    .string()
    .required("Recipient is required")
    .isMongoId("Please choose a valid recipient"),
  message: yup.string().required("Message is required"),
});

const AuthoredForm = ({ initial, add, edit, onSubmit }: AuthoredFormProps) => {
  // form
  const formik = useFormik<LoveMessageBody>({
    initialValues: {
      recipient: initial?.recipient._id || "",
      message: initial?.message || "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const recipient = users.find((u) => u._id === values.recipient)!;
      if (!initial) {
        add.addItem(values, recipient, onSubmit);
      } else {
        edit.editItem(initial._id, values, recipient, onSubmit);
      }
    },
  });

  // status and isLoading
  useEffect(() => {
    if (formik.submitCount > 0) {
      if (!initial) {
        if (!add.isLoading) {
          formik.setStatus(add.status);
        }
      } else {
        if (!edit.isLoading) {
          formik.setStatus(edit.status);
        }
      }
    }
    // https://github.com/jaredpalmer/formik/issues/2268
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.submitCount, initial, add, edit]);

  // users
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    readUsers().then((data) => setUsers(data));
  }, []);

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Stack spacing={2}>
        {formik.status && (
          <Alert severity={formik.status.type}>{formik.status.message}</Alert>
        )}

        <UserSelect
          users={users}
          name="recipient"
          value={users.length ? formik.values.recipient : ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.recipient && Boolean(formik.errors.recipient)}
          helperText={formik.touched.recipient && formik.errors.recipient}
        />
        <TextField
          label="Message"
          name="message"
          value={formik.values.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.message && Boolean(formik.errors.message)}
          helperText={formik.touched.message && formik.errors.message}
        />
        <Button type="submit">Submit</Button>
      </Stack>
    </Box>
  );
};

export default AuthoredForm;
