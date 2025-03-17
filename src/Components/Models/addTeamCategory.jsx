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
import {createnewTeamCategory } from "../../DAL/create";
import { updateCategory, updateTeamCategory } from "../../DAL/edit";


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

export default function AddTeamCategories({ open, setOpen, Modeltype, Modeldata,onResponse  }) {
  const [name, setName] = React.useState(Modeldata?.name || "");
  const [published, setPublished] = React.useState(Modeldata?.published || false);
  const [id, setId] = React.useState(Modeldata?._id || "");

  React.useEffect(() => {
    setName(Modeldata?.name || "");
    setPublished(Modeldata?.published || false);
    setId(Modeldata?._id || "");
  }, [Modeldata]);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const categoryData = {
        name: name,
        published: published,
      };
  let response;
    if (Modeltype === "Add") {
      response =await createnewTeamCategory(categoryData); 
      
    }else{
        response =await updateTeamCategory(id,categoryData); 
    }
    if(response.status==201){
        onResponse({ messageType: "success", message: response.message });
    }
    else if(response.status==200){
        onResponse({ messageType: "success", message: response.message });
    }
  else{
    onResponse({ messageType: "error", message: response.message });
  }
    setOpen(false);
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
          {Modeltype} Category
        </Typography>
        <TextField
          sx={{ marginTop: "10px", borderRadius: "6px" }}
          fullWidth
          required
          label="Category Name"
          variant="outlined"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormControlLabel
          control={
            <Switch
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              color="primary"
            />
          }
          label="Published"
          sx={{ marginTop: "10px" }}
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
