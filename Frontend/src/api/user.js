import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1/user",
});

export const registerUser = async (accountType, data, setLoading) => {
  try {
    if (setLoading) setLoading(true);

    const response = await axios.post(
      `http://localhost:3000/api/v1/user/register?accountType=${accountType}`,
      data
    );

    return { data: response.data, error: null };
  } catch (error) {
    const errMsg = error?.response.data.error || "An error occured";
    return { data: null, error: errMsg };
  } finally {
    if (setLoading) setLoading(false);
  }
};

export const login = async (data, setLoading) => {
  try {
    if (setLoading) setLoading(true);

    const response = await axios.post(
      "http://localhost:3000/api/v1/user/login",
      data,
      {
        withCredentials: true,
      }
    );

    return { data: response.data, error: null };
  } catch (error) {
    const errMsg = error?.response.data.error || "An error occured";
    return { data: null, error: errMsg };
  } finally {
    if (setLoading) setLoading(false);
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/user/logout",
      {},
      {
        withCredentials: true,
      }
    );

    return { data: response.data, error: null };
  } catch (error) {
    const errMsg = error?.response.data.error || "An error occured";
    return { data: null, error: errMsg };
  }
};

export const googleAuth = (code, accountType) =>
  api.get(`/auth-google?code=${code}&accountType=${accountType}`, {
    withCredentials: true,
  });

export const getUser = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/v1/user/get-user",
      {
        withCredentials: true,
      }
    );
    return { data: response.data, error: null };
  } catch (error) {
    const errMsg = error?.response.data.error || "An error occured";
    return { data: null, error: errMsg };
  }
};

export const forgetPassword = async (data, setLoading) => {
  try {
    setLoading(true);

    const response = await axios.post(
      "http://localhost:3000/api/v1/user/request-reset-password",
      data,
      {
        withCredentials: true,
      }
    );

    return { data: response.data, error: null };
  } catch (error) {
    const errMsg = error?.response.data || "An error occured";
    return { data: null, error: errMsg };
  } finally {
    if (setLoading) setLoading(false);
  }
};

export const updatePassword = async (data, token, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.patch(
      `http://localhost:3000/api/v1/user/reset-password/${token}`,
      data
    );

    return { data: response.data, error: null };
  } catch (error) {
    const errMsg = error?.response.data.error || "An error occured";
    return { data: null, error: errMsg };
  } finally {
    setLoading(false);
  }
};

export const updateUserDetails = async (data, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.patch(
      `http://localhost:3000/api/v1/user/update-user-details`,
      data,
      {
        withCredentials: true,
      }
    );

    return { data: response.data, error: null };
  } catch (error) {
    const errMsg = error?.response.data.error || "An error occured";
    return { data: null, error: errMsg };
  } finally {
    setLoading(false);
  }
};
