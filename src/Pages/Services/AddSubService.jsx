import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../Components/Alert/AlertContext";
import { fetchSubServiceById } from "../../DAL/fetch";
import { createNewSubService } from "../../DAL/create";
import { updateSubService } from "../../DAL/edit";
import { FaCircleInfo } from "react-icons/fa6";
import { BsInfoCircle } from "react-icons/bs";
// import howwedelivered from "../../Assets/howwedelivered.png";
// import faqssectionimg from "../../Assets/Faqssection.png";
// import serviceiconimg from "../../Assets/serviceiconimg.png";
import {
  Box,
  Button,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { baseUrl } from "../../Config/Config";
import InfoModal from "../../Components/Models/InfoModal";
import InfoImageModel from "../../Components/Models/InfoImageModal";
import UploadFile from "../../Components/Models/UploadFile";
import { useTable4 } from "../../Components/Models/useTable4";
import { useTable5 } from "../../Components/Models/useTable5";

const AddSubService = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { serviceId, subServiceId } = useParams();

  const [open, setOpen] = useState(false);
  const [infoopen, setInfoOpen] = useState(false);
  const [infoboxheading, setInfoBoxHeading] = useState(false);
  const [infoboximage, setInfoBoxImage] = useState(false);

  // Service states
  const [title, setTitle] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [description, setDescription] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [short_description, setShortDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  // Separate state variables for each section
  const [introSection, setIntroSection] = useState({
    title: "",
    description: "",
    image: null,
    published: false,
  });

  const [whySection, setWhySection] = useState({
    title: "",
    description: "",
    published: false,
  });

  const [provenStepsSection, setProvenStepsSection] = useState({
    title: "",
    published: false,
  });

  const [imageSection, setImageSection] = useState({
    title: "",
    description: "",
    image: null,
    published: false,
  });

  const [faqs, setFaqs] = useState({
    title: "",
    description: "",
    published: false,
  });

  const [cta, setCta] = useState({
    title: "",
    description: "",
    image: null,
    published: false,
  });

 

  // Image preview states for each section
  const [introImagePreview, setIntroImagePreview] = useState(null);
  const [imageSectionPreview, setImageSectionPreview] = useState(null);
  const [ctaImagePreview, setCtaImagePreview] = useState(null);


  // Misc
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // --- Fetch existing service if editing ---
  useEffect(() => {
    if (!subServiceId) return;

    const fetchService = async () => {
      try {
        const response = await fetchSubServiceById(subServiceId);
        if (response.status === 200) {
          const service = response.service;
          setTitle(service.title || "");
          setMetaTitle(service.metatitle || "");
          setDescription(service.description || "");
          setMetaDescription(service.metaDescription || "");
          setSlug(service.slug || "");
          setShortDescription(service.short_description || "");
          setIsVisible(service.published || false);
          setIcon(service.icon || "");

          // Load Intro Section
          if (service.introduction) {
            setIntroSection(service.introduction);
            if (service.introduction.image) {
              setIntroImagePreview(baseUrl + service.introduction.image);
            }
          }

          // Load Why Zemalt Section
          if (service.whySection) {
            setWhySection(service.whySection);
          }

          // Load Proven Steps Section

          setProvenStepsSection(
            service.provenSteps || { title: "", published: false }
          );


          // Load Image Section
          if (service.imageSection) {
            setImageSection(service.imageSection);
            if (service.imageSection.image) {
              setImageSectionPreview(baseUrl + service.imageSection.image);
            }
          }

          // Load FAQs
          setFaqs(
            service.faqs || { title: "", description: "", published: false }
          );

          // Load CTA Section
          if (service.cta) {
            setCta(service.cta);
            if (service.cta.image) {
              setCtaImagePreview(baseUrl + service.cta.image);
            }
          }


         

          // Load icon preview
          if (service?.icon) {
            setIconPreview(baseUrl + service.icon);
          }
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    fetchService();
  }, [subServiceId]);

  // --- Submit handler ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("metatitle", metaTitle);
      formData.append("description", description);
      formData.append("short_description", short_description);
      formData.append("metaDescription", metaDescription);
      formData.append("slug", slug);
      formData.append("mainServiceId", serviceId);

      // Icon
      if (icon) {
        formData.append("icon", icon);
      } else if (subServiceId && iconPreview) {
        formData.append("icon", iconPreview.replace(baseUrl, ""));
      }
      formData.append("published", isVisible);

      // Intro Section
      formData.append(
        "introduction",
        JSON.stringify({
          title: introSection.title,
          description: introSection.description,
          image: introSection.image,
          published: introSection.published,
        })
      );

      // Why Zemalt Section
      formData.append(
        "whySection",
        JSON.stringify({
          title: whySection.title,
          description: whySection.description,
          published: whySection.published,
        })
      );

      // Proven Steps Section
      formData.append(
        "provenSteps",
        JSON.stringify({
          title: provenStepsSection.title,
          published: provenStepsSection.published,
        })
      );

      // Image Section
      formData.append(
        "imageSection",
        JSON.stringify({
          title: imageSection.title,
          description: imageSection.description,
          image: imageSection.image,
          published: imageSection.published,
        })
      );

      // FAQs
      formData.append(
        "faqs",
        JSON.stringify({
          title: faqs.title,
          description: faqs.description,
          published: faqs.published,
        })
      );

      // CTA Section
      formData.append(
        "cta",
        JSON.stringify({
          title: cta.title,
          description: cta.description,
          image: cta.image,
          published: cta.published,
        })
      );

     

      // API call
      let response = subServiceId
        ? await updateSubService(subServiceId, formData)
        : await createNewSubService(formData);

      if (response.status == 200 || response.status == 201) {
        showAlert("success", response.message);
        navigate(`/edit-service/${serviceId}`);
        setLoading(false);
      } else if (response.missingFields) {
        setLoading(false);
        const newErrors = {};
        response.missingFields.forEach((field) => {
          newErrors[field.name] = field.message;
        });
        setErrors(newErrors);
      } else {
        showAlert("error", response.message || "Something went wrong!");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showAlert("error", "Something went wrong!");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Table attributes
  const attributes1 = [
    { id: "question", label: "Questions" },
    { id: "answer", label: "Answers" },
  ];

  const { tableUI4 } = useTable4({
    attributes1,
    tableType: "FAQs",
    data: faqs?.items || [],
  });

 
  const attributes5 = [
    { id: "question", label: "Step Title" },
    { id: "answer", label: "Step Description" },
  ];

  const { tableUI5 } = useTable5({
    attributes5,
    tableType: "Proven Steps",
    data: provenStepsSection?.items || [],
  });

  const openinfobox = (heading, image) => {
    setInfoBoxImage(image);
    setInfoBoxHeading(heading);
    setInfoOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="filled"
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          display: "flex",
          justifySelf: "flex-end",
          backgroundColor: "var(--background-color)",
          color: "var(--text-color)",
          top: "20px",
          right: "20px",
          gap: "5px",
          zIndex: 10,
        }}
      >
        Guide <FaCircleInfo />
      </Button>

      <InfoModal open={open} onClose={() => setOpen(false)} />
      <InfoImageModel
        open={infoopen}
        onClose={() => setInfoOpen(false)}
        heading={infoboxheading}
        image={infoboximage}
      />
      <Typography
        variant="h4"
        sx={{ color: "var(--background-color)" }}
        gutterBottom
      >
        {subServiceId ? "Edit Sub Service" : "Add Sub Service"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "grid", gap: 2 }}
      >
        {/* Core fields */}
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
        />
        <TextField
          fullWidth
          label="Meta Title"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          error={!!errors.metatitle}
          helperText={errors.metatitle}
        />
        <TextField
          fullWidth
          label="Meta Description"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          error={!!errors.metaDescription}
          helperText={errors.metaDescription}
        />
        <TextField
          fullWidth
          label="Short Description"
          multiline
          rows={4}
          value={short_description}
          onChange={(e) => setShortDescription(e.target.value)}
          error={!!errors.short_description}
          helperText={errors.short_description}
        />

        <Typography
          variant="h6"
          mt={1}
          sx={{ color: "var(--background-color)" }}
        >
          Sub Service Icon{" "}
          <BsInfoCircle
            style={{ fontSize: "16px" }}
            onClick={() => {
              openinfobox("Upload Service Icon",
                //  serviceiconimg
                );
            }}
          />
        </Typography>
        <UploadFile
          multiple={false}
          accept="image/*"
          initialFile={icon}
          error={errors.icon}
          onUploadComplete={(path) => setIcon(path)}
        />

        <TextField
          fullWidth
          label="Description"
          multiline
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
        />
        <TextField
          fullWidth
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          error={!!errors.slug}
          helperText={errors.slug}
        />

        {subServiceId && (
          <>
            {/* Intro Section */}
            <Box
              sx={{
                borderRadius: "var(--default-border-radius)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                boxShadow: "2px 0px 10px var(--shadow-low1)",
                padding: "20px",
                height: "fit-content",
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: "var(--background-color)" }}
              >
                Intro Section{" "}
                <BsInfoCircle
                  style={{ fontSize: "16px" }}
                  onClick={() => {
                    openinfobox("How We Delivered Section", 
                      // howwedelivered
                    );
                  }}
                />
              </Typography>
              <TextField
                fullWidth
                label="Intro Section Title"
                multiline
                rows={1}
                value={introSection.title}
                onChange={(e) =>
                  setIntroSection({
                    ...introSection,
                    title: e.target.value,
                  })
                }
                error={!!errors["introduction.title"]}
                helperText={errors["introduction.title"]}
              />
              <TextField
                fullWidth
                label="Intro Section Description"
                multiline
                rows={4}
                value={introSection.description}
                onChange={(e) =>
                  setIntroSection({
                    ...introSection,
                    description: e.target.value,
                  })
                }
                error={!!errors["introduction.description"]}
                helperText={errors["introduction.description"]}
              />
              <Typography
                variant="h6"
                mt={1}
                sx={{ color: "var(--background-color)" }}
              >
                Upload Image
              </Typography>
              <UploadFile
                multiple={false}
                accept="image/*"
                initialFile={introSection.image}
                error={errors["introduction.image"]}
                onUploadComplete={(path) =>
                  setIntroSection({ ...introSection, image: path })
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={introSection.published}
                    onChange={() =>
                      setIntroSection({
                        ...introSection,
                        published: !introSection.published,
                      })
                    }
                  />
                }
                label={introSection.published ? "Published" : "Draft"}
              />
            </Box>

            {/* Why Zemalt Section */}
            <Box
              sx={{
                borderRadius: "var(--default-border-radius)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                boxShadow: "2px 0px 10px var(--shadow-low1)",
                padding: "20px",
                height: "fit-content",
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: "var(--background-color)" }}
              >
                Why Section{" "}
                <BsInfoCircle
                  style={{ fontSize: "16px" }}
                  onClick={() => {
                    openinfobox("How We Delivered Section", 
                      // howwedelivered
                    );
                  }}
                />
              </Typography>
              <TextField
                fullWidth
                label="Why Section Title"
                multiline
                rows={1}
                value={whySection.title}
                onChange={(e) =>
                  setWhySection({
                    ...whySection,
                    title: e.target.value,
                  })
                }
                error={!!errors["whySection.title"]}
                helperText={errors["whySection.title"]}
              />
              <TextField
                fullWidth
                label="Why Section Description"
                multiline
                rows={4}
                value={whySection.description}
                onChange={(e) =>
                  setWhySection({
                    ...whySection,
                    description: e.target.value,
                  })
                }
                error={!!errors["whySection.description"]}
                helperText={errors["whySection.description"]}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={whySection.published}
                    onChange={() =>
                      setWhySection({
                        ...whySection,
                        published: !whySection.published,
                      })
                    }
                  />
                }
                label={whySection.published ? "Published" : "Draft"}
              />
            </Box>

            {/* Proven Steps Section */}
            <Box
              sx={{
                borderRadius: "var(--default-border-radius)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                boxShadow: "2px 0px 10px var(--shadow-low1)",
                padding: "20px",
                height: "fit-content",
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: "var(--background-color)" }}
              >
                Proven Steps Section{" "}
                <BsInfoCircle
                  style={{ fontSize: "16px" }}
                  onClick={() => {
                    openinfobox("FAQs Section",
                      
                      // faqssectionimg
                    
                    );
                  }}
                />
              </Typography>
              <TextField
                fullWidth
                label="Proven Steps Title"
                value={provenStepsSection.title}
                onChange={(e) => setProvenStepsSection({ ...provenStepsSection, title: e.target.value })}
                error={!!errors["provenSteps.title"]}
                helperText={errors["provenSteps.title"]}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={provenStepsSection.published}
                    onChange={() =>
                      setProvenStepsSection({ ...provenStepsSection, published: !provenStepsSection.published })
                    }
                  />
                }
                label={provenStepsSection.published ? "Published" : "Draft"}
              />
              {tableUI5}
              <p style={{ color: "red", fontSize: "12px" }}>{errors["provenSteps.items"]}</p>
            </Box>


            {/* Image Section */}
            <Box
              sx={{
                borderRadius: "var(--default-border-radius)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                boxShadow: "2px 0px 10px var(--shadow-low1)",
                padding: "20px",
                height: "fit-content",
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: "var(--background-color)" }}
              >
                Image Section{" "}
                <BsInfoCircle
                  style={{ fontSize: "16px" }}
                  onClick={() => {
                    openinfobox("How We Delivered Section",
                      //  howwedelivered
                      );
                  }}
                />
              </Typography>
              <TextField
                fullWidth
                label="Image Section Title"
                multiline
                rows={1}
                value={imageSection.title}
                onChange={(e) =>
                  setImageSection({
                    ...imageSection,
                    title: e.target.value,
                  })
                }
                error={!!errors["imageSection.title"]}
                helperText={errors["imageSection.title"]}
              />
              <TextField
                fullWidth
                label="Image Section Description"
                multiline
                rows={4}
                value={imageSection.description}
                onChange={(e) =>
                  setImageSection({
                    ...imageSection,
                    description: e.target.value,
                  })
                }
                error={!!errors["imageSection.description"]}
                helperText={errors["imageSection.description"]}
              />
              <Typography
                variant="h6"
                mt={1}
                sx={{ color: "var(--background-color)" }}
              >
                Upload Image
              </Typography>
              <UploadFile
                multiple={false}
                accept="image/*"
                initialFile={imageSection.image}
                error={errors["imageSection.image"]}
                onUploadComplete={(path) =>
                  setImageSection({ ...imageSection, image: path })
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={imageSection.published}
                    onChange={() =>
                      setImageSection({
                        ...imageSection,
                        published: !imageSection.published,
                      })
                    }
                  />
                }
                label={imageSection.published ? "Published" : "Draft"}
              />
            </Box>

            {/* FAQs Section */}
            <Box
              sx={{
                borderRadius: "var(--default-border-radius)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                boxShadow: "2px 0px 10px var(--shadow-low1)",
                padding: "20px",
                height: "fit-content",
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: "var(--background-color)" }}
              >
                Service FAQs Section{" "}
                <BsInfoCircle
                  style={{ fontSize: "16px" }}
                  onClick={() => {
                    openinfobox("FAQs Section",
                      //  faqssectionimg
                      );
                  }}
                />
              </Typography>
              <TextField
                fullWidth
                label="FAQs Title"
                value={faqs.title}
                onChange={(e) => setFaqs({ ...faqs, title: e.target.value })}
                error={!!errors["faqs.title"]}
                helperText={errors["faqs.title"]}
              />
              <TextField
                fullWidth
                label="FAQs Description"
                multiline
                rows={6}
                value={faqs.description}
                onChange={(e) =>
                  setFaqs({ ...faqs, description: e.target.value })
                }
                error={!!errors["faqs.description"]}
                helperText={errors["faqs.description"]}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={faqs.published}
                    onChange={() =>
                      setFaqs({ ...faqs, published: !faqs.published })
                    }
                  />
                }
                label={faqs.published ? "Published" : "Draft"}
              />
              {tableUI4}
              <p style={{ color: "red", fontSize: "12px" }}>{errors["faqs.items"]}</p>
            </Box>

            {/* Cta Section */}
            <Box
              sx={{
                borderRadius: "var(--default-border-radius)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                boxShadow: "2px 0px 10px var(--shadow-low1)",
                padding: "20px",
                height: "fit-content",
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: "var(--background-color)" }}
              >
                CTA Section{" "}
                <BsInfoCircle
                  style={{ fontSize: "16px" }}
                  onClick={() => {
                    openinfobox("How We Delivered Section",
                      //  howwedelivered
                      );
                  }}
                />
              </Typography>
              <TextField
                fullWidth
                label="CTA Section Title"
                multiline
                rows={1}
                value={cta.title}
                onChange={(e) =>
                  setCta({
                    ...cta,
                    title: e.target.value,
                  })
                }
                error={!!errors["cta.title"]}
                helperText={errors["cta.title"]}
              />
              <TextField
                fullWidth
                label="CTA Section Description"
                multiline
                rows={2}
                value={cta.description}
                onChange={(e) =>
                  setCta({
                    ...cta,
                    description: e.target.value,
                  })
                }
                error={!!errors["cta.description"]}
                helperText={errors["cta.description"]}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={cta.published}
                    onChange={() =>
                      setCta({
                        ...cta,
                        published: !cta.published,
                      })
                    }
                  />
                }
                label={cta.published ? "Published" : "Draft"}
              />
            </Box>

           
          </>
        )}

        <FormControlLabel
          control={
            <Switch
              checked={isVisible}
              onChange={() => setIsVisible(!isVisible)}
              color="primary"
            />
          }
          label={isVisible ? "Public" : "Draft"}
        />

        {/* Buttons */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
        >
          <Button
            variant="contained"
            onClick={() => navigate(`/edit-service/${serviceId}`)}
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
              "&:hover": {opacity:"0.9"},
            }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddSubService;