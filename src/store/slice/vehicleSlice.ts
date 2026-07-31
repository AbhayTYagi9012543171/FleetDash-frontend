import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export interface Vehicle {
  _id?: string;
  vehicleNumber: string;
  driver: string | null;
  speed: number;
  fuel: number;
  status: string;
  latitude: number;
  longitude: number;
}

interface VehicleState {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
}

const initialState: VehicleState = {
  vehicles: [],
  loading: false,
  error: null,
};

// ==============================
// Fetch Vehicles
// ==============================

export const fetchVehicles = createAsyncThunk(
  "vehicles/fetchVehicles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/vehicles");

      return (
        res.data.vehicles ||
        res.data.data ||
        []
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch vehicles"
      );
    }
  }
);

// ==============================
// Add Vehicle
// ==============================

export const addVehicle = createAsyncThunk(
  "vehicles/addVehicle",
  async (vehicle: Vehicle, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/vehicles",
        vehicle
      );

      return (
        res.data.vehicle ||
        res.data.data
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to add vehicle"
      );
    }
  }
);

// ==============================
// Update Vehicle
// ==============================

export const updateVehicle = createAsyncThunk(
  "vehicles/updateVehicle",
  async (
    {
      id,
      vehicle,
    }: {
      id: string;
      vehicle: Vehicle;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(
        `/vehicles/${id}`,
        vehicle
      );

      return (
        res.data.vehicle ||
        res.data.data
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update vehicle"
      );
    }
  }
);

// ==============================
// Delete Vehicle
// ==============================

export const deleteVehicle = createAsyncThunk(
  "vehicles/deleteVehicle",
  async (
    id: string,
    { rejectWithValue }
  ) => {
    try {
      await api.delete(`/vehicles/${id}`);

      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete vehicle"
      );
    }
  }
);

const vehicleSlice = createSlice({
  name: "vehicles",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchVehicles.fulfilled,
        (state, action) => {
          state.loading = false;
          state.vehicles = action.payload;
        }
      )

      .addCase(
        fetchVehicles.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      )

      // Add
      .addCase(
        addVehicle.fulfilled,
        (state, action) => {
          state.vehicles.unshift(action.payload);
        }
      )

      // Update
      .addCase(
        updateVehicle.fulfilled,
        (state, action) => {
          const index =
            state.vehicles.findIndex(
              (v) => v._id === action.payload._id
            );

          if (index !== -1) {
            state.vehicles[index] =
              action.payload;
          }
        }
      )

      // Delete
      .addCase(
        deleteVehicle.fulfilled,
        (state, action) => {
          state.vehicles =
            state.vehicles.filter(
              (v) => v._id !== action.payload
            );
        }
      );
  },
});

export default vehicleSlice.reducer;