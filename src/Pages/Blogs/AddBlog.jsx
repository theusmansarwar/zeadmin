import React, { useState, useEffect, useRef, useMemo } from "react";
import "./AddBlog.css";
import { IoMdCloseCircle } from "react-icons/io";
import JoditEditor from "jodit-react";
import dummyimg from "../../Assets/upload-background.PNG";


import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../Components/Alert/AlertContext";
import { fetchBlogById, fetchcategorylist } from "../../DAL/fetch";
import { updateBlog } from "../../DAL/edit";
import { createBlog } from "../../DAL/create";
import { baseUrl } from "../../Config/Config";


const AddBlog = () => {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [detail, setDetail] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(dummyimg);
  const [isVisible, setIsVisible] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const editor = useRef(null);

  const config = useMemo(() => ({
    readonly: false,
    uploader: { insertImageAsBase64URI: true },
    placeholder: "Start typing...",
  }), []);

  // 🔹 Fetch Blog Data if ID exists (Editing Mode)
  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const response = await fetchBlogById(id);
          if (response.status === 200) {
            const blog = response.blog;
            setTitle(blog.title || "");
            setDescription(blog.description || "");
            setDetail(blog.detail || "");
            setAuthor(blog.author || "");
            setTags(blog.tags || "");
            setMetaDescription(blog.metaDescription || "");
            setSlug(blog.slug || "");
            setCategoryId(blog.category_id || "");
            setImage(baseUrl+blog.thumbnail || dummyimg);
            setIsVisible(blog?.published );
          }
        } catch (error) {
          console.error("Error fetching blog:", error);
        }
      };
      fetchBlog();
    }
  }, [id]);

  // 🔹 Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchcategorylist();
        if (response && response.categories) {
          setCategories(response.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Handle File Upload
  const handleFileChange = (event) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setImage(URL.createObjectURL(file));
    }
  };

  // 🔹 Handle Submit (Create or Update)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("detail", detail);
    formData.append("author", author);
    formData.append("tags", tags);
    formData.append("metaDescription", metaDescription);
    formData.append("slug", slug);
    formData.append("category", categoryId);
    formData.append("published", isVisible);

    if (fileInputRef.current?.files[0]) {
      formData.append("thumbnail", fileInputRef.current.files[0]);
    }

    try {
      let response;
      if (id) {
        response = await updateBlog(id, formData); // Update if ID exists
      } else {
        response = await createBlog(formData); // Create if no ID
      }

      if (response.status == 201) {
        showAlert("success", response.message);
        navigate("/blogs");
      } 
      
      else if (response.status == 200) {
        showAlert("success", response.message);
        navigate("/blogs");
      } else {
        showAlert("error", response.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showAlert("error", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AddPost">
      <form onSubmit={handleSubmit}>
        <h3>{id ? "Edit Blog" : "Add Blog"}</h3>
        <div className="upper-section">
          <div className="left">
            <input type="text" name="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea name="description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <textarea name="metaDescription" placeholder="Meta Description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
          </div>
          <div className="image-container">
            <img src={image} alt="Thumbnail" onClick={() => fileInputRef.current?.click()} />
            <IoMdCloseCircle className="remove-icon" onClick={() => setImage(dummyimg)} />
            <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={handleFileChange} />
          </div>
        </div>

        <input type="text" name="slug" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
        <input type="text" name="author" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <input type="text" name="tags" placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        
        <JoditEditor ref={editor} value={detail} config={config} tabIndex={1} onChange={(newContent) => setDetail(newContent)} />

        <div className="toggle-container">
          <span className="toggle-label">Blog Visibility: <span className={isVisible ? "Public" : "Draft"}>{isVisible ? "Public" : "Draft"}</span></span>
          <label className="toggle-switch">
            <input type="checkbox" checked={isVisible} onChange={() => setIsVisible(!isVisible)} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="button-sections">
          <button type="button" className="cancelbtn" onClick={() => navigate('/blogs')}>Cancel</button>
          <button className="published" type="submit" disabled={loading}>
            {loading ? "Saving..." : id ? "Update Blog" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
