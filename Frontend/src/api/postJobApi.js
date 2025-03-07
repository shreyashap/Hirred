import axios from "axios";
import { baseUrl } from "./applyJob";

export const postJob = async (data, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.post(`${baseUrl}/api/v1/job/post-job`, data, {
      withCredentials: true,
    });
    return { data: response.data, error: null };
  } catch (error) {
    const errMsg = error?.response || "An error occured";
    return { data: null, error: errMsg };
  } finally {
    setLoading(false);
  }
};

export const getAllJobs = async (pageNo, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.get(
      `${baseUrl}/api/v1/job/jobs?page=${pageNo}`,
      {
        withCredentials: true,
      }
    );
    return { data: response.data, error: null };
  } catch (error) {
    const errMsg = error?.response || "An error occured";
    return { data: null, error: errMsg };
  } finally {
    setLoading(false);
  }
};

export const getSingleJob = async (jobId, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.get(`${baseUrl}/api/v1/job/get-job/${jobId}`, {
      withCredentials: true,
    });
    return { data: response.data, error: null };
  } catch (error) {
    const errMsg = error?.response || "An error occured";
    return { data: null, error: errMsg };
  } finally {
    setLoading(false);
  }
};

export const getJobByCompany = async (companyId, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.get(
      `${baseUrl}/api/v1/job/get-job-company/${companyId}`,
      {
        withCredentials: true,
      }
    );
    return { data: response.data, error: null };
  } catch (error) {
    const errMsg = error?.response || "An error occured";
    return { data: null, error: errMsg };
  } finally {
    setLoading(false);
  }
};

export const getJobApplications = async (jobId, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.get(
      `${baseUrl}/api/v1/job/get-applicants/${jobId}`,
      {
        withCredentials: true,
      }
    );
    return { data: response.data, error: null };
  } catch (error) {
    const errMsg = error?.response || "An error occured";
    return { data: null, error: errMsg };
  } finally {
    setLoading(false);
  }
};

export const getMyApplications = async (setLoading) => {
  try {
    setLoading(true);
    const response = await axios.get(`${baseUrl}/api/v1/job/my-applications`, {
      withCredentials: true,
    });
    return { data: response.data, error: null };
  } catch (error) {
    const errMsg = error?.response || "An error occured";
    return { data: null, error: errMsg };
  } finally {
    setLoading(false);
  }
};

export const deleteJob = async (jobId, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `${baseUrl}/api/v1/job/delete-job/${jobId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return { data: response.data, error: null };
  } catch (error) {
    const errMsg = error?.response || "An error occured";
    return { data: null, error: errMsg };
  } finally {
    setLoading(false);
  }
};
