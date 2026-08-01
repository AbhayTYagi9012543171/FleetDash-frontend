
import {
  useEffect,
  useState
} from "react";


import DriverPerformance 
from "../../components/dashboard/DriverPerformance";
import VehicleUtilizationChart 
from "../../components/dashboard/VehicleUtilizationChart";
import RecentTrips from "../../components/Trips/RecentTrips";

import RevenueChart from "../../components/dashboard/RevenueChart";
import FuelTrendChart from "../../components/dashboard/FuelTrendChart";
import useDashboard from "../../hooks/useDashboard";
import KpiGrid from "../../components/dashboard/KpiGrid";

import FleetSummary from "../../components/Cards/FleetSummary";
import DashboardHeader from "../../components/Common/DashboardHeader";


import LineChart from "../../components/Charts/LineChart";
import BarChart from "../../components/Charts/BarChart";
import DoughnutChart from "../../components/Charts/DoughnutChart";


import VehicleTable from "../../components/Tables/VehicleTable";


import LiveMap from "../../components/Map/LiveMap";
import RecentAlerts from "../../components/Alerts/RecentAlerts";
import DriverStatus from "../../components/Drivers/DriverStatus";

import { api } from "../../services/api";


interface Vehicle {

  _id?:string;

  id?:number;

  vehicleNumber:string;

  driver:string;

  speed:number;

  fuel:number;

  status:
  | "Active"
  | "Idle"
  | "Offline";

  latitude:number;

  longitude:number;

}




const Dashboard = () => {


const {
  dashboard,
  loading,
  error,
} = useDashboard();
const [vehicles, setVehicles] = useState<Vehicle[]>([]);



  const fetchVehicles = async()=>{


    try{


      const response =
      await api.get("/vehicles");


      console.log(
        "Vehicles:",
        response.data
      );



      if(
        Array.isArray(
          response.data.vehicles
        )
      ){


        setVehicles(
          response.data.vehicles
        );


      }
      else if(
        Array.isArray(response.data)
      ){


        setVehicles(
          response.data
        );


      }
      else{


        setVehicles([]);

      }



    }
    catch(error){


      console.error(
        "Vehicle Error:",
        error
      );


      setVehicles([]);


    }


  };

useEffect(() => {

  fetchVehicles();

  const interval = setInterval(() => {
    fetchVehicles();
  }, 30000);


  return () => clearInterval(interval);

}, []);


  if(loading){


    return (

      <div className="
      flex
      items-center
      justify-center
      h-screen
      bg-gray-100
      ">

        <h2 className="
        text-2xl
        font-semibold
        animate-pulse
        ">

          Loading Dashboard...

        </h2>


      </div>

    );


  }







  if(error){


    return (

      <div className="
      flex
      items-center
      justify-center
      h-screen
      bg-gray-100
      ">


        <h2 className="
        text-red-600
        text-xl
        font-semibold
        ">

          {error}

        </h2>


      </div>

    );


  }







  if(!dashboard){


    return (

      <div className="
      flex
      items-center
      justify-center
      h-screen
      bg-gray-100
      ">


        <h2 className="
        text-red-500
        text-xl
        font-semibold
        ">

          No Dashboard Data Found

        </h2>


      </div>

    );


  }








return (

<div className="
min-h-screen
bg-gray-100
p-3
sm:p-4
md:p-6
space-y-6
overflow-x-hidden
">


<DashboardHeader />






{/* STAT CARDS */}

{/* KPI Dashboard */}
<KpiGrid dashboard={dashboard} />

<FleetSummary />


{/* ANALYTICS CHARTS */}

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



<div className="
grid
grid-cols-1
md:grid-cols-2
gap-6
">


<div className="
bg-white
rounded-xl
shadow-md
p-6
">

<h2 className="
text-xl
font-semibold
mb-4
">

Vehicle Activity

</h2>

<LineChart />

</div>



<div className="
bg-white
rounded-xl
shadow-md
p-6
">

<h2 className="
text-xl
font-semibold
mb-4
">

Monthly Trips

</h2>

<BarChart />

</div>


</div>









{/* MAP + ALERTS */}


<div className="
grid
grid-cols-1
lg:grid-cols-3
gap-6
">


<div className="
lg:col-span-2
bg-white
rounded-xl
shadow-md
p-3
sm:p-4
md:p-6
overflow-hidden
">


<h2 className="
text-xl
font-semibold
mb-4
">

Live Vehicle Tracking

</h2>



<LiveMap

vehicles={vehicles}

/>



</div>



<RecentAlerts />



</div>









{/* STATUS */}


<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
">


<div className="
bg-white
rounded-xl
shadow-md
p-3
sm:p-4
md:p-6
">


<h2 className="
text-xl
font-semibold
mb-4
">

Vehicle Status

</h2>


<DoughnutChart />


</div>




<DriverStatus />



</div>







<RecentTrips />



<VehicleTable />





</div>

);



};



export default Dashboard;