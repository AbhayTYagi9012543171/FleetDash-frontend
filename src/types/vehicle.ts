export interface Vehicle {

  _id?: string;

  id?: string | number;

  vehicleNumber: string;

  driver?: string;

  status:
    | "Active"
    | "Idle"
    | "Maintenance"
    | "Offline";

  speed: number;

  fuel: number;

  latitude: number;

  longitude: number;

  createdAt?: string;

  updatedAt?: string;

}