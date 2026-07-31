import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import vehicleReducer from "./slices/vehicleSlice";
import driverReducer from "./slices/driverSlice";
import alertReducer from "./slices/alertSlice";
import reportReducer from "./slices/reportSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehicleReducer,
    drivers: driverReducer,
    alerts: alertReducer,
    reports: reportReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;