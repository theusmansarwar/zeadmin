import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Portfolio = () => {
  const attributes = [
   
    { id: "title", label: "Title" },
    { id: "thumbnail", label: "Thumbnail" },
    { id: "published", label: "Visibility" },
    { id: "createdAt", label: "Created At" },
  ];

  
  const { tableUI } = useTable({  attributes, tableType: "Portfolio" });

  return <>{tableUI}</>;
};

export default Portfolio;
