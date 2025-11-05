import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../Components/Alert/AlertContext";
import {
  Box,
  Button,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  MenuItem,
  Checkbox,
  FormGroup,
  FormLabel,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { fetchJobById } from "../../DAL/fetch";
import { updateJob } from "../../DAL/edit";
import { createNewJob } from "../../DAL/create";

const AddJobs = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { id } = useParams();

  // Form fields
  const [jobCategory, setJobCategory] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full Time");
  const [experience, setExperience] = useState("");
  const [officeTiming, setOfficeTiming] = useState("");
  const [workingDays, setWorkingDays] = useState([]);
  const [vacancies, setVacancies] = useState("");
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Handle working days selection
  const handleWorkingDaysChange = (day) => {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Fetch existing job (for edit)
  const fetchJob = async () => {
    if (!id) return;
    try {
      const response = await fetchJobById(id);
      if (response.status === 200) {
        const job = response.job;
        setJobCategory(job.jobCategory || "");
        setTitle(job.title || "");
        setLocation(job.location || "");
        setJobType(job.jobType || "Full Time");
        setExperience(job.experience || "");
        setOfficeTiming(job.officeTiming || "");
        setWorkingDays(job.workingDays || []);
        setVacancies(job.vacancies || "");
        setDescription(job.description || "");
        setIsVisible(job.published || false);
      }
    } catch (error) {
      console.error("Error fetching job:", error);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const jobData = {
        jobCategory,
        title,
        location,
        jobType,
        experience,
        officeTiming,
        workingDays,
        vacancies,
        description,
        published: isVisible,
      };

      let response = id
        ? await updateJob(id, jobData)
        : await createNewJob(jobData);

      if (response.status === 200 || response.status === 201) {
        showAlert("success", response.message || "Job saved successfully!");
        navigate("/jobs");
      } else if (response.missingFields) {
        const newErrors = {};
        response.missingFields.forEach((f) => (newErrors[f.name] = f.message));
        setErrors(newErrors);
      } else {
        showAlert("error", response.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting job:", error);
      showAlert("error", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "var(--background-color)" }}
      >
        {id ? "Edit Job" : "Add Job"}
      </Typography>
        <Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Basic Info */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Job Category"
                  fullWidth
                  value={jobCategory}
                  onChange={(e) => setJobCategory(e.target.value)}
                  error={!!errors.jobCategory}
                  helperText={errors.jobCategory}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Job Title"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={!!errors.title}
                  helperText={errors.title}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Location"
                  fullWidth
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  error={!!errors.location}
                  helperText={errors.location}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Job Type"
                  fullWidth
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <MenuItem value="Full Time">Full Time</MenuItem>
                  <MenuItem value="Part Time">Part Time</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Experience (e.g. 2+ years)"
                  fullWidth
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  error={!!errors.experience}
                  helperText={errors.experience}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Office Timing (e.g. 9:00 AM - 6:00 PM)"
                  fullWidth
                  value={officeTiming}
                  onChange={(e) => setOfficeTiming(e.target.value)}
                  error={!!errors.officeTiming}
                  helperText={errors.officeTiming}
                />
              </Grid>
            </Grid>

            {/* Working Days */}
            <Box>
              <FormLabel component="legend" sx={{ mb: 1 }}>
                Working Days
              </FormLabel>
              <FormGroup row>
                {daysOfWeek.map((day) => (
                  <FormControlLabel
                    key={day}
                    control={
                      <Checkbox
                        checked={workingDays.includes(day)}
                        onChange={() => handleWorkingDaysChange(day)}
                      />
                    }
                    label={day}
                  />
                ))}
              </FormGroup>
              {errors.workingDays && (
                <Typography color="error" fontSize="0.8rem">
                  {errors.workingDays}
                </Typography>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="No. of Vacancies"
                  type="number"
                  fullWidth
                  value={vacancies}
                  onChange={(e) => setVacancies(e.target.value)}
                  error={!!errors.vacancies}
                  helperText={errors.vacancies}
                />
              </Grid>
            </Grid>

            <TextField
              label="Job Description"
              fullWidth
              multiline
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isVisible}
                  onChange={() => setIsVisible(!isVisible)}
                />
              }
              label={isVisible ? "Public" : "Draft"}
            />

            {/* Buttons */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/jobs")}
                sx={{
                  background: "var(--secondary-color, #B1B1B1)",
                  color: "#fff",
                  borderRadius: "6px",
                  "&:hover": { background: "#999" },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  background: "var(--background-color)",
                  color: "#fff",
                  borderRadius: "6px",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </Box>
          </Box>
        </Box>

    </Box>
  );
};

export default AddJobs;
