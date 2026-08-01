import { useEffect, useState } from "react";
import { api } from "../services/api";


export interface DashboardData {

  totalVehicles: number;

  activeVehicles: number;

  totalDrivers: number;

  totalAlerts: number;

  totalReports: number;

}



const useDashboard = () => {


  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");



  useEffect(() => {


    const fetchDashboard = async () => {


      try {


        const response =
          await api.get("/dashboard");


        console.log(
          "Dashboard API:",
          response.data
        );


        setDashboard(
          response.data.dashboard || response.data
        );


      } 
      catch (err) {


        console.error(
          "Dashboard Error:",
          err
        );


        setError(
          "Unable to fetch dashboard data"
        );


      }
      finally {


        setLoading(false);


      }


    };



    fetchDashboard();


  }, []);



  return {

    dashboard,

    loading,

    error,

  };


};



export default useDashboard;