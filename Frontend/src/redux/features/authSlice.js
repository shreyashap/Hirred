import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(user));
      state.userInfo = user;
    },
    logoutUser: (state) => {
      localStorage.removeItem("userInfo");
      state.userInfo = null;
    },
  },
});

export default authSlice.reducer;
export const { loginUser, logoutUser } = authSlice.actions;
