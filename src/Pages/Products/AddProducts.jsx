import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { createProducts } from "../../DAL/create";
import UploadFile from "../../Components/Models/UploadFile";
import { updateProducts } from "../../DAL/edit";
import { fetchProducts } from "../../DAL/fetch";
import { useAlert } from "../../Components/Alert/AlertContext";

const AddProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const isEdit = !!id;

  // Separate states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [detail, setDetail] = useState("");
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(false);

  //  Error messages state
  const [errors, setErrors] = useState({});

  // Load case study data in edit mode
  useEffect(() => {
    if (id) {
      const getProducts = async () => {
        const response = await fetchProducts(id);
        const data = response.product;
        setName(data?.name || "");
        setDescription(data?.description || "");
        setDetail(data?.detail || "");
        setImage(data?.image || "");
        setPublished(data?.published || false);
      };
      getProducts();
    }
  }, [isEdit, id]);

  const handleSubmit = async () => {
    const payload = { name, description, detail, image, published };

    try {
      let response;
      if (isEdit) {
        response = await updateProducts(id, payload);
      } else {
        response = await createProducts(payload);
      }

      if (response.status === 200 || response.status === 201) {
        showAlert("success", response.message);
        navigate("/products");
      } else if (response.missingFields) {
        const newErrors = {};
        response.missingFields.forEach((field) => {
          newErrors[field.name] = field.message;
        });
        setErrors(newErrors);
      }
    } catch (err) {
      console.error("Error saving products:", err);
    }
  };

  return (
    <Box sx={{ maxWidth: "100%", margin: "0 auto", p: 3 }}>
      <Typography variant="h6" mb={2}>
        {isEdit ? "Edit Product" : "Add Product"}
      </Typography>

      <TextField
        fullWidth
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        error={!!errors.name}
        helperText={errors.name}
      />


      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        error={!!errors.description}
        helperText={errors.description}
      />

      <TextField
        fullWidth
        label="Popup Detail"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        margin="normal"
        multiline
        rows={8}
        error={!!errors.detail}
        helperText={errors.detail}
      />

      <Typography variant="h6" mt={3} mb={1}>
        Upload Image
      </Typography>
      <UploadFile
        multiple={false}
        accept="image/*"
        initialFile={image}
        onUploadComplete={(path) => setImage(path)}
      />
      {errors.image && (
        <Typography color="error" variant="body2">
          {errors.image}

        </Typography>
      )}

      <FormControlLabel
        control={
          <Switch
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
        }
        label="Published"
        sx={{ mt: 2 }}
      />

      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={() => navigate("/products")} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            background: "var(--background-color)",
            color: "var(--text-color)",
            borderRadius: "var(--default-border-radius)",
            "&:hover": { background: "var(--background-color)" },
          }}
        >
          {isEdit ? "Update" : "Add"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddProducts;
