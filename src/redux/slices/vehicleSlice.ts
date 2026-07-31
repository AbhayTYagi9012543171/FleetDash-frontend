import { createSlice } from "@reduxjs/toolkit";

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState: [],
  reducers: {
    setVehicles(_, action) {
      return action.payload;
    },

    addVehicle(state: any, action) {
      state.push(action.payload);
    },
  },
});

export const { setVehicles, addVehicle } = vehicleSlice.actions;

export default vehicleSlice.reducer;