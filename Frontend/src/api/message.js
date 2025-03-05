import axios from "axios";

export const startConversation = async (
  senderId,
  receiverId,
  jobId,
  setLoading
) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `http://localhost:3000/api/v1/chat/start-conversation?senderId=${senderId}&receiverId=${receiverId}&jobId=${jobId}`,
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

export const getConversations = async (userId, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.get(
      `http://localhost:3000/api/v1/chat/get-conversations?userId=${userId}`,
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

export const getMessages = async (conversationId, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.get(
      `http://localhost:3000/api/v1/chat/get-messages/${conversationId}`,
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

export const sendMessage = async (receiverId, conversationId, data) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/v1/chat/send-message?receiverId=${receiverId}&conversationId=${conversationId}`,
      data,
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
