import { invokeApi } from "../Utils/InvokeApi";
export const updateBlog = async ( id,data) => {

  const reqObj = {
    path: `/blog/update/${id}`,
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    postData: data,
  };
  return invokeApi(reqObj);
};

export const updateCategory = async (id,data) => {
 
  const reqObj = {
    path: `/category/update/${id}`,
    method: "PUT",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};
export const updateComment = async (data) => {
 
  const reqObj = {
    path: `/comment/approve`,
    method: "PUT",
    headers: {},
    postData: data,
  };
  return invokeApi(reqObj);
};