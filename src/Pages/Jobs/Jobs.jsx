
import { useTable } from "../../Components/Models/useTable";

const Job = () => {
  const attributes = [
   
    { id: "title", label: "Job Title" },
    { id: "published", label: "Visibility" },
    { id: "createdAt", label: "Created At" },
  ];

 

  const { tableUI } = useTable({  attributes, tableType: "Job" });

  return <>{tableUI}</>;
};

export default Job;
