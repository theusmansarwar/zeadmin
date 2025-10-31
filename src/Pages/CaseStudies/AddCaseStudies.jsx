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
import { createCaseStudy } from "../../DAL/create";
import UploadFile from "../../Components/Models/UploadFile";
import { updateCaseStudy } from "../../DAL/edit";
import { fetchcasestudy } from "../../DAL/fetch";
import { useAlert } from "../../Components/Alert/AlertContext";

const AddCaseStudies = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const isEdit = !!id;

  // Separate states
  const [name, setName] = useState("");
  const [shortdescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [detail, setDetail] = useState("");
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(false);

  //  Error messages state
  const [errors, setErrors] = useState({});

  // Load case study data in edit mode
  useEffect(() => {
    const fetchCaseStudy = async () => {
      const response = await fetchcasestudy(id);
      const data = response.CaseStudy;
      setName(data?.name || "");
      setShortDescription(data?.shortdescription || "");
      setDescription(data?.description || "");
      setDetail(data?.detail || "");
      setFile(data?.file || "");
      setImage(data?.image || "");
      setPublished(data?.published || false);
    };
    fetchCaseStudy();
  }, [isEdit, id]);

  const handleSubmit = async () => {
    const payload = { name,shortdescription, description, detail, file, image, published };

    try {
      let response;
      if (isEdit) {
        response = await updateCaseStudy(id, payload);
      } else {
        response = await createCaseStudy(payload);
      }

      if (response.status === 200 || response.status === 201) {
        showAlert("success", response.message);
        navigate("/casestudies");
      } else if (response.missingFields) {
        const newErrors = {};
        response.missingFields.forEach((field) => {
          newErrors[field.name] = field.message;
        });
        setErrors(newErrors);
      }
    } catch (err) {
      console.error("Error saving case study:", err);
    }
  };

  return (
    <Box sx={{ maxWidth: "100%", margin: "0 auto", p: 3 }}>
      <Typography variant="h6" mb={2}>
        {isEdit ? "Edit Case Study" : "Add Case Study"}
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
        label="Short Description"
        value={shortdescription}
        onChange={(e) => setShortDescription(e.target.value)}
        margin="normal"
        error={!!errors.shortdescription}
        helperText={errors.shortdescription}
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
        rows={3}
        error={!!errors.detail}
        helperText={errors.detail}
      />

      <Typography variant="h6" mt={3} mb={1}>
        Upload File
      </Typography>
      <UploadFile
        multiple={false}
        accept="application/pdf"
        initialFile={file}
        onUploadComplete={(path) => setFile(path)}
      />
      {errors.file && (
        <Typography color="error" variant="body2">
          {errors.file}
        </Typography>
      )}

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
        <Button onClick={() => navigate("/casestudies")} variant="outlined">
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

export default AddCaseStudies;
