import {
  useEffect,
  useState,
  lazy,
  Suspense,
  useCallback,
} from "react";

import type {
  Vehicle,
} from "../../types/vehicle";


// Cards

import FleetHealthCard
from "../../components/Cards/FleetHealthCard";

import FleetSummary
from "../../components/Cards/FleetSummary";


// Common

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



// Dashboard Components

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



// Tables

import RecentTrips
from "../../components/Trips/RecentTrips";

import VehicleTable
from "../../components/Tables/VehicleTable";

import RecentAlerts
from "../../components/Alerts/RecentAlerts";

import DriverStatus
from "../../components/Drivers/DriverStatus";



// Hook

import useDashboard
from "../../hooks/useDashboard";



// API

import {
  api,
} from "../../services/api";





// Lazy Components


const LineChart = lazy(
()=>import(
"../../components/Charts/LineChart"
)
);


const BarChart = lazy(
()=>import(
"../../components/Charts/BarChart"
)
);


const DoughnutChart = lazy(
()=>import(
"../../components/Charts/DoughnutChart"
)
);


const LiveMap = lazy(
()=>import(
"../../components/Map/LiveMap"
)
);







const Dashboard =()=>{


const {

dashboard,

loading,

error,

refreshDashboard,

}=useDashboard();





const [
vehicles,
setVehicles
]
=
useState<Vehicle[]>([]);





const [
refreshing,
setRefreshing
]
=
useState(false);





const [
lastUpdated,
setLastUpdated
]
=
useState("");








// =========================
// Fetch Vehicles
// =========================


const fetchVehicles =
useCallback(async()=>{


try{


const response =
await api.get("/vehicles");



const data =

response.data.vehicles ||

response.data.data ||

response.data ||

[];




setVehicles(
Array.isArray(data)
?
data
:
[]
);



setLastUpdated(

new Date()
.toLocaleTimeString()

);



}

catch(error)
{


console.error(
"Vehicle Error",
error
);



setVehicles([]);



}



},[]);











// =========================
// Refresh All
// =========================


const handleRefresh =
async()=>{


try{


setRefreshing(true);



await refreshDashboard();



await fetchVehicles();



}

finally{


setRefreshing(false);



}



};











// Initial Load + Auto Refresh


useEffect(()=>{


fetchVehicles();



const timer =
setInterval(

fetchVehicles,

30000

);



return()=>{


clearInterval(timer);


};



},[
fetchVehicles
]);









if(loading)
{


return (

<DashboardSkeleton/>

);


}









if(error)
{


return (

<div className="
min-h-screen
flex
items-center
justify-center
bg-gray-100
">


<div className="
bg-white
rounded-xl
shadow
p-8
">


<h2 className="
text-xl
font-bold
text-red-600
">

{error}

</h2>


</div>


</div>


);


}









if(!dashboard)
{


return (

<div className="
p-8
text-center
">


<h2 className="
text-xl
font-bold
text-red-500
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







{/* HEADER */}


<DashboardHeader

dashboard={dashboard}

lastUpdated={lastUpdated}

onRefresh={handleRefresh}

refreshing={refreshing}

/>









{/* KPI */}



<KpiGrid

dashboard={dashboard}

/>









{/* SUMMARY */}


<FleetSummary/>









{/* HEALTH */}



<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
">


<FleetHealthCard/>


<DriverStatus/>


</div>









{/* ANALYTICS */}



<div className="
grid
grid-cols-1
2xl:grid-cols-2
gap-6
">


<RevenueChart/>


<FuelTrendChart/>


<VehicleUtilizationChart

vehicles={vehicles}

/>


<DriverPerformance/>


</div>









{/* CHARTS */}



<div className="
grid
grid-cols-1
md:grid-cols-2
gap-6
">





<div className="
bg-white
rounded-xl
shadow
p-4
">


<h2 className="
text-xl
font-semibold
mb-4
">

Vehicle Activity

</h2>




<Suspense

fallback={
<p>
Loading chart...
</p>
}

>


<LineChart/>

</Suspense>



</div>









<div className="
bg-white
rounded-xl
shadow
p-4
">


<h2 className="
text-xl
font-semibold
mb-4
">

Monthly Trips

</h2>




<Suspense

fallback={
<p>
Loading chart...
</p>
}

>


<BarChart/>

</Suspense>



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
shadow
p-4
">


<h2 className="
text-xl
font-semibold
mb-4
">

Live Vehicle Tracking

</h2>





<Suspense

fallback={
<p>
Loading map...
</p>
}

>


<LiveMap

vehicles={vehicles}

geofences={[]}

/>


</Suspense>



</div>







<RecentAlerts/>






</div>









{/* VEHICLE STATUS */}



<div className="
bg-white
rounded-xl
shadow
p-4
">


<h2 className="
text-xl
font-semibold
mb-4
">

Vehicle Status

</h2>



<Suspense

fallback={
<p>
Loading...
</p>
}

>


<DoughnutChart/>

</Suspense>



</div>









{/* ACTIVITY */}



<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
">


<ActivityFeed/>


<NotificationPanel/>


</div>









{/* EXTRA */}



<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
">


<QuickActions/>


<WeatherWidget/>


</div>









{/* TABLES */}



<RecentTrips/>


<VehicleTable/>







</div>


);


};



export default Dashboard;