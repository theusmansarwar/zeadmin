import React, {  useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Checkbox,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { formatDate } from "../../Utils/Formatedate";
import truncateText from "../../truncateText";
import { useNavigate } from "react-router-dom";
import {

  deleteAllProcess,

} from "../../DAL/delete";
import { useAlert } from "../Alert/AlertContext";

import AddProcess from "./addProcess";

export function useTable4({ attributes, tableType, ids, data,onResponse }) {
  const { showAlert } = useAlert();
  const [selected, setSelected] = useState([]);

  const [openProcessModal, setOpenProcessModal] = useState(false);
  const [modelData, setModelData] = useState([]);
  const [modeltype, setModeltype] = useState([]);
  const navigate = useNavigate();

  const handleSelectAllClick = (event) => {
    setSelected(event.target.checked ? data.map((row) => row._id) : []);
  };

  const isSelected = (id) => selected.includes(id);

  const handleViewClick = (category) => {
    setOpenProcessModal(true);
    setModeltype("Update");
    setModelData({ id: ids, data:category });
  };
  const handleAddClick = (category) => {
    setOpenProcessModal(true);
    setModeltype("Add");
    setModelData({ id: ids});
  };

  const handleDelete = async () => {
    if (selected.length === 0) {
      showAlert("warning", "No items selected for deletion");
      return;
    }

    console.log("Attempting to delete IDs:", selected);

    try {
      const response = await deleteAllProcess(ids , { ids: selected });

      if (response.status === 200) {
        showAlert("success", response.message || "Deleted successfully");
        onResponse();
        setSelected([]);
      } else {
        showAlert("error", response.message || "Failed to delete items");
      }
    } catch (error) {
      console.error("Error in delete request:", error);
      showAlert("error", "Something went wrong. Try again later.");
    }
  };

  const handleResponse = (response) => {
    showAlert(response.messageType, response.message);
    onResponse();
  };
  const getNestedValue = (obj, path) => {
    return path
      .split(".")
      .reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : "N/A"),
        obj
      );
  };
  return {
    tableUI4: (
      <>
        <AddProcess
          open={openProcessModal}
          setOpen={setOpenProcessModal}
          Modeltype={modeltype}
          Modeldata={modelData}
          onResponse={handleResponse}
        />
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ width: "100%", maxHeight: "95vh", boxShadow: "none" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h5" sx={{ color: "var(--primary-color)" }}>
                {tableType} List
              </Typography>

              {selected.length > 0 ? (
                <IconButton onClick={handleDelete} sx={{ color: "red" }}>
                  <DeleteIcon />
                </IconButton>
              ) : (
                <Button
                  sx={{
                    background: "var(--horizontal-gradient)",
                    color: "var(--white-color)",
                    borderRadius: "var(--border-radius-secondary)",
                    "&:hover": { background: "var(--vertical-gradient)" },
                  }}
                  onClick={handleAddClick}
                >
                  Add {tableType}
                </Button>
              )}
            </Toolbar>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        sx={{ color: "var(--primary-color)" }}
                        indeterminate={
                          selected.length > 0 && selected.length < data.length
                        }
                        checked={
                          data.length > 0 && selected.length === data.length
                        }
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    {attributes.map((attr) => (
                      <TableCell
                        key={attr._id}
                        sx={{ color: "var(--secondary-color)" }}
                      >
                        {attr.label}
                      </TableCell>
                    ))}
                    <TableCell sx={{ color: "var(--secondary-color)" }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((row) => (
                    <TableRow key={row._id} selected={isSelected(row._id)}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          sx={{ color: "var(--primary-color)" }}
                          checked={isSelected(row._id)}
                          onChange={() => {
                            setSelected((prev) =>
                              isSelected(row._id)
                                ? prev.filter((id) => id !== row._id)
                                : [...prev, row._id]
                            );
                          }}
                        />
                      </TableCell>

                      {attributes.map((attr) => (
                        <TableCell
                          key={attr.id}
                          sx={{ color: "var(--black-color)" }}
                        >
                          {attr.id === "createdAt" ? (
                            formatDate(row[attr.id])
                          ) : attr.id === "published" ? (
                            <span
                              style={{
                                color: row[attr.id]
                                  ? "var(--success-color)"
                                  : "var(--warning-color)",
                                background: row[attr.id]
                                  ? "var(--success-bgcolor)"
                                  : "var(--warning-bgcolor)",
                                padding: "5px",
                                minWidth: "200px",
                                borderRadius: "var(--border-radius-secondary)",
                              }}
                            >
                              {row[attr.id] ? "Public" : "Private"}
                            </span>
                          ) : row[attr.id] === 0 ? (
                            0
                          ) : typeof getNestedValue(row, attr.id) ===
                            "string" ? (
                            truncateText(getNestedValue(row, attr.id), 30) // ✅ Truncate text safely
                          ) : (
                            getNestedValue(row, attr.id)
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <span
                          onClick={() => handleViewClick(row)}
                          style={{
                            color: "var(--primary-color)",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          View
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </>
    ),
  };
}
