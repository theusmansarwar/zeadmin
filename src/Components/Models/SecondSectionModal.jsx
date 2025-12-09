import * as React from "react";
import { Box, Button, Typography, Modal, TextField } from "@mui/material";
import { createNewFaq, createNewSecond } from "../../DAL/create";
import { updateFaq, updateSecond } from "../../DAL/edit";
import UploadFile from "./UploadFile";
import { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
};

export default function SecondSectionModal({
  open,
  setOpen,
  Modeltype,
  Modeldata,
  onResponse,
  serviceid,
}) {
  const [title, setTitle] = React.useState(Modeldata?.title || "");
  const [description, setDescription] = React.useState(
    Modeldata?.description || ""
  );
  const [image, setImage] = useState("");
  const [id, setId] = React.useState(Modeldata?._id || "");
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    setTitle(Modeldata?.title || "");
    setDescription(Modeldata?.description || "");
    setImage(Modeldata?.image || "");
    setId(Modeldata?._id || "");
    setErrors({});
  }, [Modeldata, open, setOpen]);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const secondData = {
      title,
      description,
      image,
      serviceid,
    };

    let response;
    if (Modeltype === "Add") {
      response = await createNewSecond(secondData);
    } else {
      response = await updateSecond(id, secondData);
    }

    if (response.status === 201 || response.status === 200) {
      onResponse({ messageType: "success", message: response.message });
      setTitle("");
      setDescription("");
      setImage("");
      setOpen(false);
    } else if (response.missingFields) {
      const newErrors = {};
      response.missingFields.forEach((field) => {
        newErrors[field.name] = field.message;
      });
      setErrors(newErrors);
    } else {
      onResponse({ messageType: "error", message: response.message });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          {Modeltype} Second Section
        </Typography>

        {/* title input */}
        <TextField
          sx={{ marginTop: "10px", borderRadius: "6px" }}
          fullWidth
          required
          label="Title"
          variant="outlined"
          value={title}
          error={!!errors.title}
          helperText={errors.title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* description input */}
        <TextField
          sx={{ marginTop: "10px", borderRadius: "6px" }}
          fullWidth
          multiline
          minRows={4}
          label="Description"
          variant="outlined"
          value={description}
          error={!!errors.description}
          helperText={errors.description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* Image */}
        <Typography
          variant="h6"
          sx={{ marginTop: "20px", marginBottom: "10px" }}
        >
          Upload Icon
        </Typography>
        <UploadFile
          multiple={false}
          accept="image/*"
          initialFiles={image}
          onUploadComplete={(path) => setImage(path)}
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        >
          <Button
            type="button"
            variant="contained"
            sx={{ backgroundColor: "#B1B1B1" }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            type="submit"
            variant="contained"
            sx={{
              background: "var(--background-color)",
              color: "var(--text-color)",
              borderRadius: "var(--default-border-radius)",
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
