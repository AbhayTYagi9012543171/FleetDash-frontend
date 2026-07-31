import { createSlice } from "@reduxjs/toolkit";

const alertSlice = createSlice({
  name: "alerts",
  initialState: [],
  reducers: {
    setAlerts(_, action) {
      return action.payload;
    },
  },
});

export const { setAlerts } = alertSlice.actions;

export default alertSlice.reducer;