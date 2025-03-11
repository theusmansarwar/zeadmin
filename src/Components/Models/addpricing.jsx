import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Switch,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { IoMdCloseCircle } from "react-icons/io";
import axios from "axios";
import { createnewPrice } from "../../DAL/create";
import { updatePrice } from "../../DAL/edit";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  maxHeight: "80vh",
  overflow: "scroll",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
};

export default function AddPricing({ open, setOpen, Modeltype, Modeldata, onResponse }) {
  // Initialize states correctly
  const [name, setName] = useState(Modeldata?.data?.name || "");
  const [published, setPublished] = useState(Modeldata?.data?.published || false);
  const [id, setId] = useState(Modeldata?.data?._id || "");
  const [price, setPrice] = useState(Modeldata?.data?.price || "");
  const [validity, setValidity] = useState(Modeldata?.data?.validity || "");
  const [features, setFeatures] = useState(Modeldata?.data?.features || [""]);
  const [serviceId, setServiceId] = useState(Modeldata?.id || "");
  const [errors, setErrors] = useState({});

  console.log("Model Data is :::", Modeldata);

  useEffect(() => {
    setName(Modeldata?.data?.name || "");
    setPublished(Modeldata?.data?.published || false);
    setId(Modeldata?.data?._id || "");
    setPrice(Modeldata?.data?.price || "");
    setValidity(Modeldata?.data?.validity || "");
    setFeatures(Modeldata?.data?.features || [""]);
    setServiceId(Modeldata?.id || ""); // Service ID is outside 'data'
    setErrors({});
  }, [Modeldata]);

  const handleClose = () => setOpen(false);

  // Handle Feature Input Change
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  // Add new feature
  const addFeature = () => setFeatures([...features, ""]);

  // Remove feature
  const removeFeature = (index) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!price) newErrors.price = "Price is required";
    if (!validity) newErrors.validity = "Validity is required";
    if (features.length === 0 || features.some((f) => f.trim() === "")) {
      newErrors.features = "At least one feature is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = {
      name,
      price,
      validity,
      published,
      features,
      serviceId,
      id
    };

    try {
      let response;
      if (Modeltype === "Add") {
        response = await createnewPrice(formData);
      } else {
        response =await updatePrice(formData); 
      }

      if (response.status == 201 || response.status == 200) {
        onResponse({ messageType: "success", message: response.message });
      } else {
        onResponse({ messageType: "error", message: response.message });
      }
    } catch (error) {
      console.error("Error submitting pricing:", error);
      onResponse({ messageType: "error", message: "Failed to submit pricing" });
    }

    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <Typography id="modal-title" variant="h6">
          {Modeltype} Pricing
        </Typography>

        <TextField
          fullWidth
          required
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          sx={{ marginTop: "10px" }}
        />

        <TextField
          fullWidth
          required
          label="Price"
          variant="outlined"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          error={!!errors.price}
          helperText={errors.price}
          sx={{ marginTop: "10px" }}
        />

        <TextField
          fullWidth
          required
          label="Validity"
          variant="outlined"
          value={validity}
          onChange={(e) => setValidity(e.target.value)}
          error={!!errors.validity}
          helperText={errors.validity}
          sx={{ marginTop: "10px" }}
        />

        <Typography variant="subtitle1" sx={{ marginTop: "10px" }}>
          Features
        </Typography>
        {features.map((feature, index) => (
          <Box key={index} display="flex" alignItems="center" gap={1} sx={{ marginTop: "5px" }}>
            <TextField
              fullWidth
              variant="outlined"
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              error={!!errors.features}
              helperText={index === features.length - 1 ? errors.features : ""}
            />
            {features.length > 1 && (
              <IconButton onClick={() => removeFeature(index)} color="error">
                <IoMdCloseCircle />
              </IconButton>
            )}
          </Box>
        ))}
        <Button onClick={addFeature} sx={{ marginTop: "5px", textTransform: "none" }}>
          + Add Feature
        </Button>

        <FormControlLabel
          control={<Switch checked={published} onChange={(e) => setPublished(e.target.checked)} color="primary" />}
          label="Published"
          sx={{ marginTop: "10px" }}
        />

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", marginTop: "15px" }}>
          <Button variant="contained" sx={{ backgroundColor: "#B1B1B1" }} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            type="submit"
            variant="contained"
            sx={{
              background: "var(--horizontal-gradient)",
              color: "var(--white-color)",
              borderRadius: "var(--border-radius-secondary)",
              "&:hover": { background: "var(--vertical-gradient)" },
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
