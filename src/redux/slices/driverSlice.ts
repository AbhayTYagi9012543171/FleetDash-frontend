import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  driverService,
} from "../../services/driverService";

import type {
  Driver,
  DriverInput,
} from "../../services/driverService";


// ==========================
// State Interface
// ==========================

interface DriverState {
  drivers: Driver[];
  loading: boolean;
  error: string | null;
}


// ==========================
// Initial State
// ==========================

const initialState: DriverState = {
  drivers: [],
  loading: false,
  error: null,
};


// ==========================
// Fetch All Drivers
// ==========================

export const fetchDrivers = createAsyncThunk(
  "drivers/fetchDrivers",

  async (_, { rejectWithValue }) => {

    try {

      const drivers =
        await driverService.getDrivers();

      return drivers;

    } catch (error: any) {

      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch drivers"
      );

    }

  }
);


// ==========================
// Get Single Driver
// ==========================

export const fetchDriverById = createAsyncThunk(
  "drivers/fetchDriverById",

  async (
    id: string,
    { rejectWithValue }
  ) => {

    try {

      const driver =
        await driverService.getDriverById(id);

      return driver;

    } catch(error:any){

      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch driver"
      );

    }

  }
);


// ==========================
// Add Driver
// ==========================

export const addDriver = createAsyncThunk(
  "drivers/addDriver",

  async (
    data: DriverInput,
    { rejectWithValue }
  ) => {

    try {

      const driver =
        await driverService.createDriver(data);

      return driver;

    } catch(error:any){

      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to create driver"
      );

    }

  }
);


// ==========================
// Update Driver
// ==========================

export const updateDriver = createAsyncThunk(
  "drivers/updateDriver",

  async (
    {
      id,
      data,
    }: {
      id: string;
      data: DriverInput;
    },

    { rejectWithValue }

  ) => {

    try {

      const driver =
        await driverService.updateDriver(
          id,
          data
        );

      return driver;


    } catch(error:any){

      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to update driver"
      );

    }

  }
);


// ==========================
// Delete Driver
// ==========================

export const deleteDriver = createAsyncThunk(
  "drivers/deleteDriver",

  async (
    id: string,
    { rejectWithValue }
  ) => {

    try {

      await driverService.deleteDriver(id);

      return id;

    } catch(error:any){

      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to delete driver"
      );

    }

  }
);



// ==========================
// Slice
// ==========================

const driverSlice = createSlice({

  name: "drivers",

  initialState,

  reducers: {

    setDrivers: (
      state,
      action
    ) => {

      state.drivers = action.payload;

    },

    clearDriverError: (
      state
    ) => {

      state.error = null;

    },

  },


  extraReducers: (builder) => {


    builder


    // ======================
    // Fetch Drivers
    // ======================

    .addCase(
      fetchDrivers.pending,
      (state) => {

        state.loading = true;

      }
    )


    .addCase(
      fetchDrivers.fulfilled,
      (
        state,
        action
      ) => {

        state.loading = false;

        state.drivers =
          action.payload;

      }
    )


    .addCase(
      fetchDrivers.rejected,
      (
        state,
        action
      ) => {

        state.loading = false;

        state.error =
          action.payload as string;

      }
    )



    // ======================
    // Add Driver
    // ======================

    .addCase(
      addDriver.fulfilled,
      (
        state,
        action
      ) => {

        state.drivers.unshift(
          action.payload
        );

      }
    )



    // ======================
    // Update Driver
    // ======================

    .addCase(
      updateDriver.fulfilled,
      (
        state,
        action
      ) => {

        const index =
          state.drivers.findIndex(
            (driver) =>
              driver._id === action.payload._id
          );


        if(index !== -1){

          state.drivers[index] =
            action.payload;

        }

      }
    )



    // ======================
    // Delete Driver
    // ======================

    .addCase(
      deleteDriver.fulfilled,
      (
        state,
        action
      ) => {

        state.drivers =
          state.drivers.filter(
            (driver) =>
              driver._id !== action.payload
          );

      }
    );


  },

});


// ==========================
// Export Actions
// ==========================

export const {
  setDrivers,
  clearDriverError,
} = driverSlice.actions;


export default driverSlice.reducer;