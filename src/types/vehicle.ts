export interface Vehicle {

  _id?: string;

  id?: number;

  vehicleNumber: string;

  driver?: string;

  speed: number;

  fuel: number;

  status:
    | "Active"
    | "Idle"
    | "Maintenance"
    | "Offline";

  latitude: number;

  longitude: number;

  createdAt?: string;

  updatedAt?: string;

}