import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import { useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import AccordionSummary from "../../../components/AccordionSummary";
import { LoveMessageAuthor } from "../types";

dayjs.extend(calendar);

interface AuthorListItemProps {
  author: LoveMessageAuthor;
  handleOpenRandom: (author: string) => void;
  children: React.ReactElement;
}

const AuthorListItem = ({
  author,
  handleOpenRandom,
  children,
}: AuthorListItemProps) => {
  const [expanded, setExpanded] = useState<string | false>();
  const handleChange =
    (panel: string) => (e: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const { latestAt, hasUnviewed } = author;
  const handleClick = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    handleOpenRandom(author._id);
  };

  return (
    <Accordion
      disableGutters
      expanded={expanded === author._id}
      onChange={handleChange(author._id)}
    >
      <AccordionSummary>
        <Box sx={{ alignSelf: "center", flexGrow: 1 }}>
          <Typography sx={{ fontWeight: hasUnviewed ? "bold" : "normal" }}>
            {author.name}, <em>{dayjs(latestAt).calendar()}</em>
          </Typography>
        </Box>

        <Button
          disabled={!hasUnviewed}
          onClick={handleClick}
          sx={{ fontWeight: hasUnviewed ? "bold" : "normal" }}
        >
          Open Message
        </Button>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default AuthorListItem;
