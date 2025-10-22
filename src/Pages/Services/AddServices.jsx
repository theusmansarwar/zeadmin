import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../Components/Alert/AlertContext";
import { fetchservicebyid } from "../../DAL/fetch";
import { createNewService } from "../../DAL/create";
import { updateService } from "../../DAL/edit";
import { FaCircleInfo } from "react-icons/fa6";
import { BsInfoCircle } from "react-icons/bs";
import faqssectionimg from "../../Assets/Faqssection.png";
import serviceiconimg from "../../Assets/serviceiconimg.png";
import {
  Box,
  Button,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { baseUrl } from "../../Config/Config";
import { useTable1 } from "../../Components/Models/useTable1";
import { useTable3 } from "../../Components/Models/useTable3";
import InfoModal from "../../Components/Models/InfoModal";
import InfoImageModel from "../../Components/Models/InfoImageModal";
import UploadFile from "../../Components/Models/UploadFile";

const AddServices = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [infoopen, setInfoOpen] = useState(false);
  const [infoboxheading, setInfoBoxHeading] = useState(false);
  const [infoboximage, setInfoBoxImage] = useState(false);
  // Service states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [short_description, setShortDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  const [subServices, setSubServices] = useState({
    title: "",
    description: "",
    published: false,
    items: [],
  });
  // Nested states
  const [faqs, setFaqs] = useState({
    title: "",
    description: "",
    published: false,
  });
  const [portfolio, setPortfolio] = useState({
    published: false,
  });
  const [imageSection, setImageSection] = useState({
    title: "",
    image: null,
    published: false,
  });

  const [lastSection, setLastSection] = useState({
    title: "",
    description: "",
    image: null,
    published: false,
  });

  // Upload states
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Misc
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // --- Fetch existing service if editing ---
  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        const response = await fetchservicebyid(id);
        if (response.status === 200) {
          const service = response.service;

          setTitle(service.title || "");
          setDescription(service.description || "");
          setMetaDescription(service.metaDescription || "");
          setSlug(service.slug || "");
          setShortDescription(service.short_description || "");
          setIsVisible(service.published || false);
          setIcon(service.icon || "");

          // ✅ FAQs
          if (service.faqs) {
            setFaqs({
              title: service.faqs.title || "",
              description: service.faqs.description || "",
              published: service.faqs.published || false,
            });
          }

          // ✅ Sub Services (capital S)
          if (service.subServices) {
            setSubServices({
              title: service.subServices.title || "",
              description: service.subServices.description || "",
              published: service.subServices.published || false,
              items: service.subServices.items || [],
            });
          }

          // ✅ Image Section
          if (service.imageSection) {
            setImageSection({
              title: service.imageSection.title || "",
              image: service.imageSection.image || null,
              published: service.imageSection.published || false,
            });
          }

          // ✅ Last Section (capital S)
          if (service.lastSection) {
            setLastSection({
              title: service.lastSection.title || "",
              description: service.lastSection.description || "",
              image: service.lastSection.image || null,
              published: service.lastSection.published || false,
            });
          }

          // ✅ Icon Preview
          if (service.icon) {
            setIconPreview(baseUrl + service.icon);
          }
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    fetchService();
  }, [id]);

  // --- Submit handler ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("short_description", short_description);
      formData.append("metaDescription", metaDescription);
      formData.append("slug", slug);
      // Icon
      if (icon) {
        // new uploaded icon (backend returned path in uploadimage)
        formData.append("icon", icon);
      } else if (id && iconPreview) {
        // keep existing icon path
        formData.append("icon", iconPreview.replace(baseUrl, ""));
      }

      formData.append("published", isVisible);
      formData.append(
        "subServices",
        JSON.stringify({
          title: subServices.title,
          description: subServices.description,
          published: subServices.published,
          items: subServices.items,
        })
      );

      formData.append(
        "faqs",
        JSON.stringify({
          title: faqs.title,
          description: faqs.description,
          published: faqs.published,
        })
      );

      formData.append(
        "imageSection",
        JSON.stringify({
          title: imageSection.title,
          image: imageSection.image,
          published: imageSection.published,
        })
      );

      formData.append(
        "lastSection",
        JSON.stringify({
          title: lastSection.title,
          description: lastSection.description,
          image: lastSection.image,
          published: lastSection.published,
        })
      );

      // API call
      let response = id
        ? await updateService(id, formData)
        : await createNewService(formData);

      if (response.status == 200 || response.status == 201) {
        showAlert("success", response.message);
        navigate("/services");
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

  const { tableUI1 } = useTable1({
    attributes1,
    tableType: "FAQs",
    data: faqs?.items || [],
  });

  const attributes3 = [
    { id: "title", label: "Sub Service Title" },
    { id: "description", label: "Description" },
    { id: "published", label: "Visibility" },
  ];

  const { tableUI3 } = useTable3({
    attributes3,
    tableType: "Sub Services",
    data: subServices?.items || [],
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
        {id ? "Edit Service" : "Add Service"}
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
          rows={2}
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
          Service Icon{" "}
          <BsInfoCircle
            style={{ fontSize: "16px" }}
            onClick={() => {
              openinfobox("Upload Service Icon", serviceiconimg);
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

        {id && (
          <>
            {/* Sub Services Section */}
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
                Sub Services Section{" "}
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={portfolio.published}
                    onChange={() =>
                      setPortfolio({
                        ...portfolio,
                        published: !portfolio.published,
                      })
                    }
                  />
                }
                label={portfolio.published ? "Published" : "Draft"}
              />

              {/* Sub Services Table */}
              {tableUI3}
            </Box>

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
                    openinfobox("Image Section", imageSection);
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
                initialFile={
                  imageSection.image ? baseUrl + imageSection.image : null
                }
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
              {/* FAQs */}
              <Typography
                variant="h5"
                sx={{ color: "var(--background-color)" }}
              >
                Service FAQs Section{" "}
                <BsInfoCircle
                  style={{ fontSize: "16px" }}
                  onClick={() => {
                    openinfobox("FAQs Section", faqssectionimg);
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
              />{" "}
              {tableUI1}
            </Box>
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
                Service Last Section{" "}
                <BsInfoCircle
                  style={{ fontSize: "16px" }}
                  onClick={() => {
                    openinfobox("How We Delivered Section", imageSection);
                  }}
                />
              </Typography>
              <TextField
                fullWidth
                label="Last Section Title"
                multiline
                rows={1}
                value={lastSection.title}
                onChange={(e) =>
                  setLastSection({
                    ...lastSection,
                    title: e.target.value,
                  })
                }
                error={!!errors["lastsection.title"]}
                helperText={errors["lastsection.title"]}
              />
              <TextField
                fullWidth
                label="Last Section description"
                multiline
                rows={6}
                value={lastSection.description}
                onChange={(e) =>
                  setLastSection({
                    ...lastSection,
                    description: e.target.value,
                  })
                }
                error={!!errors["lastsection.description"]}
                helperText={errors["lastsection.description"]}
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
                initialFile={
                  lastSection.image ? baseUrl + lastSection.image : null
                }
                onUploadComplete={(path) =>
                  setLastSection({ ...lastSection, image: path })
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={lastSection.published}
                    onChange={() =>
                      setLastSection({
                        ...lastSection,
                        published: !lastSection.published,
                      })
                    }
                  />
                }
                label={lastSection.published ? "Published" : "Draft"}
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
            onClick={() => navigate("/services")}
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
              "&:hover": { background: "var(--primary-hover)" },
            }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddServices;
