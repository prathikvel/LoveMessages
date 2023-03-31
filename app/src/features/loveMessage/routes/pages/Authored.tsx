import { Helmet } from "react-helmet-async";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";

import Modal from "../../../../components/Modal";
import RemoveDialog from "../../../../components/RemoveDialog";
import AuthoredForm from "../../components/AuthoredForm";
import AuthoredList from "../../components/AuthoredList";
import useAuthored from "../../hooks/useAuthored";
import { LoveMessage } from "../../types";
import useOpenDialog from "../../../../hooks/useOpenDialog";
import useOpenForm from "../../../../hooks/useOpenForm";

const AuthoredPage = () => {
  const { loveMessages, ...restApi } = useAuthored();
  const form = useOpenForm<LoveMessage>();
  const dialog = useOpenDialog<LoveMessage>(() => {
    dialog.selected && restApi.remove.removeItem(dialog.selected._id);
  });

  return (
    <>
      <Helmet>
        <title>Authored</title>
      </Helmet>

      <Container maxWidth="md">
        <Box sx={{ display: "flex", mb: 3 }}>
          {/* prettier-ignore */}
          <Typography variant="h4" sx={{ flexGrow: 1 }}>Authored</Typography>
          <Button
            variant="outlined"
            endIcon={<AddIcon />}
            onClick={() => form.handleOpen()}
          >
            New
          </Button>
        </Box>
        <AuthoredList
          loveMessages={loveMessages}
          handleOpenForm={form.handleOpen}
          handleOpenDialog={dialog.handleOpen}
        />
      </Container>

      <Modal open={form.open} onClose={form.handleClose}>
        <Box>
          <Typography variant="h4" mb={3}>
            {!form.selected ? "Add" : "Edit"} Love Message
          </Typography>
          <AuthoredForm
            initial={form.selected}
            add={restApi.add}
            edit={restApi.edit}
            onSubmit={form.handleClose}
          />
        </Box>
      </Modal>

      {dialog.selected && (
        <RemoveDialog
          open={dialog.open}
          onOk={dialog.handleOk}
          onClose={dialog.handleClose}
        >
          <Box>
            <Typography mb={2}>
              Are you sure you want to delete the Love Message to{" "}
              <em>{dialog.selected.recipient.name}</em> with the following
              message?
            </Typography>
            {/* prettier-ignore */}
            <Typography mx={3}><em>{dialog.selected.message}</em></Typography>
          </Box>
        </RemoveDialog>
      )}
    </>
  );
};

export default AuthoredPage;
