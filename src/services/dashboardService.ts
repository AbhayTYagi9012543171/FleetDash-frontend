import { api } from "./api";


export const dashboardService = {

  getDashboard: async () => {

    const response = await api.get("/dashboard");

    return response.data;

  },


  getVehicles: async () => {

    const response = await api.get("/vehicles");

    return response.data;

  },


  getTrips: async () => {

    const response = await api.get("/trips");

    return response.data;

  },


  getDrivers: async () => {

    const response = await api.get("/drivers");

    return response.data;

  },


};