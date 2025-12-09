import * as React from "react";
import { Box, Button, Typography, Modal, TextField } from "@mui/material";
import { createNewWhyStep } from "../../DAL/create";
import { updateWhySteps } from "../../DAL/edit";

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

export default function WhyStepsModal({
  open,
  setOpen,
  Modeltype,
  Modeldata,
  onResponse,
  serviceid,
}) {
  const [stepTitle, setStepTitle] = React.useState(Modeldata?.stepTitle || "");
  const [stepDescription, setStepDescription] = React.useState(
    Modeldata?.stepDescription || ""
  );
  const [id, setId] = React.useState(Modeldata?._id || "");
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    setStepTitle(Modeldata?.stepTitle || "");
    setStepDescription(Modeldata?.stepDescription || "");
    setId(Modeldata?._id || "");
    setErrors({});
  }, [Modeldata, open, setOpen]);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stepsData = {
      stepTitle,
      stepDescription,
      serviceid,
    };

    let response;
    if (Modeltype === "Add") {
      response = await createNewWhyStep(stepsData);
    } else {
      response = await updateWhySteps(id, stepsData);
    }

    if (response.status === 201 || response.status === 200) {
      onResponse({ messageType: "success", message: response.message });
      setStepTitle("");
      setStepDescription("");
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
          {Modeltype} Why Steps
        </Typography>

        {/* title input */}
        <TextField
          sx={{ marginTop: "10px", borderRadius: "6px" }}
          fullWidth
          required
          label="Step Heading"
          variant="outlined"
          value={stepTitle}
          error={!!errors.stepTitle}
          helperText={errors.stepTitle}
          onChange={(e) => setStepTitle(e.target.value)}
        />

        {/* description input */}
        <TextField
          sx={{ marginTop: "10px", borderRadius: "6px" }}
          fullWidth
          multiline
          minRows={4}
          label="Step Description"
          variant="outlined"
          value={stepDescription}
          error={!!errors.stepDescription}
          helperText={errors.stepDescription}
          onChange={(e) => setStepDescription(e.target.value)}
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
