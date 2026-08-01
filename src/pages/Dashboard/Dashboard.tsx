
import {
  useEffect,
  useState
} from "react";



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
import RecentTrips from "../../components/Trips/RecentTrips";





import { api } from "../../services/api";



interface DashboardData {

  totalVehicles:number;

  activeVehicles:number;

  totalDrivers:number;

  totalAlerts:number;

  totalReports:number;

}



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


  const [dashboard,setDashboard]
  =
  useState<DashboardData | null>(null);



  const [vehicles,setVehicles]
  =
  useState<Vehicle[]>([]);



  const [loading,setLoading]
  =
  useState(true);



  const [error,setError]
  =
  useState("");






  // ================= FETCH DASHBOARD =================


  const fetchDashboard = async()=>{


    try{


      const response =
      await api.get("/dashboard");


      console.log(
        "Dashboard API:",
        response.data
      );


      if(response.data.success){

        setDashboard(
          response.data.dashboard
        );

        setError("");

      }


    }
    catch(err){


      console.error(
        "Dashboard Error:",
        err
      );


      setError(
        "Unable to connect to server."
      );


    }


  };







  // ================= FETCH VEHICLES =================


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








  useEffect(()=>{


    const loadData =
    async()=>{


      setLoading(true);


      await Promise.all([

        fetchDashboard(),

        fetchVehicles()

      ]);


      setLoading(false);


    };



    loadData();



    const interval =
    setInterval(()=>{


      fetchDashboard();

      fetchVehicles();


    },30000);



    return ()=>clearInterval(interval);



  },[]);









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
<KpiGrid />










<FleetSummary />







{/* CHARTS */}


<div className="
grid
grid-cols-1
md:grid-cols-2
gap-4
md:gap-6
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
text-lg
sm:text-xl
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
p-3
sm:p-4
md:p-6
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