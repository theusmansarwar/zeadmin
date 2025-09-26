import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Industries = () => {
  const attributes = [
    { id: "name", label: "Name" },
    { id: "description", label: "Description" },
    { id: "image", label: "Image" },
    { id: "published", label: "Visibility" },
    { id: "createdAt", label: "Created At" },
  ];

  const { tableUI } = useTable({ attributes, tableType: "Industries" });

  return <>{tableUI}</>;
};

export default Industries;
