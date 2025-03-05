import axios from "axios";

export const registerCompany = async (data, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.post(
      "http://localhost:3000/api/v1/company/register-company",
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

export const updateCompanyDetails = async (id, data, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `http://localhost:3000/api/v1/company/update-company-details/${id}`,
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

export const getAllCompanies = async (setLoading) => {
  try {
    setLoading(true);
    const response = await axios.get(
      "http://localhost:3000/api/v1/company/get-companies",
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

export const getCompanyNames = async (setLoading) => {
  try {
    setLoading(true);
    const response = await axios.get(
      "http://localhost:3000/api/v1/company/get-companyNames",
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
export const getAllCompanyNames = async (setLoading) => {
  try {
    setLoading(true);
    const response = await axios.get(
      "http://localhost:3000/api/v1/company/get-all-companies",
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

export const deleteCompany = async (companyId, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `http://localhost:3000/api/v1/company/delete-company/${companyId}`,
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
