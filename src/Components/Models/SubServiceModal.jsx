import * as React from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
} from "@mui/material";
import UploadFile from "./UploadFile";
import { createSubServices } from "../../DAL/create";
import { updateSubService } from "../../DAL/edit";

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

export default function SubServiceModal({
  open,
  setOpen,
  Modeltype,
  Modeldata,
  onResponse,
  Productsid,
}) {
  const [title, setTitle] = React.useState(Modeldata?.title || "");
  const [description, setDescription] = React.useState(Modeldata?.description || "");
  const [slug, setSlug] = React.useState(Modeldata?.slug || "");
  const [image, setImage] = React.useState(Modeldata?.image || "");
  const [id, setId] = React.useState(Modeldata?._id || "");

  React.useEffect(() => {
    setTitle(Modeldata?.title || "");
    setDescription(Modeldata?.description || "");
    setSlug(Modeldata?.slug || "");
    setImage(Modeldata?.image || ""); // image path string
    setId(Modeldata?._id || "");
  }, [Modeldata]);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ prepare plain object instead of FormData
    const payload = {
      title,
      description,
      slug,
      productid: Productsid,
      image, // send path string ("/uploads/xxx.png")
    };

    let response;
    if (Modeltype === "Add") {
      response = await createSubServices(payload);
    } else {
      response = await updateSubService(id, payload);
    }

    if (response.status === 201 || response.status === 200) {
      onResponse({ messageType: "success", message: response.message });
    } else {
      onResponse({ messageType: "error", message: response.message });
    }

    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          {Modeltype} Sub Service
        </Typography>

        {/* Product Name */}
        <TextField
          sx={{ marginTop: "10px", borderRadius: "6px" }}
          fullWidth
          required
          label="Sub Service Name"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <TextField
          sx={{ marginTop: "10px", borderRadius: "6px" }}
          fullWidth
          multiline
          minRows={4}
          label="Sub Service Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* Product Name */}
        <TextField
          sx={{ marginTop: "10px", borderRadius: "6px" }}
          fullWidth
          required
          label="Sub Service Slug"
          variant="outlined"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        {/* Image Upload */}
        <Box sx={{ marginTop: "15px" }}>
          <UploadFile
            accept="image/*"
            initialFile={image} // pass existing path if editing
            onUploadComplete={(path) => setImage(path)} // ✅ store string path
          />
        </Box>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            marginTop: "20px",
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
              "&:hover": { background: "var(--background-color)" },
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}