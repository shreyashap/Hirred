import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  companyInfo: [],
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    addCompany: (state, action) => {
      state.companyInfo.push(...action.payload);
    },
  },
});

export default companySlice.reducer;
export const { addCompany } = companySlice.actions;
