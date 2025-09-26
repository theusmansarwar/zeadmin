import React from "react";
import { useTable } from "../../Components/Models/useTable";

const CaseStudies = () => {
  const attributes = [
    { id: "name", label: "Name" },
    { id: "description", label: "Description" },
    { id: "image", label: "Image" },
    { id: "published", label: "Visibility" },
    { id: "createdAt", label: "Created At" },
  ];

  const { tableUI } = useTable({ attributes, tableType: "CaseStudies" });

  return <>{tableUI}</>;
};

export default CaseStudies;
