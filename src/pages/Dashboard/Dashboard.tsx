import {
  useEffect,
  useState,
  lazy,
  Suspense,
} from "react";


import FleetHealthCard 
from "../../components/Cards/FleetHealthCard";

import FleetSummary 
from "../../components/Cards/FleetSummary";


import ActivityFeed 
from "../../components/Common/ActivityFeed";

import NotificationPanel 
from "../../components/Common/NotificationPanel";

import QuickActions 
from "../../components/Common/QuickActions";

import WeatherWidget 
from "../../components/Common/WeatherWidget";


import DashboardSkeleton 
from "../../components/Common/DashboardSkeleton";


import DashboardHeader 
from "../../components/Common/DashboardHeader";


import DriverPerformance 
from "../../components/dashboard/DriverPerformance";


import VehicleUtilizationChart 
from "../../components/dashboard/VehicleUtilizationChart";


import RevenueChart 
from "../../components/dashboard/RevenueChart";


import FuelTrendChart 
from "../../components/dashboard/FuelTrendChart";


import KpiGrid 
from "../../components/dashboard/KpiGrid";


import RecentTrips 
from "../../components/Trips/RecentTrips";


import VehicleTable 
from "../../components/Tables/VehicleTable";


import RecentAlerts 
from "../../components/Alerts/RecentAlerts";


import DriverStatus 
from "../../components/Drivers/DriverStatus";


import useDashboard 
from "../../hooks/useDashboard";


import { api } 
from "../../services/api";



const LineChart = lazy(
  () => import("../../components/Charts/LineChart")
);


const BarChart = lazy(
  () => import("../../components/Charts/BarChart")
);


const DoughnutChart = lazy(
  () => import("../../components/Charts/DoughnutChart")
);


const LiveMap = lazy(
  () => import("../../components/Map/LiveMap")
);



interface Vehicle {

  _id?: string;

  id?: number;

  vehicleNumber: string;

  driver: string;

  speed: number;

  fuel: number;

  status:
    | "Active"
    | "Idle"
    | "Offline";

  latitude: number;

  longitude: number;

}
const Dashboard = () => {


  const {
    dashboard,
    loading,
    error,
  } = useDashboard();



  const [
    vehicles,
    setVehicles
  ] = useState<Vehicle[]>([]);



  const [
    refreshing,
    setRefreshing
  ] = useState(false);



  const [
    lastUpdated,
    setLastUpdated
  ] = useState("");





  const fetchVehicles = async () => {


    try {


      setRefreshing(true);



      const response =
        await api.get("/vehicles");



      const data = response.data;



      if (Array.isArray(data.vehicles)) {


        setVehicles(data.vehicles);


      }
      else if (Array.isArray(data)) {


        setVehicles(data);


      }
      else {


        setVehicles([]);


      }



      setLastUpdated(
        new Date().toLocaleTimeString()
      );



    }
    catch (err) {


      console.error(
        "Vehicle Fetch Error",
        err
      );


      setVehicles([]);


    }
    finally {


      setRefreshing(false);


    }


  };






  useEffect(() => {


    fetchVehicles();



    const timer =
      setInterval(
        fetchVehicles,
        30000
      );



    return () =>
      clearInterval(timer);



  }, []);






  if (loading) {


    return <DashboardSkeleton />;


  }






  if (error) {


    return (

      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
        "
      >

        <h2
          className="
          text-red-600
          text-xl
          font-bold
          "
        >

          {error}

        </h2>


      </div>

    );


  }






  if (!dashboard) {


    return (

      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        "
      >

        <h2
          className="
          text-red-500
          text-xl
          font-bold
          "
        >

          No Dashboard Data Found

        </h2>


      </div>

    );


  }
    return (

    <div
      className="
      min-h-screen
      bg-gray-100
      p-3
      sm:p-4
      md:p-6
      space-y-6
      overflow-x-hidden
      "
    >


      {/* HEADER */}

      <DashboardHeader

        dashboard={dashboard}

        lastUpdated={lastUpdated}

        onRefresh={fetchVehicles}

        refreshing={refreshing}

      />




      {/* KPI SECTION */}

      <KpiGrid

        dashboard={dashboard}

      />





      {/* FLEET SUMMARY */}

      <FleetSummary />





      {/* FLEET HEALTH + DRIVER STATUS */}

      <div
        className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
        "
      >

        <FleetHealthCard />

        <DriverStatus />

      </div>





      {/* ANALYTICS */}

      <div
        className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
        "
      >

        <RevenueChart />


        <FuelTrendChart />


        <VehicleUtilizationChart

          vehicles={vehicles}

        />


        <DriverPerformance />

      </div>







      {/* BASIC CHARTS */}

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-6
        "
      >



        {/* Line Chart */}

        <div
          className="
          bg-white
          rounded-xl
          shadow-md
          p-4
          "
        >

          <h2
            className="
            text-xl
            font-semibold
            mb-4
            "
          >

            Vehicle Activity

          </h2>



          <Suspense

            fallback={
              <p>
                Loading Chart...
              </p>
            }

          >

            <LineChart />

          </Suspense>


        </div>





        {/* Bar Chart */}

        <div
          className="
          bg-white
          rounded-xl
          shadow-md
          p-4
          "
        >

          <h2
            className="
            text-xl
            font-semibold
            mb-4
            "
          >

            Monthly Trips

          </h2>



          <Suspense

            fallback={
              <p>
                Loading Chart...
              </p>
            }

          >

            <BarChart />

          </Suspense>


        </div>


      </div>






      {/* LIVE MAP + ALERTS */}

      <div
        className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-6
        "
      >



        <div
          className="
          lg:col-span-2
          bg-white
          rounded-xl
          shadow-md
          p-4
          "
        >


          <h2
            className="
            text-xl
            font-semibold
            mb-4
            "
          >

            Live Vehicle Tracking

          </h2>




          <Suspense

            fallback={
              <p>
                Loading Map...
              </p>
            }

          >

            <LiveMap

              vehicles={vehicles}

            />

          </Suspense>



        </div>





        <RecentAlerts />



      </div>
            {/* VEHICLE STATUS */}

      <div
        className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
        "
      >


        <div
          className="
          bg-white
          rounded-xl
          shadow-md
          p-4
          "
        >


          <h2
            className="
            text-xl
            font-semibold
            mb-4
            "
          >

            Vehicle Status

          </h2>




          <Suspense

            fallback={
              <p>
                Loading...
              </p>
            }

          >

            <DoughnutChart />

          </Suspense>



        </div>


      </div>








      {/* ACTIVITY + NOTIFICATIONS */}

      <div
        className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
        "
      >


        <ActivityFeed />


        <NotificationPanel />


      </div>








      {/* QUICK ACTIONS + WEATHER */}

      <div
        className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
        "
      >


        <QuickActions />


        <WeatherWidget />


      </div>








      {/* RECENT TRIPS */}

      <RecentTrips />







      {/* VEHICLE TABLE */}

      <VehicleTable />





    </div>

  );


};




export default Dashboard;