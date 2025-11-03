import * as React from "react";
import { Box, Button, Typography, Modal, TextField } from "@mui/material";
import { createNewFaq, createNewProvenStep } from "../../DAL/create";
import { updateFaq, updateProvenSteps } from "../../DAL/edit";

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

export default function ProvenStepsModal({
    open,
    setOpen,
    Modeltype,
    Modeldata,
    onResponse,
    SubServicesid,
}) {
    const [question, setQuestion] = React.useState(Modeldata?.question || "");
    const [answer, setAnswer] = React.useState(Modeldata?.answer || "");
    const [id, setId] = React.useState(Modeldata?._id || "");
    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {
        setQuestion(Modeldata?.question || "");
        setAnswer(Modeldata?.answer || "");
        setId(Modeldata?._id || "");
        setErrors({});
    }, [Modeldata, open, setOpen]);

    const handleClose = () => setOpen(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const stepsData = {
            question,
            answer,
            SubServicesid,
        };

        let response;
        if (Modeltype === "Add") {
            response = await createNewProvenStep(stepsData);
        } else {
            response = await updateProvenSteps(id, stepsData);
        }

        if (response.status === 201 || response.status === 200) {
            onResponse({ messageType: "success", message: response.message });
            setQuestion("");
            setAnswer("");
            setOpen(false);
        } else if (response.missingFields) {
            const newErrors = {};
            response.missingFields.forEach((field) => {
                newErrors[field.name] = field.message;
            });
            setErrors(newErrors);
        }

        else {
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
                    {Modeltype} Proven Steps
                </Typography>

                {/* Question input */}
                <TextField
                    sx={{ marginTop: "10px", borderRadius: "6px" }}
                    fullWidth
                    required
                    label="Step Heading"
                    variant="outlined"
                    value={question}
                    error={!!errors.question}
                    helperText={errors.question}
                    onChange={(e) => setQuestion(e.target.value)}
                />

                {/* Answer input */}
                <TextField
                    sx={{ marginTop: "10px", borderRadius: "6px" }}
                    fullWidth
                    multiline
                    minRows={4}
                    label="Step Description"
                    variant="outlined"
                    value={answer}
                    error={!!errors.answer}
                    helperText={errors.answer}
                    onChange={(e) => setAnswer(e.target.value)}
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
