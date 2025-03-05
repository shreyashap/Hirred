import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import companyReducer from "./features/companySlice";
import selectedChatReducer from "./features/selectChat";

const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
    selectedChat: selectedChatReducer,
  },
});

export default store;
