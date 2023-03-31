import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { LoveMessage } from "../types";

dayjs.extend(calendar);

interface ReceivedListProps {
  loveMessages: LoveMessage[];
}

const ReceivedList = ({ loveMessages }: ReceivedListProps) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Message</TableCell>
            <TableCell align="right">Created At</TableCell>
            <TableCell align="right">Updated At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loveMessages.map(({ _id, message, createdAt, updatedAt }) => (
            <TableRow
              key={_id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {/* prettier-ignore */}
              <TableCell component="th" scope="row">{message}</TableCell>
              <TableCell align="right">{dayjs(createdAt).calendar()}</TableCell>
              <TableCell align="right">{dayjs(updatedAt).calendar()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReceivedList;
