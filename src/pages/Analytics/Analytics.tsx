// import { useEffect, useState } from "react";

// import {
//   FiRefreshCw,
//   FiTruck,
//   FiUsers,
//   FiAlertTriangle,
//   FiFileText,
// } from "react-icons/fi";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// import {
//   Bar,
//   Pie,
//   Line,
// } from "react-chartjs-2";

// import { api } from "../../services/api";


// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend
// );



// interface AnalyticsData {

//   totalVehicles:number;
//   activeVehicles:number;
//   idleVehicles:number;
//   offlineVehicles:number;

//   totalDrivers:number;

//   totalAlerts:number;

//   totalReports:number;

// }




// const Analytics = () => {


// const [analytics,setAnalytics] =
// useState<AnalyticsData | null>(null);


// const [loading,setLoading] =
// useState<boolean>(true);


// const [error,setError] =
// useState<string>("");





// const fetchAnalytics = async()=>{


// try{


// setLoading(true);

// setError("");



// const response = await api.get("/analytics");

// console.log(
// "Analytics API:",
// response.data
// );



// const data =
// response.data.analytics ||
// response.data.data;



// if(data){

// setAnalytics(data);

// }
// else{

// setAnalytics({

// totalVehicles:0,
// activeVehicles:0,
// idleVehicles:0,
// offlineVehicles:0,

// totalDrivers:0,

// totalAlerts:0,

// totalReports:0

// });

// }



// }


// catch(err:any){


// console.log(
// "Analytics Error:",
// err
// );


// setError(
// err?.response?.data?.message ||
// "Failed to load analytics"
// );


// }


// finally{


// setLoading(false);


// }


// };






// useEffect(()=>{


// fetchAnalytics();


// },[]);







// if(loading){


// return (

// <div className="p-6 text-xl">

// Loading Analytics...

// </div>

// );


// }






// if(error){


// return (

// <div className="p-6">

// <div className="bg-red-100 text-red-700 p-4 rounded-lg">

// {error}

// </div>

// </div>

// );


// }








// const vehicleChart = {


// labels:[

// "Active",
// "Idle",
// "Offline"

// ],


// datasets:[

// {

// label:"Vehicles",

// data:[

// analytics?.activeVehicles ?? 0,

// analytics?.idleVehicles ?? 0,

// analytics?.offlineVehicles ?? 0

// ]

// }

// ]

// };







// const fleetStatusChart = {


// labels:[

// "Active",
// "Idle",
// "Offline"

// ],


// datasets:[

// {

// data:[

// analytics?.activeVehicles ?? 0,

// analytics?.idleVehicles ?? 0,

// analytics?.offlineVehicles ?? 0

// ]

// }

// ]


// };







// const reportAlertChart = {


// labels:[

// "Alerts",
// "Reports"

// ],


// datasets:[

// {

// label:"Count",

// data:[

// analytics?.totalAlerts ?? 0,

// analytics?.totalReports ?? 0

// ]

// }

// ]


// };








// const chartOptions = {


// responsive:true,


// plugins:{


// legend:{


// position:"bottom" as const


// }


// }


// };









// const StatCard = ({
// title,
// value,
// icon

// }:{

// title:string;
// value:number;
// icon:React.ReactNode;

// })=>{


// return (

// <div className="bg-white shadow rounded-xl p-5">


// <div className="flex justify-between items-center">


// <p className="text-gray-500">

// {title}

// </p>


// <div className="text-xl">

// {icon}

// </div>


// </div>



// <h2 className="text-3xl font-bold mt-3">

// {value}

// </h2>


// </div>

// );


// };











// return (

// <div className="space-y-6">





// {/* Header */}

// <div className="flex justify-between items-center">


// <div>


// <h1 className="text-3xl font-bold">

// Analytics Dashboard

// </h1>


// <p className="text-gray-500">

// Fleet performance overview

// </p>


// </div>





// <button

// onClick={fetchAnalytics}

// disabled={loading}

// className="
// bg-blue-600
// text-white
// px-5
// py-3
// rounded-lg
// flex
// items-center
// gap-2
// disabled:bg-blue-300
// "


// >


// <FiRefreshCw

// className={

// loading

// ?

// "animate-spin"

// :

// ""

// }

// />


// {

// loading

// ?

// "Refreshing..."

// :

// "Refresh"

// }



// </button>



// </div>











// {/* Cards */}



// <div className="
// grid
// grid-cols-1
// md:grid-cols-4
// gap-5
// ">



// <StatCard

// title="Vehicles"

// value={analytics?.totalVehicles ?? 0}

// icon={<FiTruck/>}

// />





// <StatCard

// title="Drivers"

// value={analytics?.totalDrivers ?? 0}

// icon={<FiUsers/>}

// />





// <StatCard

// title="Alerts"

// value={analytics?.totalAlerts ?? 0}

// icon={<FiAlertTriangle/>}

// />





// <StatCard

// title="Reports"

// value={analytics?.totalReports ?? 0}

// icon={<FiFileText/>}

// />



// </div>









// {/* Charts */}



// <div className="
// grid
// grid-cols-1
// lg:grid-cols-2
// gap-6
// ">





// <div className="
// bg-white
// shadow
// rounded-xl
// p-5
// ">


// <h2 className="text-xl font-bold mb-4">

// Vehicle Status

// </h2>



// <Bar

// data={vehicleChart}

// options={chartOptions}

// />


// </div>









// <div className="
// bg-white
// shadow
// rounded-xl
// p-5
// ">


// <h2 className="text-xl font-bold mb-4">

// Fleet Distribution

// </h2>



// <Pie

// data={fleetStatusChart}

// options={chartOptions}

// />


// </div>









// <div className="
// bg-white
// shadow
// rounded-xl
// p-5
// lg:col-span-2
// ">


// <h2 className="text-xl font-bold mb-4">

// Alerts & Reports

// </h2>



// <Line

// data={reportAlertChart}

// options={chartOptions}

// />



// </div>








// </div>







// </div>


// );


// };



// export default Analytics;



import { useEffect, useState } from "react";

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


import { api } from "../../services/api";



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



const Analytics = () => {


const [analytics,setAnalytics] =
useState<AnalyticsData | null>(null);


const [loading,setLoading] =
useState(true);


const [error,setError] =
useState("");




const fetchAnalytics = async()=>{


try{


setLoading(true);

setError("");



const response =
await api.get("/analytics");



const data =
response.data.analytics ||
response.data.data;



setAnalytics(

data ||

{

totalVehicles:0,
activeVehicles:0,
idleVehicles:0,
offlineVehicles:0,
totalDrivers:0,
totalAlerts:0,
totalReports:0

}

);



}

catch(err:any){


setError(
err?.response?.data?.message ||
"Failed to load analytics"
);


}

finally{


setLoading(false);


}


};




useEffect(()=>{

fetchAnalytics();

},[]);





if(loading){

return(

<div className="p-6 text-xl">
Loading Analytics...
</div>

);

}




if(error){

return(

<div className="p-6">

<div className="bg-red-100 text-red-700 p-4 rounded-lg">

{error}

</div>

</div>

);

}






const vehicleStatusChart = {


labels:[

"Active",
"Idle",
"Offline"

],


datasets:[

{

label:"Vehicles",

data:[

analytics?.activeVehicles ?? 0,

analytics?.idleVehicles ?? 0,

analytics?.offlineVehicles ?? 0

]

}

]

};





const fleetDistributionChart = {


labels:[

"Active Fleet",
"Idle Fleet",
"Offline Fleet"

],


datasets:[

{

data:[

analytics?.activeVehicles ?? 0,

analytics?.idleVehicles ?? 0,

analytics?.offlineVehicles ?? 0

]

}

]

};





const systemOverviewChart = {


labels:[

"Vehicles",
"Drivers",
"Alerts",
"Reports"

],


datasets:[

{

label:"Total",

data:[

analytics?.totalVehicles ?? 0,

analytics?.totalDrivers ?? 0,

analytics?.totalAlerts ?? 0,

analytics?.totalReports ?? 0

]

}

]

};






const fleetActivityChart = {


labels:[

"Jan",
"Feb",
"Mar",
"Apr",
"May",
"Jun"

],


datasets:[

{

label:"Vehicle Activity",

data:[

12,
25,
18,
35,
30,
45

]

}

]

};





const chartOptions = {


responsive:true,


plugins:{


legend:{


position:"bottom" as const


}


}


};






const StatCard = ({
title,
value,
icon
}:{

title:string;

value:number;

icon:React.ReactNode;

})=>(


<div className="bg-white shadow rounded-xl p-5">


<div className="flex justify-between">

<p className="text-gray-500">

{title}

</p>


<div className="text-xl">

{icon}

</div>


</div>


<h2 className="text-3xl font-bold mt-3">

{value}

</h2>


</div>


);







return(


<div className="space-y-8">


<div className="flex justify-between items-center">


<div>

<h1 className="text-3xl font-bold">

Analytics Dashboard

</h1>


<p className="text-gray-500">

Fleet performance overview

</p>


</div>



<button

onClick={fetchAnalytics}

className="
bg-blue-600
text-white
px-5
py-3
rounded-lg
flex
gap-2
items-center
"

>

<FiRefreshCw/>

Refresh

</button>


</div>





<div className="
grid
grid-cols-1
md:grid-cols-4
gap-5
">


<StatCard

title="Vehicles"

value={analytics?.totalVehicles ?? 0}

icon={<FiTruck/>}

/>


<StatCard

title="Drivers"

value={analytics?.totalDrivers ?? 0}

icon={<FiUsers/>}

/>


<StatCard

title="Alerts"

value={analytics?.totalAlerts ?? 0}

icon={<FiAlertTriangle/>}

/>


<StatCard

title="Reports"

value={analytics?.totalReports ?? 0}

icon={<FiFileText/>}

/>


</div>





<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
">



<div className="bg-white shadow rounded-xl p-6">

<h2 className="text-xl font-bold mb-5">

Vehicle Status

</h2>


<Bar

data={vehicleStatusChart}

options={chartOptions}

/>


</div>





<div className="bg-white shadow rounded-xl p-6">


<h2 className="text-xl font-bold mb-5">

Fleet Distribution

</h2>


<Doughnut

data={fleetDistributionChart}

options={chartOptions}

/>


</div>






<div className="bg-white shadow rounded-xl p-6">


<h2 className="text-xl font-bold mb-5">

System Overview

</h2>


<Bar

data={systemOverviewChart}

options={chartOptions}

/>


</div>






<div className="bg-white shadow rounded-xl p-6">


<h2 className="text-xl font-bold mb-5">

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