import { createSlice } from "@reduxjs/toolkit";

const reportSlice = createSlice({
  name: "reports",
  initialState: [],
  reducers: {
    setReports(_, action) {
      return action.payload;
    },
  },
});

export const { setReports } = reportSlice.actions;

export default reportSlice.reducer;