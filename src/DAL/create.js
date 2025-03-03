import { invokeApi } from "../Utils/InvokeApi";
export const createBlog = async (data) => {
  console.log(...data, "djskfhjksdfks");
  const reqObj = {
    path: "/blog/create",
    method: "POST",
    headers: {
   'Content-Type': 'multipart/form-data'
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createnewCategory = async (data) => {

  const reqObj = {
    path: "/category/add",
    method: "POST",
    headers: {
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createnewTeamCategory = async (data) => {

  const reqObj = {
    path: "/teamcategory/add",
    method: "POST",
    headers: {
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createTeamMember = async (data) => {

  const reqObj = {
    path: "/team/add",
    method: "POST",
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    postData: data,
  };
  return invokeApi(reqObj);
};

export const createnewRole = async (data) => {

  const reqObj = {
    path: "/role/add",
    method: "POST",
    headers: {
     
    },
    postData: data,
  };
  return invokeApi(reqObj);
};


export const createSyllabus = async (data) => {
  console.log(...data, "djskfhjksdfks");
  const reqObj = {
    path: "/api/syllabus/create",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
      "Content-Type": "multipart/form-data",
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const enrollUser = async (data) => {
  console.log(...data, "djskfhjksdfks");
  const reqObj = {
    path: "/api/admin/enrolluser",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
      "Content-Type": "multipart/form-data",
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
