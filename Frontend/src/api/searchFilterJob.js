import axios from "axios";
import { baseUrl } from "./applyJob";

export const searchJobs = async (searchQuery, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.get(
      `${baseUrl}/api/v1/job/search-jobs?search=${searchQuery}`,
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

export const filterJobs = async (
  location,
  company,
  employment,
  job,
  setLoading
) => {
  try {
    setLoading(true);
    const response = await axios.get(
      `${baseUrl}/api/v1/job/filter-jobs?location=${location}&company=${company}&employment=${employment}&job=${job}`,
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

export const saveUnsaveJobs = async (jobId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/v1/job/save-unsave-job/${jobId}`,
      {
        withCredentials: true,
      }
    );
    return { data: response.data, error: null };
  } catch (error) {
    const errMsg = error?.response || "An error occured";
    return { data: null, error: errMsg };
  }
};

export const getSavedJobs = async (setLoading) => {
  try {
    setLoading(true);
    const response = await axios.get(`${baseUrl}/api/v1/job/saved-jobs`, {
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
