import { invokeApi } from "../Utils/InvokeApi";

export const deleteAllBlogs = async (data) => {
  const reqObj = {
    path: `/blog/deleteMultiple`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
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
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};

