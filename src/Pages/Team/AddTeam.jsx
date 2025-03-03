import React, { useState, useEffect, useRef } from "react";
import "./AddTeam.css";
import { IoMdCloseCircle } from "react-icons/io";
import dummyimg from "../../Assets/upload-background.PNG";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../Components/Alert/AlertContext";
import { fetchTeamMemberById, fetchTeamCategoryList, fetchRoleList } from "../../DAL/fetch";
import { updateTeamMember } from "../../DAL/edit";
import { createTeamMember } from "../../DAL/create";
import { baseUrl } from "../../Config/Config";

const AddTeam = () => {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [roleId, setRoleId] = useState(""); // Add this to state
const [roles, setRoles] = useState([]);
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    instagram: "",
    facebook: "",
  });
  const [image, setImage] = useState(dummyimg);
  const [isVisible, setIsVisible] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  // Fetch Team Member if ID exists (Edit Mode)
  useEffect(() => {
    if (id) {
      const fetchTeamMember = async () => {
        try {
          const response = await fetchTeamMemberById(id);
        
            const member = response.member;
            setName(member.name || "");
            setRoleId(member.role?._id || "");
            setDescription(member.description || "");
            setCategoryId(member.category?._id || "");
            setSocialLinks(member.socialLinks || {});
            setImage(member.image ? baseUrl + member.image : dummyimg);
            setIsVisible(member.published);
       
        } catch (error) {
          console.error("Error fetching team member:", error);
        }
      };
      fetchTeamMember();
    }
  }, [id]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchTeamCategoryList();
        if (response && response.categories) {
          setCategories(response.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetchRoleList(); // You need to create this API call in DAL
        if (response && response.roles) {
          setRoles(response.roles);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);
  // Handle File Upload
  const handleFileChange = (event) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setImage(URL.createObjectURL(file));
    }
  };

  // Handle Submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});
    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", roleId);
    formData.append("description", description);
    formData.append("category", categoryId);
    formData.append("published", isVisible);

    formData.append("socialLinks", JSON.stringify(socialLinks));

    if (fileInputRef.current?.files[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

      let response;
      if (id) {
        response = await updateTeamMember(id, formData); // Update if ID exists
      } else {
        response = await createTeamMember(formData); // Create if no ID
      }

      if (response.status == 201) {
        showAlert("success", response.message);
        navigate("/teams");
      } else if (response.status == 200) {
        showAlert("success", response.message);
        navigate("/teams");
      }
      else if (response.status === 400 && response.missingFields) {
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
    <div className="AddTeam">
      <form onSubmit={handleSubmit}>
        <h3>{id ? "Edit Team Member" : "Add Team Member"}</h3>


        <div className="upper-section2">
        <div className="left">
        {errors.name && <p className="error">{errors.name}</p>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.role && <p className="error">{errors.role}</p>}
          <select
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
        >
          <option value="">Select a role</option>
          {roles.map((role) => (
            <option key={role._id} value={role._id}>
              {role.name}
            </option>
          ))}
        </select>
        {errors.category && <p className="error">{errors.category}</p>}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      
       
       

        {/* Social Links */}
        <input
          type="text"
          name="linkedin"
          placeholder="LinkedIn"
          value={socialLinks.linkedin}
          onChange={(e) =>
            setSocialLinks({ ...socialLinks, linkedin: e.target.value })
          }
        />
        <input
          type="text"
          name="instagram"
          placeholder="Instagram"
          value={socialLinks.instagram}
          onChange={(e) =>
            setSocialLinks({ ...socialLinks, instagram: e.target.value })
          }
        />
        <input
          type="text"
          name="facebook"
          placeholder="Facebook"
          value={socialLinks.facebook}
          onChange={(e) =>
            setSocialLinks({ ...socialLinks, facebook: e.target.value })
          }
        />
 </div>
        <div className="image-container2" style={{ border: errors.image ? "2px solid red" : "" }}>
                    <img src={image} alt="image" onClick={() => fileInputRef.current?.click()} />
                    <IoMdCloseCircle className="remove-icon" onClick={() => setImage(dummyimg)} />
                    <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={handleFileChange} />
                  </div>
        </div>
        {/* Image Upload */}
      

        {/* Visibility Toggle */}
        <div className="toggle-container">
          <span>
            Visibility: <strong>{isVisible ? "Public" : "Draft"}</strong>
          </span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={() => setIsVisible(!isVisible)}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Buttons */}
        <div className="button-sections">
          <button
            type="button"
            className="cancelbtn"
            onClick={() => navigate("/teams")}
          >
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

export default AddTeam;
