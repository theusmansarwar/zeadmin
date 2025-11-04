import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Roles = () => {
  const attributes = [
   
    { id: "name", label: "Role" },
    { id: "published", label: "Visibility" },
    { id: "createdAt", label: "Created At" },
  ];

  
  const { tableUI } = useTable({  attributes, tableType: "Role" });

  return <>{tableUI}</>;
};

export default Roles;
