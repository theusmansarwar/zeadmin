
import { useTable } from "../../Components/Models/useTable";

const Job = () => {
  const attributes = [
   
    { id: "jobtitle", label: "Job Title" },
    { id: "jobCategory", label: "Job Category" },
    { id: "published", label: "Visibility" },
    { id: "createdAt", label: "Created At" },
  ];

 

  const { tableUI } = useTable({  attributes, tableType: "Job" });

  return <>{tableUI}</>;
};

export default Job;
