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