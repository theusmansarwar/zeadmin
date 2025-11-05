import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
} from "@mui/material";
import JoditEditor from "jodit-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../Components/Alert/AlertContext";
import { fetchBlogById, fetchcategorylist } from "../../DAL/fetch";
import { updateBlog } from "../../DAL/edit";
import { createBlog } from "../../DAL/create";
import { baseUrl } from "../../Config/Config";
import UploadFile from "../../Components/Models/UploadFile";
import RichTextEditor from "../../Components/RichTextEditor/RichTextEditor";

const style = {
  Width: "100%",
  margin: "40px auto",
  bgcolor: "background.paper",
};

const AddBlog = () => {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [detail, setDetail] = useState("");
  const [author, setAuthor] = useState("");
  const [newauthor, setNewAuthor] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [faqSchemaText, setFaqSchemaText] = useState("{}");
  const [image, setImage] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      uploader: { insertImageAsBase64URI: true },
      placeholder: "Start typing...",
    }),
    []
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userName = user?.name || "";
    setNewAuthor(userName);
    if (id) {
      const fetchBlog = async () => {
        try {
          const response = await fetchBlogById(id);
          if (response.status === 200) {
            const blog = response.blog;
            setTitle(blog.title || "");
            setDescription(blog.description || "");
            setDetail(blog.detail || "");
            setAuthor(blog.author || "");
            setMetaDescription(blog.metaDescription || "");
            setSlug(blog.slug || "");
            setCategoryId(blog.category?._id || "");
            setImage(blog.thumbnail);

            setFaqSchemaText(blog.faqSchema || "{}");
            setIsFeatured(blog?.featured);
            setIsVisible(blog?.published);
            setAuthor(blog.author || "");
          }
        } catch (error) {
          console.error("Error fetching blog:", error);
        }
      };
      fetchBlog();
    }
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchcategorylist();
        if (response && response.categories) {
          setCategories(response.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorObj = {};

    try {
      JSON.parse(faqSchemaText);
    } catch {
      errorObj.faqSchema = "Schema JSON is invalid.";
    }

    if (Object.keys(errorObj).length > 0) {
      setErrors(errorObj);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("detail", detail);
    formData.append("metaDescription", metaDescription);
    formData.append("slug", slug);
    formData.append("category", categoryId);
    formData.append("published", isVisible);
    formData.append("featured", isFeatured);
    formData.append("faqSchema", faqSchemaText);
    formData.append("author", author || newauthor);
    formData.append("thumbnail", image ? image.replace(baseUrl, "") : "");

    try {
      const response = id
        ? await updateBlog(id, formData)
        : await createBlog(formData);

      if (response.status == 200 || response.status == 201) {
        showAlert("success", response.message);
        if (location.pathname.includes("featured")) {
          navigate("/blogs/featured");
        } else {
          navigate("/blogs");
        }
      } else if (response.missingFields) {
        const newErrors = {};
        response.missingFields.forEach((field) => {
          newErrors[field.name] = field.message;
        });
        setErrors(newErrors);
      } else {
        showAlert("error", response.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showAlert("error", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={style}>
      <Typography variant="h5" mb={2}>
        {id ? "Edit Blog" : "Add Blog"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={2}
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={2}
          label="Meta Description"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          error={!!errors.metaDescription}
          helperText={errors.metaDescription}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          label="FAQ Schema (JSON)"
          value={faqSchemaText}
          onChange={(e) => setFaqSchemaText(e.target.value)}
          error={!!errors.faqSchema}
          helperText={errors.faqSchema}
          sx={{ mb: 2 }}
        />

        <Typography variant="h6" mt={3} mb={1}>
          Upload Thumbnail
        </Typography>
        <UploadFile
          multiple={false}
          accept="image/*"
          initialFile={image}
          error={errors.thumbnail}
          onUploadComplete={(path) => setImage(path)}
        />
        <TextField
          fullWidth
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          error={!!errors.slug}
          helperText={errors.slug}
          sx={{ mb: 2, mt: 4 }}
        />
        <Box sx={{ minWidth: 120, mb: 2 }}>
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={categoryId}
              label="Category"
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <MenuItem value="">Select a category</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {errors.category}
              </Typography>
            )}
          </FormControl>
        </Box>
<RichTextEditor/>
        {errors.detail && (
          <Typography color="error">{errors.detail}</Typography>
        )}

        <FormControlLabel
          control={
            <Switch
              checked={isFeatured}
              onChange={() => setIsFeatured(!isFeatured)}
              color="primary"
            />
          }
          label="Featured"
          sx={{ mt: 2 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={isVisible}
              onChange={() => setIsVisible(!isVisible)}
              color="primary"
            />
          }
          label={`Visibility: ${isVisible ? "Public" : "Draft"}`}
          sx={{ mt: 1 }}
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            mt: 3,
          }}
        >
          <Button
            type="button"
            variant="contained"
            sx={{ backgroundColor: "#B1B1B1" }}
            onClick={() => navigate("/blogs")}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              background: "var(--background-color)",
              color: "var(--text-color)",
              borderRadius: "var(--default-border-radius)",
              "&:hover": { background: "var(--background-color)" },
            }}
          >
            {loading ? "Saving..." : id ? "Update Blog" : "Save"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddBlog;
