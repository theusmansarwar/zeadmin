import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Blogs = () => {
  const attributes = [
   
    { id: "thumbnail", label: "Thumbnail" },
    { id: "title", label: "Blog Title" },
    { id: "category.name", label: "Category" },
    { id: "published", label: "Visibility" },
    { id: "views", label: "Views" },
    { id: "createdAt", label: "Created At" },
    { id: "publishedDate", label: "Published Date" },
  ];

 

  const { tableUI } = useTable({  attributes, tableType: "Blogs" });

  return <>{tableUI}</>;
};

export default Blogs;
