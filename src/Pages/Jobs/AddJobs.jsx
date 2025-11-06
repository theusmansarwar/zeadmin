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
  const [jobtitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobtype, setJobType] = useState("Full Time");
  const [noofyearsexperience, setNoOfYearsExperience] = useState("");
  const [officeStartTime, setOfficeStartTime] = useState("");
  const [officeEndTime, setOfficeEndTime] = useState("");
  const [noofvacancies, setNoOfVacancies] = useState("");
  const [description, setDescription] = useState("");
  const [lastdatetoapply, setLastDateToApply] = useState("");
  const [workingDays, setWorkingDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

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
    setWorkingDays((prev) => ({
      ...prev,
      [day.toLowerCase()]: !prev[day.toLowerCase()],
    }));
  };


  // Fetch existing job (for edit)
  const fetchJob = async () => {
    if (!id) return;
    try {
      const response = await fetchJobById(id);
      if (response.status === 200) {
        const job = response.job;
        setJobCategory(job.jobCategory || "");
        setJobTitle(job.jobtitle || "");
        setLocation(job.location || "");
        setJobType(job.jobtype || "Full Time");
        setNoOfYearsExperience(job.noofyearsexperience || "");

        // Split stored office timing into start & end if exists
        if (job.officetiming?.includes("-")) {
          const [start, end] = job.officetiming.split(" - ");
          setOfficeStartTime(start.trim());
          setOfficeEndTime(end.trim());
        } else {
          setOfficeStartTime(job.officetiming || "");
          setOfficeEndTime("");
        }

        setNoOfVacancies(job.noofvacancies || "");
        setDescription(job.description || "");
        setLastDateToApply(job.lastdatetoapply || "");
        setIsVisible(job.published || false);
        setWorkingDays({
          monday: job.workingDays?.monday || false,
          tuesday: job.workingDays?.tuesday || false,
          wednesday: job.workingDays?.wednesday || false,
          thursday: job.workingDays?.thursday || false,
          friday: job.workingDays?.friday || false,
          saturday: job.workingDays?.saturday || false,
          sunday: job.workingDays?.sunday || false,
        });

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

    // const newErrors = {};
    // if (!officeStartTime) newErrors.officeStartTime = "Please select start time";
    // if (!officeEndTime) newErrors.officeEndTime = "Please select end time";
    // else if (officeStartTime && officeEndTime && officeStartTime >= officeEndTime)
    //   newErrors.officeEndTime = "End time must be later than start time";

    // if (Object.keys(newErrors).length > 0) {
    //   setErrors(newErrors);
    //   setLoading(false);
    //   return;
    // }

    try {
      const jobData = {
        jobCategory,
        jobtitle,
        location,
        jobtype,
        noofyearsexperience,
        officetiming: `${officeStartTime} - ${officeEndTime}`,
        workingDays,
        noofvacancies,
        description,
        lastdatetoapply,
        published: isVisible,
      };

      let response = id
        ? await updateJob(id, jobData)
        : await createNewJob(jobData);

      if (response.status === 200 || response.status === 201) {
        showAlert("success", response.message || "Job saved successfully!");
        navigate("/jobs");
      } else if (response.missingFields) {
        const missing = {};
        response.missingFields.forEach((f) => (missing[f.name] = f.message));
        setErrors(missing);
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

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
              value={jobtitle}
              onChange={(e) => setJobTitle(e.target.value)}
              error={!!errors.jobtitle}
              helperText={errors.jobtitle}
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
              value={jobtype}
              onChange={(e) => setJobType(e.target.value)}
            >
              <MenuItem value="Full Time">Full Time</MenuItem>
              <MenuItem value="Part Time">Part Time</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          {/* Experience Dropdown */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Experience"
              fullWidth
              value={noofyearsexperience}
              onChange={(e) => setNoOfYearsExperience(e.target.value)}
              error={!!errors.noofyearsexperience}
              helperText={errors.noofyearsexperience}
            >
              <MenuItem value="Fresher">Fresher</MenuItem>
              <MenuItem value="1-2 years">1-2 Years</MenuItem>
              <MenuItem value="3-5 years">3-5 Years</MenuItem>
              <MenuItem value="5+ years">5+ Years</MenuItem>
            </TextField>
          </Grid>

          {/* Office Timing (Start–End) */}
          <Grid item xs={12}>
            <FormLabel component="legend" sx={{ mb: 1 }}>
              Office Timing
            </FormLabel>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Start Time"
                  type="time"
                  fullWidth
                  value={officeStartTime}
                  onChange={(e) => setOfficeStartTime(e.target.value)}
                  error={!!errors.officeStartTime}
                  helperText={errors.officeStartTime}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="End Time"
                  type="time"
                  fullWidth
                  value={officeEndTime}
                  onChange={(e) => setOfficeEndTime(e.target.value)}
                  error={!!errors.officeEndTime}
                  helperText={errors.officeEndTime}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                />
              </Grid>
            </Grid>
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
                    checked={workingDays[day.toLowerCase()]}
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

        {/* Vacancies and Last Date */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="No. of Vacancies"
              fullWidth
              value={noofvacancies}
              onChange={(e) => setNoOfVacancies(e.target.value)}
              error={!!errors.noofvacancies}
              helperText={errors.noofvacancies}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Date to Apply"
              type="date"
              fullWidth
              value={lastdatetoapply}
              onChange={(e) => setLastDateToApply(e.target.value)}
              error={!!errors.lastdatetoapply}
              helperText={errors.lastdatetoapply}
              InputLabelProps={{ shrink: true }}
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
  );
};

export default AddJobs;
