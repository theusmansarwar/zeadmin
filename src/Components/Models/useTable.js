import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  Checkbox,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  fetchallBloglist,
  fetchallcategorylist,
  fetchallCommentlist,
  fetchallLeads,
  fetchallRoles,
  fetchallTeamCategories,
  fetchallTestimonialslist,
  fetchServices,
  fetchTeamMember,
} from "../../DAL/fetch";
import { formatDate } from "../../Utils/Formatedate";
import truncateText from "../../truncateText";
import { useNavigate } from "react-router-dom";
import AddCategories from "./addcategorie";
import { deleteAllBlogs, deleteAllCategories, deleteAllComments, deleteAllLeads, deleteAllRole, deleteAllServices, deleteAllTeam, deleteAllTeamCategories, deleteAllTestimonials } from "../../DAL/delete";
import { useAlert } from "../Alert/AlertContext";
import ApproveComment from "./approveComment";
import AddTeamCategories from "./addTeamCategory";
import Roles from "./addRole";
import DeleteModal from "./confirmDeleteModel";

export function useTable({ attributes, tableType, limitPerPage = 10 }) {
    const { showAlert } = useAlert(); // Since you created a custom hook

  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitPerPage);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const navigate = useNavigate();
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openTeamCategoryModal, setOpenTeamCategoryModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [modeltype, setModeltype] = useState("Add");
  const [modelData, setModelData] = useState({});
  const [openDeleteModal,setOpenDeleteModal]=useState(false);
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  const fetchData = async () => {
    let response;
    if (tableType === "Categories") {
      response = await fetchallcategorylist(page,rowsPerPage);
      setData(response.categories);
      setTotalRecords(response.categories.length);
      if(response.status == 400 ){
        localStorage.removeItem("Token");
        navigate("/login");
      }
    } else if (tableType === "Blogs") {
      response = await fetchallBloglist(page,rowsPerPage ); 
      console.log("Response:", response);
      
      setData(response.blogs);
      setPage(response.currentPage); 
      setTotalRecords(response.totalBlogs); 
      if(response.status == 400 ){
        localStorage.removeItem("Token");
        navigate("/login");
      } 
    } else if (tableType === "Comments") {
      response = await fetchallCommentlist(page,rowsPerPage );
      setData(response.comments);
      setTotalRecords(response.totalComments); 
      if(response.status == 400 ){
        localStorage.removeItem("Token");
        navigate("/login");
      }
    }
    else if (tableType === "Testimonial") {
      response = await fetchallTestimonialslist(page,rowsPerPage );
      setData(response.testimonials);
      setTotalRecords(response.totalTestimonials); 
      if(response.status == 400 ){
        localStorage.removeItem("Token");
        navigate("/login");
      }
    }
    else if (tableType === "Lead") {
        response = await fetchallLeads(page,rowsPerPage );
        setData(response.leads);
        setTotalRecords(response.totalLeads);
        if(response.status == 400 ){
          localStorage.removeItem("Token");
          navigate("/login");
        } 
      }
      else if (tableType === "Team Category") {
        response = await fetchallTeamCategories(page,rowsPerPage );
        setData(response.categories);
        setTotalRecords(response.totalCategories); 
        if(response.status == 400 ){
          localStorage.removeItem("Token");
          navigate("/login");
        }
      }
      else if (tableType === "Role") {
        response = await fetchallRoles(page,rowsPerPage );
        setData(response.roles);
        setTotalRecords(response.totalRoles); 
        if(response.status == 400 ){
          localStorage.removeItem("Token");
          navigate("/login");
        }
      }
      else if (tableType === "Team") {
        response = await fetchTeamMember(page,rowsPerPage );
        setData(response.members);
        setTotalRecords(response?.totalMembers); 
        if(response.status == 400 ){
          localStorage.removeItem("Token");
          navigate("/login");
        }
      }
      else if (tableType === "Services") {
        response = await fetchServices(page,rowsPerPage );
        setData(response.services);
        setTotalRecords(response?.total); 
        if(response.status == 400 ){
          localStorage.removeItem("Token");
          navigate("/login");
        }
      }

  
  };
  
  

  const handleSelectAllClick = (event) => {
    setSelected(event.target.checked ? data.map((row) => row._id) : []);
  };

  const isSelected = (id) => selected.includes(id);

  const handleChangePage = (_, newPage) => {
    setPage(newPage + 1); // ✅ Adjust for API's 1-based pagination
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewClick = (category) => {
    if (tableType === "Categories") {
        setModelData(category); 
        setModeltype("Update"); 
        setOpenCategoryModal(true);
      }
      else if (tableType === "Role") {
        setModelData(category); 
        setModeltype("Update"); 
        setOpenRoleModal(true);
      }
      else if (tableType === "Team Category") {
        setModelData(category); 
        setModeltype("Update"); 
        setOpenTeamCategoryModal(true);
      }  else if (tableType === "Blogs") {
        navigate(`/edit-blog/${category._id}`);
      }
      else if (tableType === "Services") {
        navigate(`/services/detail/${category._id}`);
      }
      else if (tableType === "Team") {
        navigate(`/edit-team/${category._id}`);
      }
      else if (tableType === "Testimonial") {
        navigate(`/edit-testimonial/${category._id}`);
      }
      else if (tableType === "Lead") {
        navigate(`/view-lead/${category._id}`);
      }
      else if (tableType === "Comments") {
        setModelData(category); 
        setModeltype("Update"); 
        setOpenCommentModal(true);
      }
    
  };

  const handleDelete = async () => {
    if (selected.length === 0) {
      showAlert("warning", "No items selected for deletion");
      return;
    }

    console.log("Attempting to delete IDs:", selected);

    try {
      let response;
      if (tableType === "Blogs") {
        response = await deleteAllBlogs({ ids: selected });
      } else if (tableType === "Categories") {
        response = await deleteAllCategories({ ids: selected });
      } else if (tableType === "Comments") {
        response = await deleteAllComments({ ids: selected });
      }
      else if (tableType === "Team Category") {
        response = await deleteAllTeamCategories({ ids: selected });
      }
      else if (tableType === "Team") {
        response = await deleteAllTeam({ ids: selected });
      }
      else if (tableType === "Role") {
        response = await deleteAllRole({ ids: selected });
      }
      else if (tableType === "Services") {
        response = await deleteAllServices({ ids: selected });
      }
      else if (tableType === "Lead") {
        response = await deleteAllLeads({ ids: selected });
      }
      else if (tableType === "Testimonial") {
        response = await deleteAllTestimonials({ ids: selected });
      }

      if (response.status === 200) {
        showAlert("success", response.message || "Deleted successfully");
        fetchData();
        setSelected([]);
      } else {
        showAlert("error", response.message || "Failed to delete items");
      }
    } catch (error) {
      console.error("Error in delete request:", error);
      showAlert("error", "Something went wrong. Try again later.");
    }
  };

  const handleAddButton = () => {
    if (tableType === "Categories") {
      setOpenCategoryModal(true);
      setModeltype("Add");
      setModelData();
    } else if (tableType === "Blogs") {
      navigate("/add-blog");
    }
    else if (tableType === "Services") {
      navigate("/add-services");
    }
    else if (tableType === "Team") {
      navigate("/add-team");
    }
    else if (tableType === "Testimonial") {
      navigate("/add-testimonial");
    }
    if (tableType === "Team Category") {
      setOpenTeamCategoryModal(true);
      setModeltype("Add");
      setModelData();
    }
    if (tableType === "Role") {
      setOpenRoleModal(true);
      setModeltype("Add");
      setModelData();
    }
  };

  const getNestedValue = (obj, path) => {
    return path
      .split(".")
      .reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : "N/A"),
        obj
      );
  };

  const handleResponse = (response) => {
    showAlert(response.messageType, response.message);
    fetchData();
  };
  const handleDeleteClick = () => {
   setOpenDeleteModal(true);
  };

  return {
    tableUI: (
      <>
        <AddCategories
          open={openCategoryModal}
          setOpen={setOpenCategoryModal}
          Modeltype={modeltype}
          Modeldata={modelData}
          onResponse={handleResponse}
        />
         <AddTeamCategories
          open={openTeamCategoryModal}
          setOpen={setOpenTeamCategoryModal}
          Modeltype={modeltype}
          Modeldata={modelData}
          onResponse={handleResponse}
        />
          <ApproveComment
          open={openCommentModal}
          setOpen={setOpenCommentModal}
          Modeltype={modeltype}
          Modeldata={modelData}
          onResponse={handleResponse}
        />
           <Roles
          open={openRoleModal}
          setOpen={setOpenRoleModal}
          Modeltype={modeltype}
          Modeldata={modelData}
          onResponse={handleResponse}
        />
           <DeleteModal
        open={openDeleteModal} setOpen={setOpenDeleteModal} onConfirm={handleDelete}
        />

        <Box sx={{ width: "100%" }}>
          <Paper sx={{ width: "100%", maxHeight: "95vh", boxShadow: "none" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h5" sx={{ color: "var(--primary-color)" }}>
                {tableType} List
              </Typography>

              {selected.length > 0 ? (
                <IconButton onClick={handleDeleteClick} sx={{ color: "red" }}>
                  <DeleteIcon />
                </IconButton>
              ) : (
                tableType !== "Comments" && (
                  <Button
                    sx={{
                      background: "var(--horizontal-gradient)",
                      color: "var(--white-color)",
                      borderRadius: "var(--border-radius-secondary)",
                      "&:hover": { background: "var(--vertical-gradient)" },
                    }}
                    onClick={handleAddButton}
                  >
                    Add {tableType}
                  </Button>
                )
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
                  {data.map((row) => {
                      const isItemSelected = isSelected(row._id);
                      return (
                        <TableRow key={row._id} selected={isItemSelected}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              sx={{ color: "var(--primary-color)" }}
                              checked={isItemSelected}
                              onChange={() => {
                                setSelected((prev) =>
                                  isItemSelected
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
                              {(attr.id === "createdAt" || attr.id === "publishedDate") ? (
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
                                    borderRadius:
                                      "var(--border-radius-secondary)",
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
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
  rowsPerPageOptions={[5, 10, 25]}
  component="div"
  count={totalRecords}  // ✅ Correct count from API
  rowsPerPage={rowsPerPage}
  page={page - 1}  // ✅ Convert to 0-based index for Material-UI
  onPageChange={handleChangePage}
  onRowsPerPageChange={handleChangeRowsPerPage}
/>
          </Paper>
        </Box>
      </>
    ),
  };
}
