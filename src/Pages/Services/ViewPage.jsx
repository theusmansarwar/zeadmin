import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { fetchServicesbyid } from '../../DAL/fetch';
import { useTable2 } from '../../Components/Models/useTable2';
import { useTable3 } from '../../Components/Models/useTable3';
import { useTable4 } from '../../Components/Models/useTable4';
import { Box, Button, Typography } from '@mui/material';
import { baseUrl } from '../../Config/Config';
import { useTable5 } from '../../Components/Models/useTable5';

const ViewPage = () => {

    const [data,setData]=useState([])
    const navigate = useNavigate();
    const fetchData = async () => {
      try {
        const response = await fetchServicesbyid(id);
        setData(response.service)
      } catch (error) {
        console.error("Error fetching team member:", error);
      }
    };
const {id}=useParams();
      useEffect(() => {
        if (id) {
        
          fetchData();
        }
      }, [id]);
      const handleResponse =()=>{
        fetchData();
      }

      const attribute = [
   
        { id: "title", label: "Title" },
        { id: "description", label: "Description" },
        { id: "published", label: "Visibility" },
      ];
      const attribute2 = [
   
        { id: "name", label: "Title" },
        { id: "validity", label: "Validity" },
        { id: "price", label: "Price" },
        { id: "published", label: "Visibility" },
      ];
      const { tableUI2 } = useTable2({  attributes:attribute, tableType: "Services",ids:id, data: data?.subservices || [],onResponse: handleResponse});
      const { tableUI3 } = useTable3({  attributes:attribute, tableType: "Benefits" ,ids:id, data: data?.benefits || [],onResponse: handleResponse});
      const { tableUI4 } = useTable4({  attributes:attribute, tableType: "Process" ,ids:id, data: data?.process || [] ,onResponse: handleResponse});
      const { tableUI5 } = useTable5({  attributes:attribute2, tableType: "Pricing" ,ids:id, data: data?.pricing || [] ,onResponse: handleResponse});
       return (




    <div>
        
        <Typography id="modal-title" variant="h4" component="h2" sx={{color: "var(--primary-color)"}}>
         Service
        </Typography>
<div className='upper-section'>
<div className='left'>

        <Box sx={{ marginTop: "10px" }}>
          <Typography variant="body1"><strong style={{color: "var(--primary-color)"}}>Name:</strong> {data?.name || "N/A"}</Typography>
        </Box>
        <Box sx={{ marginTop: "10px" }}>
          <Typography variant="body1"><strong style={{color: "var(--primary-color)"}}>Description:</strong> {data?.introduction || "N/A"}</Typography>
        </Box>
        <Box sx={{ marginTop: "10px" }}>
          <Typography variant="body1"><strong style={{color: "var(--primary-color)"}}>Slug:</strong> {data?.slug || "N/A"}</Typography>
        </Box>
        <Box sx={{ marginTop: "10px" }}>
  <Typography variant="body1">
    <strong style={{ color: "var(--primary-color)" }}>Status:</strong>{" "}
    <span
      style={{
        color: data?.published ? "var(--success-color)" : "var(--warning-color)",
        background: data?.published ? "var(--success-bgcolor)" : "var(--warning-bgcolor)",
        padding: "5px",
        borderRadius: "var(--border-radius-secondary)",
      }}
    >
      {data?.published ? "Public" : "Private"}
    </span>
  </Typography>
</Box>

        <Button
                    sx={{
                      background: "var(--horizontal-gradient)",
                      color: "var(--white-color)",
                      borderRadius: "var(--border-radius-secondary)",
                      "&:hover": { background: "var(--vertical-gradient)" },
                      marginTop: "10px"
                    }}
                    onClick={() => {navigate(`/edit-service/${id}`)}}
                  >
                    Edit Service
                  </Button>
        </div>
        <div className="image-container">
            <img
              src={baseUrl+data.image}
              alt="Thumbnail"
            
            />
         
          </div> 
        </div>
       <hr/> 
        {tableUI2}
     <br/>
    {tableUI3}
    <br/>
    {tableUI4}
    <br/>
    {tableUI5}
    
    </div>
  )
}

export default ViewPage