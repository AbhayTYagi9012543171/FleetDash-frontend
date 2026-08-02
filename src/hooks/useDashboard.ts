import {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  api,
} from "../services/api";




// Dashboard Data Type

export interface DashboardData {


  totalVehicles: number;

  activeVehicles: number;

  idleVehicles: number;

  offlineVehicles: number;



  totalDrivers: number;

  activeDrivers: number;



  totalTrips: number;

  todayTrips: number;



  revenue: number;

  fuelConsumption: number;



  totalAlerts: number;


}







const useDashboard = () => {



  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);



  const [loading, setLoading] =
    useState(true);



  const [error, setError] =
    useState("");








  // ==========================
  // Fetch Dashboard Data
  // ==========================


  const fetchDashboard = useCallback(
    async () => {


      try {


        setLoading(true);

        setError("");



        const response =
          await api.get("/dashboard");



        console.log(
          "Dashboard API:",
          response.data
        );




        const data =

          response.data.dashboard ||

          response.data.data ||

          response.data;







        setDashboard({

          totalVehicles:
            data.totalVehicles || 0,



          activeVehicles:
            data.activeVehicles || 0,



          idleVehicles:
            data.idleVehicles || 0,



          offlineVehicles:
            data.offlineVehicles || 0,




          totalDrivers:
            data.totalDrivers || 0,



          activeDrivers:
            data.activeDrivers || 0,




          totalTrips:
            data.totalTrips || 0,



          todayTrips:
            data.todayTrips || 0,





          revenue:
            data.revenue || 0,



          fuelConsumption:
            data.fuelConsumption || 0,





          totalAlerts:

            data.totalAlerts ||

            data.alerts ||

            0,



        });




      }

      catch(error:any){


        console.error(
          "Dashboard Error:",
          error
        );



        setError(

          error?.response?.data?.message ||

          "Failed to load dashboard"

        );


      }


      finally{


        setLoading(false);


      }



    },

    []

  );









  // ==========================
  // Initial Load
  // ==========================


  useEffect(()=>{


    fetchDashboard();


  },[
    fetchDashboard
  ]);









  return {


    dashboard,


    loading,


    error,



    // Manual refresh

    refreshDashboard:
      fetchDashboard,


  };


};







export default useDashboard;