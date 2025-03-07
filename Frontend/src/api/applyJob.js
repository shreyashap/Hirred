import axios from "axios";


export const applyToJob = async (data, jobId, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `http://localhost:3000/api/v1/job/apply-job/${jobId}`,
      data,
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

export const updateJobActiveStatus = async (data, jobId, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `http://localhost:3000/api/v1/job/update-active-status/${jobId}`,
      data,
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
export const updateJobStatus = async (
  data,
  jobId,
  applicationId,
  setLoading
) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `http://localhost:3000/api/v1/job/update-job-status?jobId=${jobId}&applicationId=${applicationId}`,
      data,
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

export const searchJob = async (search, score, setLoading, id) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `http://localhost:3000/api/v1/job/search-applications?search=${search}&id=${id}`,
      { score },
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
