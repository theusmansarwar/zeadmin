import { invokeApi } from "../Utils/InvokeApi";

export const deleteAllBlogs = async (data) => {
  const reqObj = {
    path: `/blog/deleteMultiple`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllCategories = async (data) => {
  const reqObj = {
    path: `/category/delete`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllLeads = async (data) => {
  const reqObj = {
    path: `/leadsDelete`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllTestimonials = async (data) => {
  const reqObj = {
    path: `/testimonial/delete`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllTeamCategories = async (data) => {
  const reqObj = {
    path: `/teamcategory/delete`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllTeam = async (data) => {
  const reqObj = {
    path: `/team/delete`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllRole = async (data) => {
  const reqObj = {
    path: `/role/delete`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};


export const deleteAllComments = async (data) => {
  const reqObj = {
    path: `/comment/delete`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllServices = async (data) => {
  const reqObj = {
    path: `/service/delete`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllSubServices = async (id,data) => {
  const reqObj = {
    path: `/service/subdata/delete/${id}`,
    method: "DELETE", 
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllProcess = async (id,data) => {
  const reqObj = {
    path: `/service/process/delete/${id}`,
    method: "DELETE", 
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllBenifits = async (id,data) => {
  const reqObj = {
    path: `/service/benifit/delete/${id}`,
    method: "DELETE", 
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllPrice = async (data) => {
  const reqObj = {
    path: `/service/pricing/delete`,
    method: "DELETE", 
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};