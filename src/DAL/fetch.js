import { invokeApi } from "../Utils/InvokeApi";

export const fetchcategorylist = async () => {
  const reqObj = {
    path: "/category/live",
    method: "GET",
    headers: {

    },

    postData: {},
  };
  return invokeApi(reqObj);
};
export const fetchallcategorylist = async (page, rowsPerPages) => {
  const reqObj = {
    path: `/category/view?limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallBloglist = async ( page, rowsPerPages) => {
  const reqObj = {
    path: `/blog/adminlist?limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchBlogById = async (id) => {
  const reqObj = {
    path: `/blog/viewbyid/${id}`,
    method: "GET",
    headers: {
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
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallLeads = async ( page, rowsPerPages) => {
  const reqObj = {
    path: `/LeadsList?limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchSingleLeads = async (id) => {
  const reqObj = {
    path: `/Lead/${id}`,
    method: "GET",
    headers: {
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallTeamCategories = async (id) => {
  const reqObj = {
    path: `/teamcategory/view`,
    method: "GET",
    headers: {
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
    },

    body: {},
  };
  return invokeApi(reqObj);
};

export const fetchallRoles = async (page, rowsPerPages) => {
  const reqObj = {
    path: `/role/view?limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
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
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchTeamMember = async (page, rowsPerPages) => {
  const reqObj = {
    path: `/team/view?limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
    },

    body: {},
  };
  return invokeApi(reqObj);
};