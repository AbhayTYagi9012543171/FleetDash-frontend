import { configureStore } from "@reduxjs/toolkit";

import driverReducer from "./slice/driverSlice";
import authReducer from "./slice/authSlice";
import vehicleReducer from "./slice/vehicleSlice";


export const store = configureStore({

  reducer: {

    drivers: driverReducer,

    auth: authReducer,

    vehicle: vehicleReducer,

  },

});


export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;