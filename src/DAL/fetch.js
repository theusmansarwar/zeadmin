import { invokeApi } from "../Utils/InvokeApi";
export const fetchDashboard = async () => {
  const reqObj = {
    path: "/admin/stats",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    postData: {},
  };
  return invokeApi(reqObj);
};

export const fetchDashboardChart = async () => {
  const reqObj = {
    path: "/views/get/count",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    postData: {},
  };
  return invokeApi(reqObj);
};
export const fetchallLeads = async ( page, rowsPerPages,query) => {
  const reqObj = {
    path: `/LeadsList?limit=${rowsPerPages}&page=${page}&search=${query}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};

export const fetchcategorylist = async () => {
  const reqObj = {
    path: "/category/live",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    postData: {},
  };
  return invokeApi(reqObj);
};

export const fetchallcategorylist = async (page, rowsPerPages, query) => {
  const reqObj = {
    path: `/category/view?limit=${rowsPerPages}&page=${page}&search=${query}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};

export const fetchallservicescategorylist = async (page, rowsPerPages) => {
  const reqObj = {
    path: `/servicecategory/view?limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallserviceslist = async (page, rowsPerPages,query) => {
  const reqObj = {
    path: `/service/listbyadmin?limit=${rowsPerPages}&page=${page}&search=${query}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchservicebyid = async (id) => {
  const reqObj = {
    path: `/service/get/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchSubServiceById = async (id) => {
  const reqObj = {
    path: `/sub-service/get/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
//////////////////////////////////////////////
export const fetchallBloglist = async ( page, rowsPerPages, query) => {
  const reqObj = {
    path: `/blog/adminlist?limit=${rowsPerPages}&page=${page}&search=${query}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchFeaturedBloglist = async ( page, rowsPerPages, query) => {
  const reqObj = {
    path: `/blog/featuredadmin?limit=${rowsPerPages}&page=${page}&search=${query}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};

export const fetchallIndustrieslist = async ( page, rowsPerPages, query) => {
  const reqObj = {
    path: `/industry/view?limit=${rowsPerPages}&page=${page}&search=${query}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallJobslist = async ( page, rowsPerPages, query) => {
  const reqObj = {
    path: `/jobs/view?limit=${rowsPerPages}&page=${page}&search=${query}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallCaseStudieslist = async ( page, rowsPerPages, query) => {
  const reqObj = {
    path: `/casestudy/view?limit=${rowsPerPages}&page=${page}&search=${query}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchProductslist = async ( page, rowsPerPages, query) => {
  const reqObj = {
    path: `/product/view?limit=${rowsPerPages}&page=${page}&search=${query}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchProducts = async ( id) => {
  const reqObj = {
    path: `/product/get/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchcasestudy = async ( id) => {
  const reqObj = {
    path: `/casestudy/get/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchindustry = async ( id) => {
  const reqObj = {
    path: `/industry/get/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};

export const fetchBloglistofwritter = async ( page, rowsPerPages,name,title) => {
  const reqObj = {
    path: `/blog/writerlist?title=${title}&search=${name}&limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    body:{},
  };
  return invokeApi(reqObj);
};
export const fetchBlogById = async (id) => {
  const reqObj = {
    path: `/blog/viewbyid/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallCommentlist = async (page, rowsPerPages) => {
  const reqObj = {
    path: `/comment/view?limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallTestimonialslist = async (page, rowsPerPages) => {
  const reqObj = {
    path: `/testimonial/view?limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};

export const fetchTestimonialbyid = async (id) => {
  const reqObj = {
    path: `/testimonial/view/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchJobById = async (id) => {
  const reqObj = {
    path: `/jobs/get/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};


export const fetchallTeamCategories = async (page, rowsPerPages, query) => {
  const reqObj = {
    path: `/teamcategory/view?limit=${rowsPerPages}&page=${page}&search=${query}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};

export const fetchTeamCategoryList = async (id) => {
  const reqObj = {
    path: `/teamcategory/live`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchRoleList = async (id) => {
  const reqObj = {
    path: `/role/live`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallRoles = async (page, rowsPerPages,query) => {
  const reqObj = {
    path: `/role/view?limit=${rowsPerPages}&page=${page}&search=${query}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};

export const fetchTeamMember = async (page, rowsPerPages,query) => {
  const reqObj = {
    path: `/team/view?limit=${rowsPerPages}&page=${page}&search=${query}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchTeamMemberById = async (id) => {
  const reqObj = {
    path: `/team/view/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};

export const fetchallApplication = async ( page, rowsPerPages, query) => {
  const reqObj = {
    path: `/applications/view?limit=${rowsPerPages}&page=${page}&search=${query}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchSingleApplication = async (id) => {
  const reqObj = {
    path: `/applications/get/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallUserTypelist = async (id) => {
  const reqObj = {
    path: `/usertype/view`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallUserlist = async (page, rowsPerPages, query) => {
  const reqObj = {
    path: `/admin/users?limit=${rowsPerPages}&page=${page}&search=${query}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallUserbyid = async (id) => {
  const reqObj = {
    path: `/admin/users/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallUsertypeslist = async () => {
  const reqObj = {
    path: `/usertype/live`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};

