import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../Components/Alert/AlertContext";
import { fetchservicebyid } from "../../DAL/fetch";
import { createNewService } from "../../DAL/create";
import { updateService } from "../../DAL/edit";
import { FaCircleInfo } from "react-icons/fa6";
import { BsInfoCircle } from "react-icons/bs";
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
import { useTable1 } from "../../Components/Models/useTable1";
import { useTable3 } from "../../Components/Models/useTable3";
import InfoModal from "../../Components/Models/InfoModal";
import InfoImageModel from "../../Components/Models/InfoImageModal";
import UploadFile from "../../Components/Models/UploadFile";
import { useTable6 } from "../../Components/Models/useTable6";
import { useTable7 } from "../../Components/Models/useTable7";

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
  const [metaTitle, setMetaTitle] = useState("");
  const [description, setDescription] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [short_description, setShortDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [menuImage, setMenuImage] = useState(null);
  const [menuImagePreview, setMenuImagePreview] = useState(null);

  const [subServices, setSubServices] = useState({
    title: "",
    description: "",
    published: false,
    items: [],
  });
  // Nested states
  const [secondSection, setSecondSection] = useState({
    title: "",
    image: "",
    published: false,
  });
  const [whySteps, setWhySteps] = useState({
    title: "",
    description: "",
    image: "",
    published: false,
  });
  const [faqs, setFaqs] = useState({
    title: "",
    description: "",
    published: false,
  });

  const [imageSection, setImageSection] = useState({
    title: "",
    image: null,
    published: false,
  });

  const [firstSection, setFirstSection] = useState({
    title: "",
    description: "",
    image: null,
    published: false,
  });


  // Misc
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchService = async () => {
    if (!id) return;
    try {
      const response = await fetchservicebyid(id);
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
        setMenuImage(service.menuImg || "");
        setFaqs(service.faqs || {});
        setSecondSection(service.secondSection || {});
        setWhySteps(service.whySteps || {});
        setSubServices(service.subServices || {});
        setImageSection(service.imageSection || {});
        setFirstSection(service.firstSection || {});

        if (service.icon) setIconPreview(baseUrl + service.icon);
        if (service.menuImg) setMenuImagePreview(baseUrl + service.menuImg);
      }
    } catch (error) {
      console.error("Error fetching service:", error);
    }
  };

  // Keep the useEffect to auto-load
  useEffect(() => {
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
      formData.append("metatitle", metaTitle);
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
      // Menu Image
      if (menuImage) {
        formData.append("menuImg", menuImage);
      } else if (id && menuImagePreview) {
        formData.append("menuImg", menuImagePreview.replace(baseUrl, ""));
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
        "secondSection",
        JSON.stringify({
          title: secondSection.title,
          image: secondSection.image,
          published: secondSection.published,
        })
      );
      formData.append(
        "whySteps",
        JSON.stringify({
          title: whySteps.title,
          description: whySteps.description,
          image: whySteps.image,
          published: whySteps.published,
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
        "firstSection",
        JSON.stringify({
          title: firstSection.title,
          description: firstSection.description,
          image: firstSection.image,
          published: firstSection.published,
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
    reFetch: fetchService,
    tableType: "Sub Services",
    data: subServices?.items || [],
  });

  const attributes6 = [
    { id: "image", label: "Icon" },
    { id: "title", label: "Title" },
    { id: "description", label: "Description" },
  ];

  const { tableUI6 } = useTable6({
    attributes6,
    tableType: "Second Section",
    data: secondSection?.items || [],
  });
  const attributes7 = [
    { id: "stepTitle", label: "Step Title" },
    { id: "stepDescription", label: "Step Description" },
  ];

  const { tableUI7 } = useTable7({
    attributes7,
    tableType: "Why Steps",
    data: whySteps?.items || [],
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
              openinfobox(
                "Upload Service Icon"
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
        <Typography
          variant="h6"
          mt={1}
          sx={{ color: "var(--background-color)" }}
        >
          Service Menu Image{" "}
          <BsInfoCircle
            style={{ fontSize: "16px" }}
            onClick={() => {
              openinfobox(
                "Upload Service Menu Image"
                //  serviceiconimg
              );
            }}
          />
        </Typography>

        <UploadFile
          multiple={false}
          accept="image/*"
          initialFile={menuImagePreview || menuImage}
          error={errors.menuImg}
          onUploadComplete={(path) => setMenuImage(path)}
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
            {/* First Section */}
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
                Service First Section{" "}
                <BsInfoCircle
                  style={{ fontSize: "16px" }}
                  onClick={() => {
                    openinfobox("How We Delivered Section", imageSection);
                  }}
                />
              </Typography>
              <TextField
                fullWidth
                label="First Section Title"
                multiline
                rows={1}
                value={firstSection.title}
                onChange={(e) =>
                  setFirstSection({
                    ...firstSection,
                    title: e.target.value,
                  })
                }
                error={!!errors["firstSection.title"]}
                helperText={errors["firstSection.title"]}
              />
              <TextField
                fullWidth
                label="First Section description"
                multiline
                rows={6}
                value={firstSection.description}
                onChange={(e) =>
                  setFirstSection({
                    ...firstSection,
                    description: e.target.value,
                  })
                }
                error={!!errors["firstSection.description"]}
                helperText={errors["firstSection.description"]}
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
                error={errors["firstSection.image"]}
                initialFile={
                  firstSection.image ? baseUrl + firstSection.image : null
                }
                onUploadComplete={(path) =>
                  setFirstSection({ ...firstSection, image: path })
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={firstSection.published}
                    onChange={() =>
                      setFirstSection({
                        ...firstSection,
                        published: !firstSection.published,
                      })
                    }
                  />
                }
                label={firstSection.published ? "Published" : "Draft"}
              />
            </Box>
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
                    checked={subServices.published}
                    onChange={() =>
                      setSubServices({
                        ...subServices,
                        published: !subServices.published,
                      })
                    }
                  />
                }
                label={subServices.published ? "Published" : "Draft"}
              />

              {/* Sub Services Table */}
              {tableUI3}
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors["subServices.items"]}
              </p>
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
              {/* Second Section */}
              <Typography
                variant="h5"
                sx={{ color: "var(--background-color)" }}
              >
                Service Second Section{" "}
                <BsInfoCircle
                  style={{ fontSize: "16px" }}
                  onClick={() => {
                    openinfobox(
                      "FAQs Section"
                      //  faqssectionimg
                    );
                  }}
                />
              </Typography>
              <TextField
                fullWidth
                label="Second Section Title"
                value={secondSection.title}
                onChange={(e) =>
                  setSecondSection({ ...secondSection, title: e.target.value })
                }
                error={!!errors["secondSection.title"]}
                helperText={errors["secondSection.title"]}
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
                error={errors["secondSection.image"]}
                initialFile={
                  secondSection.image ? baseUrl + secondSection.image : null
                }
                onUploadComplete={(path) =>
                  setSecondSection({ ...secondSection, image: path })
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={secondSection.published}
                    onChange={() =>
                      setSecondSection({
                        ...secondSection,
                        published: !secondSection.published,
                      })
                    }
                  />
                }
                label={secondSection.published ? "Published" : "Draft"}
              />{" "}
              {tableUI6}
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors["secondSection.items"]}
              </p>
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
              {/* WHy Steps Section */}
              <Typography
                variant="h5"
                sx={{ color: "var(--background-color)" }}
              >
                Why Steps Section{" "}
                <BsInfoCircle
                  style={{ fontSize: "16px" }}
                  onClick={() => {
                    openinfobox(
                      "FAQs Section"
                      //  faqssectionimg
                    );
                  }}
                />
              </Typography>
              <TextField
                fullWidth
                label="Why Steps Title"
                value={whySteps.title}
                onChange={(e) =>
                  setWhySteps({ ...whySteps, title: e.target.value })
                }
                error={!!errors["whySteps.title"]}
                helperText={errors["whySteps.title"]}
              />
              <TextField
                fullWidth
                label="Why Steps Description"
                value={whySteps.description}
                onChange={(e) =>
                  setWhySteps({ ...whySteps, description: e.target.value })
                }
                error={!!errors["whySteps.description"]}
                helperText={errors["whySteps.description"]}
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
                error={errors["whySteps.image"]}
                initialFile={whySteps.image ? baseUrl + whySteps.image : null}
                onUploadComplete={(path) =>
                  setWhySteps({ ...whySteps, image: path })
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={whySteps.published}
                    onChange={() =>
                      setWhySteps({
                        ...whySteps,
                        published: !whySteps.published,
                      })
                    }
                  />
                }
                label={whySteps.published ? "Published" : "Draft"}
              />{" "}
              {tableUI7}
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors["whySteps.items"]}
              </p>
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
                error={errors["imageSection.image"]}
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
                    openinfobox(
                      "FAQs Section"
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
              />{" "}
              {tableUI1}
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors["faqs.items"]}
              </p>
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
              "&:hover": { opacity: "0.9" },
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
