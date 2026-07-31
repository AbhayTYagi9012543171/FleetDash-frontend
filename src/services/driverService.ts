// import { api } from "./api";


// // ======================
// // Driver Interface
// // ======================

// export interface Driver {

//   _id: string;

//   fullName: string;

//   email: string;

//   phoneNumber: string;

//   licenseNumber: string;

//   address: string;

//   experience: number;

//   status:
//     | "Available"
//     | "Driving"
//     | "On Leave";

//   assignedVehicle?: string | null;

//   createdAt?: string;

//   updatedAt?: string;

// }



// // ======================
// // Driver Input
// // ======================

// export interface DriverInput {

//   fullName: string;

//   email: string;

//   phoneNumber: string;

//   licenseNumber: string;

//   address: string;

//   experience: number;

//   status:
//     | "Available"
//     | "Driving"
//     | "On Leave";

// }



// // ======================
// // API Response Types
// // ======================


// interface GetDriversResponse {

//   success: boolean;

//   count: number;

//   data: Driver[];

// }



// interface SingleDriverResponse {

//   success: boolean;

//   data: Driver;

// }



// interface DeleteDriverResponse {

//   success:boolean;

//   message:string;

// }



// // ======================
// // Driver Service
// // ======================


// export const driverService = {



//   // ======================
//   // GET ALL DRIVERS
//   // ======================

//   async getDrivers(): Promise<Driver[]> {


//     const response =
//       await api.get<GetDriversResponse>(
//         "/drivers"
//       );


//     console.log(
//       "GET DRIVERS RESPONSE:",
//       response.data
//     );


//     return response.data.data;

//   },





//   // ======================
//   // GET DRIVER BY ID
//   // ======================

//   async getDriverById(
//     id:string
//   ):Promise<Driver>{


//     const response =
//       await api.get<SingleDriverResponse>(
//         `/drivers/${id}`
//       );


//     return response.data.data;

//   },





//   // ======================
//   // CREATE DRIVER
//   // ======================

//   async createDriver(
//     data:DriverInput
//   ):Promise<Driver>{


//     const response =
//       await api.post<SingleDriverResponse>(
//         "/drivers",
//         data
//       );


//     console.log(
//       "CREATE DRIVER RESPONSE:",
//       response.data
//     );


//     return response.data.data;

//   },





//   // ======================
//   // UPDATE DRIVER
//   // ======================

//   async updateDriver(
//     id:string,
//     data:DriverInput
//   ):Promise<Driver>{


//     const response =
//       await api.put<SingleDriverResponse>(
//         `/drivers/${id}`,
//         data
//       );


//     return response.data.data;

//   },





//   // ======================
//   // DELETE DRIVER
//   // ======================

//   async deleteDriver(
//     id:string
//   ):Promise<string>{


//     const response =
//       await api.delete<DeleteDriverResponse>(
//         `/drivers/${id}`
//       );


//     return response.data.message;

//   },


// };


import { api } from "./api";

export interface Driver {

  _id: string;

  fullName: string;

  email: string;

  phoneNumber: string;

  licenseNumber: string;

  address: string;

  experience: number;

  status:
  | "Available"
  | "Driving"
  | "On Leave";

  assignedVehicle?: string | null;

  createdAt?: string;

  updatedAt?: string;
}


export interface DriverInput {

  fullName:string;

  email:string;

  phoneNumber:string;

  licenseNumber:string;

  address:string;

  experience:number;

  status:
  | "Available"
  | "Driving"
  | "On Leave";

}



export const driverService = {


async getDrivers():Promise<Driver[]>{

 const response =
 await api.get("/drivers");


 console.log(
  "Driver API:",
  response.data
 );


 return (
   response.data.drivers ||
   response.data.data ||
   []
 );

},



async getDriverById(
 id:string
):Promise<Driver>{


 const response =
 await api.get(`/drivers/${id}`);


 return (
  response.data.driver ||
  response.data.data
 );

},



async createDriver(
 data:DriverInput
):Promise<Driver>{


 const response =
 await api.post(
  "/drivers",
  data
 );


 return (
  response.data.driver ||
  response.data.data
 );

},



async updateDriver(
 id:string,
 data:DriverInput
):Promise<Driver>{


 const response =
 await api.put(
 `/drivers/${id}`,
 data
 );


 return (
 response.data.driver ||
 response.data.data
 );

},



async deleteDriver(
 id:string
):Promise<string>{


 const response =
 await api.delete(
 `/drivers/${id}`
 );


 return response.data.message;

}



};