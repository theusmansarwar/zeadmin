import * as React from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { IoMdCloseCircle } from "react-icons/io";
import { addProcess, addService, createnewRole } from "../../DAL/create";
import { updateProcess, updateRole, updateSubService } from "../../DAL/edit";
import dummyimg from "../../Assets/upload-background.PNG";
import { baseUrl } from "../../Config/Config";
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

export default function AddProcess({ open, setOpen, Modeltype, Modeldata, onResponse }) {
  const fileInputRef = React.useRef(null);
 

  const [title, setTitle] = React.useState(Modeldata?.data?.title || "");
  const [description, setDescription] = React.useState(Modeldata?.data?.description || "");
  const [image, setImage] = React.useState(Modeldata?.data?.image|| dummyimg);
  const [published, setPublished] = React.useState(Modeldata?.data?.published || false);
  const [id, setId] = React.useState(Modeldata?.id || "");
  const [subid, setsubid] = React.useState(Modeldata?.data?._id || "");
  const [errors, setErrors] = React.useState({});
  
  React.useEffect(() => {
    setTitle(Modeldata?.data?.title || "");
    setDescription(Modeldata?.data?.description || "");
    setImage(Modeldata?.data?.image|| dummyimg);
    setPublished(Modeldata?.data?.published || false);
    setsubid(Modeldata?.data?._id || false);
    setId(Modeldata?.id || "");
  }, [Modeldata]);

  const handleClose = () => setOpen(false);

  

  const handleFileChange = (event) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setImage(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("published", published);
   
  
    if (fileInputRef.current?.files[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }
  
    let response;
    if (Modeltype === "Add") {
      formData.append("id", id);
     
      response = await addProcess(formData);
    } else {
      formData.append("serviceId", id);
      formData.append("subServiceId", subid);
      response = await updateProcess(formData);
    }
  
    if (response.status === 201 || response.status === 200) {
      onResponse({ messageType: "success", message: response.message });
    } else {
      onResponse({ messageType: "error", message: response.message });
    }
  
    setOpen(false);
  };
  

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={style}>
      
        
        <Typography id="modal-title" variant="h6">
          {Modeltype} Process
        </Typography>
        <div className="upper-section">
        <div className="left">
        <TextField
          sx={{ marginTop: "10px", padding:"0px" }}
          fullWidth
          required
          label="Process Title"
          variant="outlined"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
        />

        <TextField
          sx={{ marginTop: "10px",padding:"0px" }}
          fullWidth
          required
          label="Description"
          variant="outlined"
          name="description"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
        />
  
          <FormControlLabel
          control={<Switch checked={published} onChange={(e) => setPublished(e.target.checked)} color="primary" />}
          label="Published"
          sx={{ marginTop: "10px" }}
        />
</div>

        <div className="image-container3" style={{ border: errors.image ? "2px solid red" : "", marginTop: "10px" }}>
          <img
            src={image?.startsWith("/upload") ? `${baseUrl}${image}` : image || dummyimg}
            alt="Thumbnail"
            onClick={() => fileInputRef.current?.click()}
            style={{ objectFit: "cover", cursor: "pointer", borderRadius: "6px" }}
          />
          <IoMdCloseCircle
            className="remove-icon"
            style={{ position: "absolute", cursor: "pointer", marginLeft: "-20px", color: "red" }}
            onClick={() => setImage(dummyimg)}
          />
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
        {errors.image && <Typography color="error">{errors.image}</Typography>}

      
</div>
        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", marginTop: "10px" }}>
          <Button type="button" variant="contained" sx={{ backgroundColor: "#B1B1B1" }} onClick={handleClose}>
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
