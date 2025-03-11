import React, { useState, useEffect, useRef } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import dummyimg from "../../Assets/upload-background.PNG";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../Components/Alert/AlertContext";
import { fetchServicesbyid, fetchTeamMemberById } from "../../DAL/fetch";
import './AddServices.css'
import { baseUrl } from "../../Config/Config";
import { createService, createTeamMember } from "../../DAL/create";
import { updateService, updateTeamMember } from "../../DAL/edit";

const AddServices = () => {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  // State
  const [name, setName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [slug, setSlug] = useState("");
  const [published, setPublished] = useState(true);
  const [isPricing, setIsPricing] = useState(true);
  const [image, setImage] = useState(dummyimg);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch Data if Editing
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await fetchServicesbyid(id);
          if (response.service) {
            const service = response.service;
            setName(service.name || "");
            setIntroduction(service.introduction || "");
            setSlug(service.slug || "");
            setPublished(service.published);
            setIsPricing(service.isPricing);
            setImage(service.image ? baseUrl + service.image : dummyimg);
          }
        } catch (error) {
          console.error("Error fetching team member:", error);
        }
      };
      fetchData();
    }
  }, [id]);

  const handleFileChange = (event) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append("name", name);
    formData.append("introduction", introduction);
    formData.append("slug", slug);
    formData.append("published", published ? "true" : "false");
    formData.append("isPricing", isPricing ? "true" : "false");

    if (fileInputRef.current?.files[0]) {
      formData.append("image", fileInputRef.current.files[0]); // Append actual file
    }

    let response;
    if (id) {
      response = await updateService(id, formData);
    } else {
      response = await createService(formData);
    }

    // Handle Response
    if (response.status === 201 || response.status === 200) {
      showAlert("success", response.message);
      navigate("/services");
    } else if (response.status === 400 && response.missingFields) {
      const newErrors = {};
      response.missingFields.forEach((field) => {
        newErrors[field.name] = field.message;
      });
      setErrors(newErrors);
      showAlert("error", "Please fill all required fields.");
    }
    setLoading(false);
  };

  return (
    <div className="AddServices">
      <form onSubmit={handleSubmit}>
        <h3>{id ? "Edit Service" : "Add Service"}</h3>

          <div className="upper-section">
                 <div className="left">
                   {errors.name && <p className="error">{errors.name}</p>}
                   <input
                     type="text"
                     name="name"
                     placeholder="Name"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                   />
                   {errors.introduction && (
                     <p className="error">{errors.introduction}</p>
                   )}
                   <textarea
                     name="introduction"
                     placeholder="introduction"
                     value={introduction}
                     onChange={(e) => setIntroduction(e.target.value)}
                   />
                   {errors.slug && (
                     <p className="error">{errors.slug}</p>
                   )}
                   <textarea
                     name="slug"
                     placeholder="Slug"
                     value={slug}
                     onChange={(e) => setSlug(e.target.value)}
                   />
                 </div>
                 <div className="image-container" style={{ border: errors.image ? "2px solid red" : "" }}>
                   <img
                     src={image}
                     alt="Thumbnail"
                     onClick={() => fileInputRef.current?.click()}
                   />
                   <IoMdCloseCircle
                     className="remove-icon"
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
               </div>
   
        <div className="toggle-container">
          <span>Visibility: <strong>{published ? "Public" : "Draft"}</strong></span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={published}
              onChange={() => setPublished(!published)}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="toggle-container">
          <span>Pricing Available?: <strong>{published ? "Yes" : "No"}</strong></span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isPricing}
              onChange={() => setIsPricing(!isPricing)}
            />
            <span className="slider"></span>
          </label>
        </div>


        <div className="button-sections">
          <button type="button" className="cancelbtn" onClick={() => navigate("/teams")}>
            Cancel
          </button>
          <button className="published" type="submit" disabled={loading}>
            {loading ? "Saving..." : id ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddServices;
