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
import { createCaseStudy, createIndustries } from "../../DAL/create";
import UploadFile from "../../Components/Models/UploadFile";
import { updateCaseStudy, updateIndustries } from "../../DAL/edit";
import { fetchcasestudy, fetchindustry } from "../../DAL/fetch";
import { useAlert } from "../../Components/Alert/AlertContext";

const AddIndustries = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const isEdit = !!id;

  // ✅ Separate states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(false);

  // ✅ Error messages state
  const [errors, setErrors] = useState({});

  // Load case study data in edit mode
  useEffect(() => {
    if (id) {
      const fetchCaseStudy = async () => {
        const response = await fetchindustry(id);
        const data = response.industry;
        setName(data?.name || "");
        setDescription(data?.description || "");

        setImage(data?.image || "");
        setPublished(data?.published || false);
      };
      fetchCaseStudy();
    }
  }, [isEdit, id]);

  const handleSubmit = async () => {
    const payload = { name, description, image, published };

    try {
      let response;
      if (isEdit) {
        response = await updateIndustries(id, payload);
      } else {
        response = await createIndustries(payload);
      }

      if (response.status === 200 || response.status === 201) {
        showAlert("success", response.message);
        navigate("/industries");
      } else if (response.missingFields) {
        const newErrors = {};
        response.missingFields.forEach((field) => {
          newErrors[field.name] = field.message;
        });
        setErrors(newErrors);
      }
    } catch (err) {
      console.error("Error saving Industry:", err);
    }
  };

  return (
    <Box sx={{ maxWidth: "100%", margin: "0 auto", p: 3 }}>
      <Typography variant="h6" mb={2}>
        {isEdit ? "Edit Industry" : "Add Industry"}
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
        multiline
        rows={3}
        error={!!errors.description}
        helperText={errors.description}
      />

      <Typography variant="h6" mt={3} mb={1}>
        Upload Image
      </Typography>
      <UploadFile
        multiple={false}
        accept="image/*"
        initialFile={image}
        error={errors.image}
        onUploadComplete={(path) => setImage(path)}
      />

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
        <Button onClick={() => navigate("/industries")} variant="outlined">
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

export default AddIndustries;
