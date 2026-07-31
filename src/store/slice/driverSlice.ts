// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { api } from "../../services/api";

// export interface Driver {
//   _id?: string;
//   fullName: string;
//   email: string;
//   phoneNumber: string;
//   licenseNumber: string;
//   address: string;
//   experience: number;
//   status: string;
// }

// interface DriverState {
//   drivers: Driver[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: DriverState = {
//   drivers: [],
//   loading: false,
//   error: null,
// };

// // Fetch Drivers
// export const fetchDrivers = createAsyncThunk(
//   "drivers/fetchDrivers",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get("/drivers");

//       return (
//         res.data.drivers ||
//         res.data.data ||
//         []
//       );
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch drivers"
//       );
//     }
//   }
// );

// // Add Driver
// export const addDriver = createAsyncThunk(
//   "drivers/addDriver",

//   async (driver: Driver, { rejectWithValue }) => {
//     try {
//       console.log("========== ADD DRIVER ==========");
//       console.log("Sending driver:", driver);

//       const res = await api.post("/drivers", driver);

//       console.log("POST STATUS:", res.status);
//       console.log("POST RESPONSE:", res.data);

//       return res.data.driver || res.data.data;

//     } catch (error: any) {

//       console.error("========== ADD DRIVER ERROR ==========");

//       console.error("Error message:", error.message);

//       console.error(
//         "Status:",
//         error.response?.status
//       );

//       console.error(
//         "Backend response:",
//         error.response?.data
//       );

//       return rejectWithValue(
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to add driver"
//       );
//     }
//   }
// );

// const driverSlice = createSlice({
//   name: "drivers",
//   initialState,
//   reducers: {},

//   extraReducers: (builder) => {
//     builder

//       .addCase(fetchDrivers.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })

//       .addCase(fetchDrivers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.drivers = action.payload;
//       })

//       .addCase(fetchDrivers.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       .addCase(addDriver.pending, (state) => {
//         state.loading = true;
//       })

//       .addCase(addDriver.fulfilled, (state, action) => {
//         state.loading = false;

//         if (action.payload) {
//           state.drivers.push(action.payload);
//         }
//       })

//       .addCase(addDriver.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export default driverSlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

// ==========================
// Driver Interface
// ==========================

export interface Driver {
  _id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  address: string;
  experience: number;
  status: string;
}

// ==========================
// State
// ==========================

interface DriverState {
  drivers: Driver[];
  loading: boolean;
  error: string | null;
}

const initialState: DriverState = {
  drivers: [],
  loading: false,
  error: null,
};

// ==========================
// GET ALL DRIVERS
// ==========================

export const fetchDrivers = createAsyncThunk<
  Driver[],
  void,
  { rejectValue: string }
>(
  "drivers/fetchDrivers",

  async (_, { rejectWithValue }) => {
    try {
      console.log("========== FETCH DRIVERS ==========");

      const response = await api.get("/drivers");

      console.log("GET STATUS:", response.status);
      console.log("GET RESPONSE:", response.data);

      return (
        response.data.drivers ??
        response.data.data ??
        []
      );

    } catch (error: any) {

      console.error("========== FETCH DRIVER ERROR ==========");

      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
      console.error("Message:", error.message);

      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch drivers"
      );
    }
  }
);

// ==========================
// ADD DRIVER
// ==========================

export const addDriver = createAsyncThunk<
  Driver,
  Driver,
  { rejectValue: string }
>(
  "drivers/addDriver",

  async (driver, { rejectWithValue }) => {

    try {

      console.log("========== ADD DRIVER ==========");
      console.log("Sending driver:", driver);

      const response = await api.post(
        "/drivers",
        driver
      );

      console.log(
        "POST STATUS:",
        response.status
      );

      console.log(
        "POST RESPONSE:",
        response.data
      );

      const createdDriver =
        response.data.driver ??
        response.data.data;

      if (!createdDriver) {
        throw new Error(
          "Backend did not return created driver"
        );
      }

      return createdDriver;

    } catch (error: any) {

      console.error(
        "========== ADD DRIVER ERROR =========="
      );

      console.error(
        "Error message:",
        error.message
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to add driver"
      );
    }
  }
);

// ==========================
// SLICE
// ==========================

const driverSlice = createSlice({

  name: "drivers",

  initialState,

  reducers: {},

  extraReducers: (builder) => {

    // ==========================
    // FETCH
    // ==========================

    builder
      .addCase(
        fetchDrivers.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchDrivers.fulfilled,
        (state, action) => {

          state.loading = false;

          state.drivers =
            action.payload;

        }
      )

      .addCase(
        fetchDrivers.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch drivers";

        }
      );

    // ==========================
    // ADD
    // ==========================

    builder
      .addCase(
        addDriver.pending,
        (state) => {

          state.loading = true;
          state.error = null;

        }
      )

      .addCase(
        addDriver.fulfilled,
        (state, action) => {

          state.loading = false;

          state.drivers.push(
            action.payload
          );

        }
      )

      .addCase(
        addDriver.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload ||
            "Failed to add driver";

        }
      );
  },
});

export default driverSlice.reducer;