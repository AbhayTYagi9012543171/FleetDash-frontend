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

  /** Timestamp of the latest accepted GPS fix; null/undefined means not yet received. */
  lastGpsAt?: string | null;

  /** Distinguishes actual device data from demo/simulated locations. */
  locationSource?: "gps-device" | "driver-app" | "demo" | "unknown";

}