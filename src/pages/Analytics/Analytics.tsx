import {
  useEffect,
  useState,
} from "react";

import {
  FiRefreshCw,
  FiTruck,
  FiUsers,
  FiAlertTriangle,
  FiFileText,
} from "react-icons/fi";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";


import {
  Bar,
  Doughnut,
  Line,
} from "react-chartjs-2";


import {
  api,
} from "../../services/api";




ChartJS.register(

CategoryScale,

LinearScale,

BarElement,

ArcElement,

PointElement,

LineElement,

Tooltip,

Legend

);






interface AnalyticsData {


totalVehicles:number;

activeVehicles:number;

idleVehicles:number;

offlineVehicles:number;

totalDrivers:number;

totalAlerts:number;

totalReports:number;


}







const Analytics =()=>{



const [analytics,setAnalytics]
=
useState<AnalyticsData>({

totalVehicles:0,

activeVehicles:0,

idleVehicles:0,

offlineVehicles:0,

totalDrivers:0,

totalAlerts:0,

totalReports:0

});





const [loading,setLoading]
=
useState(true);



const [refreshing,setRefreshing]
=
useState(false);



const [error,setError]
=
useState("");









// Fetch Analytics

const fetchAnalytics =
async()=>{


try{


setError("");



const response =
await api.get("/analytics");



console.log(
"Analytics API:",
response.data
);




const data =

response.data.analytics ||

response.data.data ||

response.data;





setAnalytics({

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


totalAlerts:
data.totalAlerts || 0,


totalReports:
data.totalReports || 0,


});




}

catch(error:any){


console.error(error);



setError(

error?.response?.data?.message ||

"Failed to load analytics"

);



}

finally{


setLoading(false);


setRefreshing(false);


}


};









useEffect(()=>{


fetchAnalytics();


},[]);









const handleRefresh =
async()=>{


setRefreshing(true);


await fetchAnalytics();


};









const StatCard =({

title,

value,

icon

}:{

title:string;

value:number;

icon:React.ReactNode;


})=>(



<div className="
bg-white
shadow
rounded-xl
p-5
">


<div className="
flex
justify-between
items-center
">


<p className="
text-gray-500
">

{title}

</p>



<div className="
text-xl
text-blue-600
">

{icon}

</div>



</div>



<h2 className="
text-3xl
font-bold
mt-3
">


{
loading
?
"..."
:
value
}



</h2>



</div>



);









const vehicleStatusChart={


labels:[

"Active",

"Idle",

"Offline"

],


datasets:[{

label:"Vehicles",

data:[

analytics.activeVehicles,

analytics.idleVehicles,

analytics.offlineVehicles

]

}]


};







const fleetDistributionChart={


labels:[

"Active Fleet",

"Idle Fleet",

"Offline Fleet"

],


datasets:[{

data:[

analytics.activeVehicles,

analytics.idleVehicles,

analytics.offlineVehicles

]


}]


};








const systemOverviewChart={


labels:[

"Vehicles",

"Drivers",

"Alerts",

"Reports"

],


datasets:[{


label:"Total",

data:[

analytics.totalVehicles,

analytics.totalDrivers,

analytics.totalAlerts,

analytics.totalReports

]


}]


};









const fleetActivityChart={


labels:[

"Jan",

"Feb",

"Mar",

"Apr",

"May",

"Jun"

],


datasets:[{


label:"Vehicle Activity",

data:[

12,

25,

18,

35,

30,

45

]


}]


};








const chartOptions={


responsive:true,


plugins:{


legend:{


position:"bottom" as const


}


}


};









return(


<div className="
space-y-8
">









{/* Header */}


<div className="
flex
flex-col
sm:flex-row
justify-between
gap-4
">



<div>


<h1 className="
text-3xl
font-bold
">

Analytics Dashboard

</h1>



<p className="
text-gray-500
">

Fleet performance overview

</p>



</div>






<button


onClick={handleRefresh}


disabled={refreshing}


className="
bg-blue-600
text-white
px-5
py-3
rounded-lg
flex
items-center
gap-2
disabled:opacity-50
"


>


<FiRefreshCw

className={
  refreshing
    ? "animate-spin"
    : ""
}

/>


Refresh


</button>





</div>









{
error &&


<div className="
bg-red-100
text-red-700
p-4
rounded-lg
">

{error}

</div>


}









{/* Stats */}



<div className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-4
gap-5
">



<StatCard

title="Vehicles"

value={analytics.totalVehicles}

icon={<FiTruck/>}

/>




<StatCard

title="Drivers"

value={analytics.totalDrivers}

icon={<FiUsers/>}

/>




<StatCard

title="Alerts"

value={analytics.totalAlerts}

icon={<FiAlertTriangle/>}

/>




<StatCard

title="Reports"

value={analytics.totalReports}

icon={<FiFileText/>}

/>




</div>









{/* Charts */}



<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
">






<div className="
bg-white
shadow
rounded-xl
p-6
">


<h2 className="
font-bold
text-xl
mb-5
">

Vehicle Status

</h2>



<Bar

data={vehicleStatusChart}

options={chartOptions}

/>


</div>








<div className="
bg-white
shadow
rounded-xl
p-6
">


<h2 className="
font-bold
text-xl
mb-5
">

Fleet Distribution

</h2>



<Doughnut

data={fleetDistributionChart}

options={chartOptions}

/>


</div>








<div className="
bg-white
shadow
rounded-xl
p-6
">


<h2 className="
font-bold
text-xl
mb-5
">

System Overview

</h2>



<Bar

data={systemOverviewChart}

options={chartOptions}

/>


</div>








<div className="
bg-white
shadow
rounded-xl
p-6
">


<h2 className="
font-bold
text-xl
mb-5
">

Fleet Activity Trend

</h2>



<Line

data={fleetActivityChart}

options={chartOptions}

/>


</div>







</div>









</div>


);



};



export default Analytics;