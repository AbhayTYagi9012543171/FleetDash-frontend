import { api } from "./api";


export interface Vehicle {

  _id?: string;

  vehicleNumber: string;

  driver?: string;

  speed: number;

  fuel: number;

  status: "Active" | "Idle" | "Offline";

  latitude: number;

  longitude: number;

}



export const vehicleService = {


  // =====================
  // GET ALL VEHICLES
  // =====================

  async getVehicles(): Promise<Vehicle[]> {

    const response = await api.get("/vehicles");

    console.log(
      "Vehicle API Data:",
      response.data
    );


    return response.data.vehicles;

  },



  // =====================
  // GET SINGLE VEHICLE
  // =====================

  async getVehicle(id: string) {

    const response = await api.get(
      `/vehicles/${id}`
    );

    return response.data;

  },



  // =====================
  // CREATE VEHICLE
  // =====================

  async createVehicle(data: Vehicle) {

    const response = await api.post(
      "/vehicles",
      data
    );


    return response.data;

  },



  // =====================
  // UPDATE VEHICLE
  // =====================

  async updateVehicle(
    id: string,
    data: Partial<Vehicle>
  ) {

    const response = await api.put(
      `/vehicles/${id}`,
      data
    );


    return response.data;

  },



  // =====================
  // DELETE VEHICLE
  // =====================

  async deleteVehicle(id: string) {

    const response = await api.delete(
      `/vehicles/${id}`
    );


    return response.data;

  }

};