import {
  useEffect,
  useState,
} from "react";


import {
  dashboardService
} from "../services/dashboardService";



export interface DashboardData {

  totalVehicles: number;

  activeVehicles: number;

  totalDrivers: number;

  todayTrips: number;

  revenue: number;

  fuelConsumed: number;


  // Header / KPI fields

  totalAlerts: number;

  maintenanceDue?: number;


  // Optional fields

  fleetHealth?: number;

  availableVehicles?: number;

}






const useDashboard = () => {


  const [
    dashboard,
    setDashboard
  ] = useState<DashboardData | null>(null);




  const [
    loading,
    setLoading
  ] = useState<boolean>(true);




  const [
    error,
    setError
  ] = useState<string>("");






  const fetchDashboard = async () => {


    try {


      setLoading(true);


      setError("");



      const response =
        await dashboardService.getDashboard();



      /*
        Backend response can be:

        {
          totalVehicles: 100,
          activeVehicles: 80
        }

        OR

        {
          dashboard:{
             totalVehicles:100
          }
        }

      */


      const data =
        response.dashboard || response;



      setDashboard({

        totalVehicles:
          data.totalVehicles || 0,


        activeVehicles:
          data.activeVehicles || 0,


        totalDrivers:
          data.totalDrivers || 0,


        todayTrips:
          data.todayTrips || 0,


        revenue:
          data.revenue || 0,


        fuelConsumed:
          data.fuelConsumed || 0,


        totalAlerts:
          data.totalAlerts || 0,


        maintenanceDue:
          data.maintenanceDue || 0,


        fleetHealth:
          data.fleetHealth || 0,


        availableVehicles:
          data.availableVehicles || 0,

      });



    }
    catch (err) {


      console.error(
        "Dashboard API Error:",
        err
      );



      setError(
        "Failed to load dashboard data"
      );



      setDashboard(null);


    }
    finally {


      setLoading(false);


    }


  };








  useEffect(() => {


    fetchDashboard();



  }, []);







  return {

    dashboard,

    loading,

    error,

    refresh: fetchDashboard,

  };


};



export default useDashboard;