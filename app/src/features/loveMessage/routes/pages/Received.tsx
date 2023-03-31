import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import { Helmet } from "react-helmet-async";
import { useState } from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Modal from "../../../../components/Modal";
import AuthorListItem from "../../components/AuthorListItem";
import ReceivedList from "../../components/ReceivedList";
import useReceived from "../../hooks/useReceived";

dayjs.extend(calendar);

const ReceivedPage = () => {
  const {
    authors: { authors },
    viewed: { viewed },
    random: { random, status, viewRandom },
  } = useReceived();

  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = (author: string) => {
    viewRandom(author);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      <Helmet>
        <title>Received</title>
      </Helmet>

      <Container maxWidth="md">
        <Typography variant="h4" mb={3}>
          Received
        </Typography>
        <Stack spacing={2}>
          {status && <Alert severity={status.type}>{status.message}</Alert>}
          {authors.map((author, index) => (
            <AuthorListItem
              key={author._id}
              author={author}
              handleOpenRandom={handleOpen}
            >
              {viewed[index] && <ReceivedList loveMessages={viewed[index]} />}
            </AuthorListItem>
          ))}
        </Stack>
      </Container>

      {random && (
        <Modal open={open} onClose={handleClose}>
          <Box width={{ xs: "50vw", md: 400 }}>
            <Typography mb={2}>
              {dayjs(random.updatedAt).calendar()}, {random.author.name} said:
            </Typography>
            {/* prettier-ignore */}
            <Typography mx={3}><em>{random.message}</em></Typography>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default ReceivedPage;
