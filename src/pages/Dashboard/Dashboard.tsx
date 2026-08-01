import {
  useEffect,
  useState,
  lazy,
  Suspense,
} from "react";


import DashboardSkeleton 
from "../../components/Common/DashboardSkeleton";


import DriverPerformance 
from "../../components/dashboard/DriverPerformance";


import VehicleUtilizationChart 
from "../../components/dashboard/VehicleUtilizationChart";


import RecentTrips 
from "../../components/Trips/RecentTrips";


import RevenueChart 
from "../../components/dashboard/RevenueChart";


import FuelTrendChart 
from "../../components/dashboard/FuelTrendChart";


import useDashboard 
from "../../hooks/useDashboard";


import KpiGrid 
from "../../components/dashboard/KpiGrid";


import FleetSummary 
from "../../components/Cards/FleetSummary";


import DashboardHeader 
from "../../components/Common/DashboardHeader";


import VehicleTable 
from "../../components/Tables/VehicleTable";


import RecentAlerts 
from "../../components/Alerts/RecentAlerts";


import DriverStatus 
from "../../components/Drivers/DriverStatus";


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
] = useState<string>("");






const fetchVehicles = async () => {



  try {


    setRefreshing(true);



    const response =
      await api.get("/vehicles");



    const data =
      response.data;



    if(
      Array.isArray(data.vehicles)
    ){

      setVehicles(
        data.vehicles
      );

    }


    else if(
      Array.isArray(data)
    ){

      setVehicles(
        data
      );

    }


    else {

      setVehicles([]);

    }



    setLastUpdated(
      new Date()
      .toLocaleTimeString()
    );



  }


  catch(err){


    console.error(
      "Vehicle Fetch Error:",
      err
    );


    setVehicles([]);


  }


  finally {


    setRefreshing(false);


  }


};





useEffect(()=>{


  fetchVehicles();



  const interval =
    setInterval(
      fetchVehicles,
      30000
    );



  return ()=>{


    clearInterval(
      interval
    );


  };


},[]);





if(loading){

  return (

    <DashboardSkeleton />

  );

}




if(error){

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

    <div
    className="
    bg-white
    p-8
    rounded-xl
    shadow
    text-center
    "
    >

      <h2
      className="
      text-red-600
      text-xl
      font-bold
      "
      >

        Dashboard Error

      </h2>


      <p
      className="
      text-gray-600
      mt-2
      "
      >

        {error}

      </p>


    </div>


  </div>

 );


}




if(!dashboard){

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
    font-semibold
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


{/* Header */}

<div
className="
flex
flex-col
md:flex-row
md:items-center
md:justify-between
gap-4
"
>


<DashboardHeader />



<div
className="
bg-white
rounded-xl
shadow
px-4
py-3
flex
items-center
gap-4
"
>


<div>

<p
className="
text-sm
text-gray-500
"
>

Last Updated

</p>


<p
className="
font-semibold
text-gray-800
"
>

{
lastUpdated || "Loading..."
}

</p>


</div>



<button

onClick={fetchVehicles}

disabled={refreshing}

className="
bg-blue-600
hover:bg-blue-700
disabled:bg-blue-300
text-white
px-4
py-2
rounded-lg
font-medium
transition
"

>

{

refreshing
?
"Refreshing..."
:
"Refresh"

}


</button>


</div>


</div>







{/* KPI */}

<KpiGrid
 dashboard={dashboard}
/>




{/* Fleet Summary */}

<FleetSummary />






{/* Analytics */}

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








{/* Charts */}

<div
className="
grid
grid-cols-1
md:grid-cols-2
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

Vehicle Activity

</h2>


<Suspense

fallback={
<p className="text-center">
Loading Chart...
</p>
}

>

<LineChart />

</Suspense>


</div>







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
<p className="text-center">
Loading Chart...
</p>
}

>

<BarChart />

</Suspense>


</div>



</div>










{/* Live Map + Alerts */}


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
overflow-hidden
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
<p className="text-center">
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









{/* Status Section */}


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
<p className="text-center">
Loading Chart...
</p>
}

>

<DoughnutChart />


</Suspense>



</div>




<DriverStatus />



</div>









{/* Recent Data */}


<RecentTrips />



<VehicleTable />





</div>

);


};


export default Dashboard;