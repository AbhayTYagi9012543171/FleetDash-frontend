import { api } from "./api";
import type { Vehicle } from "../types/vehicle";



// ===============================
// Response Types
// ===============================


interface VehicleListResponse {

  success?: boolean;

  vehicles: Vehicle[];

}



interface VehicleResponse {

  success?: boolean;

  message?: string;

  vehicle?: Vehicle;

}





// ===============================
// Vehicle Service
// ===============================


export const vehicleService = {



  // =====================
  // GET ALL VEHICLES
  // =====================

  async getVehicles(): Promise<Vehicle[]> {


    try {


      const response =
        await api.get<VehicleListResponse>(
          "/vehicles"
        );



      console.log(
        "Vehicle API Data:",
        response.data
      );



      return response.data.vehicles || [];



    }
    catch(error){


      console.error(
        "Get Vehicles Error:",
        error
      );


      throw error;


    }


  },






  // =====================
  // GET SINGLE VEHICLE
  // =====================


  async getVehicle(
    id:string
  ):Promise<Vehicle | null>{



    const response =
      await api.get<VehicleResponse>(
        `/vehicles/${id}`
      );



    return (
      response.data.vehicle ??
      null
    );



  },








  // =====================
  // CREATE VEHICLE
  // =====================


  async createVehicle(

    data:Partial<Vehicle>

  ):Promise<VehicleResponse>{



    const response =
      await api.post<VehicleResponse>(

        "/vehicles",

        data

      );



    return response.data;



  },








  // =====================
  // UPDATE VEHICLE
  // =====================


  async updateVehicle(

    id:string,

    data:Partial<Vehicle>

  ):Promise<VehicleResponse>{



    const response =
      await api.put<VehicleResponse>(

        `/vehicles/${id}`,

        data

      );



    return response.data;



  },








  // =====================
  // DELETE VEHICLE
  // =====================


  async deleteVehicle(

    id:string

  ):Promise<VehicleResponse>{



    const response =
      await api.delete<VehicleResponse>(

        `/vehicles/${id}`

      );



    return response.data;



  }



};