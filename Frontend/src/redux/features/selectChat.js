import { createSlice } from "@reduxjs/toolkit";
import { addCompany } from "./companySlice";
import { act } from "react";

const initialState = {
  chatInfo: {},
};

const selectedChatSlice = createSlice({
  name: "selectedChat",
  initialState,
  reducers: {
    chatSelected: (state, action) => {
      const { conversationId, receiverId, isOpen, firstName, lastName } =
        action.payload;
      state.chatInfo.conversationId = conversationId;
      state.chatInfo.receiverId = receiverId;
      state.chatInfo.isOpen = isOpen;
      state.chatInfo.firstName = firstName;
      state.chatInfo.lastName = lastName;
    },
  },
});

export default selectedChatSlice.reducer;
export const { chatSelected, addCompanyInfo } = selectedChatSlice.actions;
