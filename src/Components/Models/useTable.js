import React, { useEffect, useState } from "react";
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
  TextField,
  InputAdornment,
  Avatar,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
  fetchallApplication,
  fetchallBloglist,
  fetchallCaseStudieslist,
  fetchallcategorylist,
  fetchallCommentlist,
  fetchallIndustrieslist,
  fetchallJobslist,
  fetchallLeads,
  fetchallRoles,
  fetchallservicescategorylist,
  fetchallserviceslist,
  fetchallTeamCategories,
  fetchallTestimonialslist,
  fetchallUserlist,
  fetchallUserTypelist,
  fetchBloglistofwritter,
  fetchFeaturedBloglist,
  fetchProductslist,
  fetchTeamMember,
} from "../../DAL/fetch";
import { formatDate } from "../../Utils/Formatedate";
import truncateText from "../../truncateText";
import { useNavigate } from "react-router-dom";
import AddCategories from "./addcategorie";
import {
  deleteAllApplications,
  deleteAllBlogs,
  deleteAllCaseStudy,
  deleteAllCategories,
  deleteAllComments,
  deleteAllFeaturedBlogs,
  deleteAllIndustries,
  deleteAllJobs,
  deleteAllLeads,
  deleteAllProducts,
  deleteAllRole,
  deleteAllServices,
  deleteAllServicesCategories,
  deleteAllTeam,
  deleteAllTeamCategories,
  deleteAllTestimonials,
  deleteAllUsers,
  deleteAllUsersType,
} from "../../DAL/delete";
import { useAlert } from "../Alert/AlertContext";
import ApproveComment from "./approveComment";
import DeleteModal from "./confirmDeleteModel";
import AddUsertype from "./addUsertype";
import AddUser from "./addUser";
import AddServicesCategories from "./addServicesCategories";
import ViewLeads from "./viewLeads";
import AddTeamCategories from "./addTeamCategory";
import { baseUrl } from "../../Config/Config";
import Roles from "./addRole";

export function useTable({ attributes, tableType, limitPerPage = 25 }) {
  const { showAlert } = useAlert(); // Since you created a custom hook

  const [selected, setSelected] = useState([]);
  // Load when component first mounts
  const savedState =
    JSON.parse(localStorage.getItem(`${tableType}-tableState`)) || {};
  const [page, setPage] = useState(savedState.page || 1);
  const [rowsPerPage, setRowsPerPage] = useState(
    savedState.rowsPerPage || limitPerPage
  );
  const [searchQuery, setSearchQuery] = useState(savedState.searchQuery || "");
  const [openTeamCategoryModal, setOpenTeamCategoryModal] = useState(false);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const navigate = useNavigate();
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openServicesCategoryModal, setOpenServicesCategoryModal] =
    useState(false);
  const [openUserTypeModal, setOpenUserTypeModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [openLeadsModal, setOpenLeadsModal] = useState(false);
  const [modeltype, setModeltype] = useState("Add");
  const [modelData, setModelData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  // New state to handle debounced search value
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // delay in ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem(
      `${tableType}-tableState`,
      JSON.stringify({ page, rowsPerPage, searchQuery })
    );
  }, [page, rowsPerPage, searchQuery, tableType]);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, debouncedSearch]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userType = user?.type?.name || "";
      const userName = user?.name || "";
      let response;

      if (tableType === "Categories") {
        response = await fetchallcategorylist(page, rowsPerPage, searchQuery);
        setData(response.categories);
        setTotalRecords(response.categories.length);
      } else if (tableType === "Services Categories") {
        response = await fetchallservicescategorylist(page, rowsPerPage);
        setData(response.categories);
        setTotalRecords(response.categories.length);
      } else if (tableType === "Services") {
        response = await fetchallserviceslist(page, rowsPerPage, searchQuery);
        setData(response.services);
        setTotalRecords(response.totalServices);
      } else if (tableType === "Blogs") {
        if (userType === "Writer") {
          response = await fetchBloglistofwritter(
            page,
            rowsPerPage,
            userName,
            searchQuery
          );
          setData(response?.blogs);
          setPage(response?.currentPage);
          setTotalRecords(response?.totalBlogs);
          if (response.status == 404) setData([]);
        } else {
          response = await fetchallBloglist(page, rowsPerPage, searchQuery);
          setData(response.blogs);
          setPage(response.currentPage);
          setTotalRecords(response.totalBlogs);
        }
      } else if (tableType === "Featured Blogs") {
        response = await fetchFeaturedBloglist(page, rowsPerPage, searchQuery);
        setData(response.blogs);
        setPage(response.currentPage);
        setTotalRecords(response.totalBlogs);
      } else if (tableType === "UserType") {
        response = await fetchallUserTypelist(page, rowsPerPage);
        setData(response?.userType || []);
        setPage(response.currentPage);
        setTotalRecords(response.totalUserType);
      } else if (tableType === "Industries") {
        response = await fetchallIndustrieslist(page, rowsPerPage, searchQuery);
        setData(response?.industries || []);
        setPage(response.currentPage);
        setTotalRecords(response.totalIndustries);
      } else if (tableType === "CaseStudies") {
        response = await fetchallCaseStudieslist(
          page,
          rowsPerPage,
          searchQuery
        );
        setData(response?.CaseStudies || []);
        setPage(response.currentPage);
        setTotalRecords(response.totalCaseStudies);
      } else if (tableType === "Job") {
        response = await fetchallJobslist(page, rowsPerPage, searchQuery);
        setData(response?.jobs || []);
        setPage(response.currentPage);
        setTotalRecords(response.totalJobs);
      } else if (tableType === "Products") {
        response = await fetchProductslist(page, rowsPerPage, searchQuery);
        setData(response?.Products || []);
        setPage(response.currentPage);
        setTotalRecords(response.totalProducts);
      } else if (tableType === "Team Category") {
        response = await fetchallTeamCategories(page, rowsPerPage, searchQuery);
        setData(response.categories);
        setTotalRecords(response.totalCategories);
        if (response.status == 400) {
          localStorage.removeItem("Token");
          navigate("/login");
        }
      } else if (tableType === "Team") {
        response = await fetchTeamMember(page, rowsPerPage, searchQuery);
        setData(response.members);
        setTotalRecords(response?.total);
        if (response.status == 400) {
          localStorage.removeItem("Token");
          navigate("/login");
        }
      } else if (tableType === "Role") {
        response = await fetchallRoles(page, rowsPerPage, searchQuery);
        setData(response.roles);
        setTotalRecords(response.totalRoles);
        if (response.status == 400) {
          localStorage.removeItem("Token");
          navigate("/login");
        }
      } else if (tableType === "Users") {
        response = await fetchallUserlist(page, rowsPerPage, searchQuery);
        setData(response.users);
        setPage(response.currentPage);
        setTotalRecords(response.totalUsers);
      } else if (tableType === "Comments") {
        response = await fetchallCommentlist(page, rowsPerPage);
        setData(response.comments);
        setTotalRecords(response.totalComments || 0);
      } else if (tableType === "Applications") {
        response = await fetchallApplication(page, rowsPerPage, searchQuery);
        setData(response?.applications);
        setPage(response.page);
        setTotalRecords(response.totalApplications || 0);
      } else if (tableType === "Testimonial") {
        response = await fetchallTestimonialslist(page, rowsPerPage);
        setData(response.testimonials);
        setTotalRecords(response.totalTestimonials || 0);
      } else if (tableType === "Lead") {
        response = await fetchallLeads(page, rowsPerPage, searchQuery);
        setData(response.leads);
        setTotalRecords(response?.totalLeads || 0);
        if (response.status == 400) {
          localStorage.removeItem("Token");
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAllClick = (event) => {
    setSelected(event.target.checked ? data.map((row) => row._id) : []);
  };

  const isSelected = (id) => selected.includes(id);

  const handleChangePage = (_, newPage) => {
    setPage(newPage + 1);
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
    } else if (tableType === "Services Categories") {
      setModelData(category);
      setModeltype("Update");
      setOpenServicesCategoryModal(true);
    } else if (tableType === "Services") {
      navigate(`/edit-service/${category._id}`);
    } else if (tableType === "CaseStudies") {
      navigate(`/edit-casestudies/${category._id}`);
    } else if (tableType === "Products") {
      navigate(`/edit-product/${category._id}`);
    } else if (tableType === "UserType") {
      setModelData(category);
      setModeltype("Update");
      setOpenUserTypeModal(true);
    } else if (tableType === "Role") {
      setModelData(category);
      setModeltype("Update");
      setOpenRoleModal(true);
    } else if (tableType === "Users") {
      setModelData(category);
      setModeltype("Update");
      setOpenUserModal(true);
    } else if (tableType === "Blogs") {
      navigate(`/edit-blog/${category._id}`);
    } else if (tableType === "Featured Blogs") {
      navigate(`/edit-featuredblog/${category._id}`);
    } else if (tableType === "Testimonial") {
      navigate(`/edit-testimonial/${category._id}`);
    } else if (tableType === "Lead") {
      setModelData(category);
      setOpenLeadsModal(true);
    } else if (tableType === "Job") {
      navigate(`/edit-job/${category._id}`);
    } else if (tableType === "Applications") {
      navigate(`/view-application/${category._id}`);
    } else if (tableType === "Comments") {
      setModelData(category);
      setModeltype("Update");
      setOpenCommentModal(true);
    } else if (tableType === "Team Category") {
      setModelData(category);
      setModeltype("Update");
      setOpenTeamCategoryModal(true);
    } else if (tableType === "Industries") {
      navigate(`/edit-industry/${category._id}`);
    } else if (tableType === "Team") {
      navigate(`/edit-team/${category._id}`);
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
      } else if (tableType === "Featured Blogs") {
        response = await deleteAllFeaturedBlogs({ ids: selected });
      } else if (tableType === "Categories") {
        response = await deleteAllCategories({ ids: selected });
      } else if (tableType === "Services Categories") {
        response = await deleteAllServicesCategories({ ids: selected });
      } else if (tableType === "Services") {
        response = await deleteAllServices({ ids: selected });
      } else if (tableType === "Comments") {
        response = await deleteAllComments({ ids: selected });
      } else if (tableType === "Lead") {
        response = await deleteAllLeads({ ids: selected });
      } else if (tableType === "Testimonial") {
        response = await deleteAllTestimonials({ ids: selected });
      } else if (tableType === "Job") {
        response = await deleteAllJobs({ ids: selected });
      } else if (tableType === "Applications") {
        response = await deleteAllApplications({ ids: selected });
      } else if (tableType === "Role") {
        response = await deleteAllRole({ ids: selected });
      } else if (tableType === "UserType") {
        response = await deleteAllUsersType({ ids: selected });
      } else if (tableType === "Users") {
        response = await deleteAllUsers({ ids: selected });
      } else if (tableType === "Team Category") {
        response = await deleteAllTeamCategories({ ids: selected });
      } else if (tableType === "Team") {
        response = await deleteAllTeam({ ids: selected });
      } else if (tableType === "CaseStudies") {
        response = await deleteAllCaseStudy({ ids: selected });
      } else if (tableType === "CaseStudies") {
        response = await deleteAllProducts({ ids: selected });
      } else if (tableType === "Industries") {
        response = await deleteAllIndustries({ ids: selected });
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
    }
    if (tableType === "Services Categories") {
      setOpenServicesCategoryModal(true);
      setModeltype("Add");
      setModelData();
    } else if (tableType === "Services") {
      navigate("/add-service");
    } else if (tableType === "UserType") {
      setOpenUserTypeModal(true);
      setModeltype("Add");
      setModelData();
    } else if (tableType === "Users") {
      setOpenUserModal(true);
      setModeltype("Add");
      setModelData();
    } else if (tableType === "Blogs") {
      navigate("/add-blog");
    } else if (tableType === "Featured Blogs") {
      navigate("/add-blog");
    } else if (tableType === "Testimonial") {
      navigate("/add-testimonial");
    } else if (tableType === "Team") {
      navigate("/add-team");
    } else if (tableType === "Team Category") {
      setOpenTeamCategoryModal(true);
      setModeltype("Add");
      setModelData();
    } else if (tableType === "Role") {
      setOpenRoleModal(true);
      setModeltype("Add");
      setModelData();
    } else if (tableType === "Job") {
      navigate("/add-job");
    } else if (tableType === "Industries") {
      navigate("/add-industry");
    } else if (tableType === "CaseStudies") {
      navigate("/add-casestudies");
    } else if (tableType === "Products") {
      navigate("/add-product");
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
        <Roles
          open={openRoleModal}
          setOpen={setOpenRoleModal}
          Modeltype={modeltype}
          Modeldata={modelData}
          onResponse={handleResponse}
        />

        <ViewLeads
          open={openLeadsModal}
          setOpen={setOpenLeadsModal}
          Modeltype={modeltype}
          Modeldata={modelData}
          refreshdata={fetchData}
        />
        <AddServicesCategories
          open={openServicesCategoryModal}
          setOpen={setOpenServicesCategoryModal}
          Modeltype={modeltype}
          Modeldata={modelData}
          onResponse={handleResponse}
        />
        <AddUsertype
          open={openUserTypeModal}
          setOpen={setOpenUserTypeModal}
          Modeltype={modeltype}
          Modeldata={modelData}
          onResponse={handleResponse}
        />

        {openUserModal && (
          <AddUser
            open={openUserModal}
            setOpen={setOpenUserModal}
            Modeltype={modeltype}
            Modeldata={modelData}
            onResponse={handleResponse}
          />
        )}

        <ApproveComment
          open={openCommentModal}
          setOpen={setOpenCommentModal}
          Modeltype={modeltype}
          Modeldata={modelData}
          onResponse={handleResponse}
        />
        <DeleteModal
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          onConfirm={handleDelete}
        />

        <Box sx={{ width: "100%" }}>
          <Paper sx={{ width: "100%", maxHeight: "95vh", boxShadow: "none" }}>
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: "var(--background-color)" }}
              >
                {tableType} List
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {(tableType === "Lead" ||
                  tableType === "Services" ||
                  tableType === "Industries" ||
                  tableType === "CaseStudies" ||
                  tableType === "Products" ||
                  tableType === "Blogs" ||
                  tableType === "Featured Blogs" ||
                  tableType === "Categories" ||
                  tableType === "Team" ||
                  tableType === "Team Category" ||
                  tableType === "Role" ||
                  tableType === "Applications" ||
                  tableType === "Users") && (
                  <TextField
                    size="small"
                    placeholder="Search..."
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setDebouncedSearch(searchQuery);
                      }
                    }}
                    sx={{
                      minWidth: 200,
                      backgroundColor: "white",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "var(--background-color)",
                        },
                        "&:hover fieldset": {
                          borderColor: "var(--background-color)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "var(--background-color)",
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon
                            sx={{
                              color: "var(--background-color)",
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}

                {selected.length > 0 && tableType !== "Featured Blogs" ? (
                  <IconButton onClick={handleDeleteClick} sx={{ color: "red" }}>
                    <DeleteIcon />
                  </IconButton>
                ) : (
                  tableType !== "Comments" &&
                  tableType !== "Lead" &&
                  tableType !== "Applications" &&
                  tableType !== "Featured Blogs" &&
                  tableType !== "Tickets" && (
                    <Button
                      sx={{
                        background: "var(--background-color)",
                        color: "var(--text-color)",
                        borderRadius: "var(--default-border-radius)",
                        "&:hover": { background: "var(--shadow-low3)" },
                      }}
                      onClick={handleAddButton}
                    >
                      Add {tableType}
                    </Button>
                  )
                )}
              </Box>
            </Toolbar>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        sx={{
                          color: "var(--background-color)",
                          "&.Mui-checked": { color: "var(--background-color)" },
                          "&.MuiCheckbox-indeterminate": {
                            color: "var(--background-color)",
                          },
                        }}
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
                        sx={{ color: "var(--background-color)" }}
                      >
                        {attr.label}
                      </TableCell>
                    ))}
                    <TableCell sx={{ color: "var(--background-color)" }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={attributes.length + 2}
                        align="center"
                        sx={{ py: 8 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 2,
                          }}
                        >
                          <CircularProgress
                            size={45}
                            thickness={4}
                            sx={{ color: "var(--primary-color)" }}
                          />
                          <Typography
                            sx={{
                              color: "var(--secondary-color)",
                              fontSize: "15px",
                              fontWeight: 500,
                              letterSpacing: "0.5px",
                            }}
                          >
                            Loading {tableType}...
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : data.length === 0 ? (
                    // No Data Found State
                    <TableRow>
                      <TableCell
                        colSpan={attributes.length + 2}
                        align="center"
                        sx={{ py: 8 }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: "var(--secondary-color)", mb: 1 }}
                        >
                          {searchQuery
                            ? "No results found"
                            : "No data available"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--secondary-color)" }}
                        >
                          {searchQuery
                            ? `No ${tableType.toLowerCase()} found matching "${searchQuery}"`
                            : `No ${tableType.toLowerCase()} available yet`}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    //  Render Data Rows
                    data.map((row) => {
                      const isItemSelected = isSelected(row._id);
                      return (
                        <TableRow key={row._id} selected={isItemSelected}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              sx={{
                                color: "var(--background-color)",
                                "&.Mui-checked": {
                                  color: "var(--background-color)",
                                },
                              }}
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
                          {attributes?.map((attr) => (
                            <TableCell
                              key={attr.id}
                              sx={{ color: "var(--black-color)" }}
                            >
                              {attr.id === "createdAt" ||
                              attr.id === "publishedDate" ? (
                                formatDate(row[attr.id])
                              ) : attr.id === "image" ||
                                attr.id === "thumbnail" ? (
                                tableType === "Testimonial" ||
                                tableType === "Blogs" ||
                                tableType === "Featured Blogs" ||
                                tableType === "Industries" ||
                                tableType === "CaseStudies" ? (
                                  row[attr.id] ? (
                                    <img
                                      alt=""
                                      src={baseUrl + row[attr.id]}
                                      style={{
                                        height: "50px",
                                        maxWidth: "200px",
                                        objectFit: "contain",
                                        margin: "auto",
                                      }}
                                    />
                                  ) : (
                                    <Avatar
                                      alt="Default"
                                      src="/static/images/avatar/1.jpg"
                                      sx={{ width: 40, height: 40 }}
                                    />
                                  )
                                ) : (
                                  <Avatar
                                    alt="Default"
                                    src={baseUrl + row[attr.id]}
                                    sx={{ width: 40, height: 40 }}
                                  />
                                )
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
                                      "var(--default-border-radius)",
                                  }}
                                >
                                  {row[attr.id] ? "Public" : "Private"}
                                </span>
                              ) : attr.id === "status" ? (
                                <span
                                  style={{
                                    color: row.isclosed
                                      ? "red"
                                      : row.status
                                      ? "green"
                                      : "orange",
                                    background: row.isclosed
                                      ? "#f8d7da"
                                      : row.status
                                      ? "#d4edda"
                                      : "#fff3cd",
                                    padding: "5px",
                                    minWidth: "100px",
                                    borderRadius:
                                      "var(--default-border-radius)",
                                  }}
                                >
                                  {row.isclosed
                                    ? "Closed"
                                    : row.status
                                    ? "Answered"
                                    : "Pending"}
                                </span>
                              ) : row[attr.id] === 0 ? (
                                0
                              ) : typeof getNestedValue(row, attr.id) ===
                                "string" ? (
                                truncateText(getNestedValue(row, attr.id), 30)
                              ) : (
                                getNestedValue(row, attr.id)
                              )}
                            </TableCell>
                          ))}

                          <TableCell>
                            <span
                              onClick={() => handleViewClick(row)}
                              style={{
                                color: "var(--background-color)",
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                            >
                              View
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[25, 50, 100, 150]}
              component="div"
              count={totalRecords || 0} // Correct count from API
              rowsPerPage={rowsPerPage}
              page={page - 1} // Convert to 0-based index for Material-UI
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </>
    ),
  };
}
