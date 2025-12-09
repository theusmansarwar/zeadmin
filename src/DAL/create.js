import { invokeApi } from "../Utils/InvokeApi";

export const createBlog = async (data) => {
  console.log(...data, "djskfhjksdfks");
  const reqObj = {
    path: "/blog/create",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createNewProvenStep = async (data) => {
  const reqObj = {
    path: "/provenSteps/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createNewWhyStep = async (data) => {
  const reqObj = {
    path: "/whySteps/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createNewSecond = async (data) => {
  const reqObj = {
    path: "/second/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createNewFaq = async (data) => {
  const reqObj = {
    path: "/faqs/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createNewSubFaq = async (data) => {
  const reqObj = {
    path: "/faqs/add-sub",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createnewuser = async (data) => {
  const reqObj = {
    path: "/admin/register",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createIndustries = async (data) => {
  const reqObj = {
    path: "/industry/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createProducts = async (data) => {
  const reqObj = {
    path: "/product/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createCaseStudy = async (data) => {
  const reqObj = {
    path: "/casestudy/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
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
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
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
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};

export const uploadimage = async (data) => {
  const reqObj = {
    path: "/upload-image",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createNewWhyService = async (data) => {
  const reqObj = {
    path: "/WhyService/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
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
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
//////////////////////
export const createnewServicesCategory = async (data) => {
  const reqObj = {
    path: "/servicecategory/add",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    postData: data,
  };
  return invokeApi(reqObj);
};
/////////////////////
export const createNewService = async (data) => {
  const reqObj = {
    path: "/service/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    postData: data,
  };
  return invokeApi(reqObj);
};
export const createNewSubService = async (data) => {
  const reqObj = {
    path: "/sub-service/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    postData: data,
  };
  return invokeApi(reqObj);
};
export const createNewPortfolio = async (data) => {
  const reqObj = {
    path: "/portfolio/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    postData: data,
  };
  return invokeApi(reqObj);
};
export const createNewHowwedo = async (data) => {
  const reqObj = {
    path: "/howwedo/create",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    postData: data,
  };
  return invokeApi(reqObj);
};

export const createTestimonial = async (data) => {
  const reqObj = {
    path: "/testimonial/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createnewusertype = async (data) => {
  const reqObj = {
    path: "/usertype/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
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
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};

export const createSubServices = async (data) => {
  const reqObj = {
    path: "/service/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    postData: data,
  };
  return invokeApi(reqObj);
};
export const createNewJob = async (data) => {
  const reqObj = {
    path: "/jobs/add",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    postData: data,
  };
  return invokeApi(reqObj);
};