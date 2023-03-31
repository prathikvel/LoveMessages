import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import { useState, useEffect, useMemo } from "react";

import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import {
  DataGrid,
  GridColDef,
  gridClasses,
  GridActionsCellItem,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { LoveMessage } from "../types";

dayjs.extend(calendar);

interface LoveMessageListProps {
  loveMessages: LoveMessage[];
  handleOpenForm: (selection?: LoveMessage) => void;
  handleOpenDialog: (selection: LoveMessage) => void;
}

const AuthoredList = ({
  loveMessages,
  handleOpenForm,
  handleOpenDialog,
}: LoveMessageListProps) => {
  const columns: GridColDef[] = useMemo(
    () => [
      { field: "message", headerName: "Message", flex: 2 },
      {
        field: "recipient",
        headerName: "Recipient",
        valueGetter: ({ row: { recipient } }) => recipient.name,
        flex: 1,
      },
      {
        field: "createdAt",
        headerName: "Created At",
        valueFormatter: ({ value }) => dayjs(value).calendar(),
        flex: 1,
      },
      {
        field: "updatedAt",
        headerName: "Updated At",
        valueFormatter: ({ value }) => dayjs(value).calendar(),
        flex: 1,
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        getActions: ({ row }) => [
          <GridActionsCellItem
            label="Edit"
            icon={<EditIcon />}
            onClick={() => handleOpenForm(row)}
          />,
          <GridActionsCellItem
            label="Remove"
            icon={<DeleteIcon />}
            onClick={() => handleOpenDialog(row)}
          />,
        ],
        flex: 1,
      },
    ],
    [handleOpenForm, handleOpenDialog]
  );

  // responsive design
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>();
  useEffect(() => {
    const visibleColumns = matches
      ? { createdAt: true, updatedAt: true }
      : { createdAt: false, updatedAt: false };
    setColumnVisibilityModel(visibleColumns);
  }, [matches]);

  return (
    <Box sx={{ height: "65vh" }}>
      <DataGrid
        rows={loveMessages}
        columns={columns}
        getRowId={(row) => row._id}
        getRowHeight={() => "auto"}
        disableRowSelectionOnClick
        columnVisibilityModel={columnVisibilityModel}
        sx={{ [`& .${gridClasses.cell}`]: { py: 1 } }}
      />
    </Box>
  );
};

export default AuthoredList;
