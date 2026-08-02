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
  FiDownload,
  FiDollarSign,
  FiDroplet,
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


import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


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

fuelConsumed:number;

revenue:number;

fleetHealth:number;


}








const defaultData:AnalyticsData={


totalVehicles:0,

activeVehicles:0,

idleVehicles:0,

offlineVehicles:0,

totalDrivers:0,

totalAlerts:0,

totalReports:0,

fuelConsumed:0,

revenue:0,

fleetHealth:0


};








const Analytics=()=>{


const [
analytics,
setAnalytics
]=useState<AnalyticsData>(
defaultData
);



const [
loading,
setLoading
]=useState(true);



const [
refreshing,
setRefreshing
]=useState(false);



const [
error,
setError
]=useState("");







// ================= FETCH =================


const fetchAnalytics=async()=>{


try{


setError("");



const response =
await api.get(
"/analytics"
);



const data =

response.data?.analytics ||

response.data?.data ||

response.data;



setAnalytics({

totalVehicles:data.totalVehicles || 0,

activeVehicles:data.activeVehicles || 0,

idleVehicles:data.idleVehicles || 0,

offlineVehicles:data.offlineVehicles || 0,

totalDrivers:data.totalDrivers || 0,

totalAlerts:data.totalAlerts || 0,

totalReports:data.totalReports || 0,

fuelConsumed:data.fuelConsumed || 0,

revenue:data.revenue || 0,

fleetHealth:data.fleetHealth || 0

});


}
catch(error:any){


setError(

error?.response?.data?.message ||

"Analytics loading failed"

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







const refresh=async()=>{


setRefreshing(true);


await fetchAnalytics();


};








// ================= EXPORT PDF =================


const exportPDF=()=>{


const pdf =
new jsPDF();



pdf.text(
"FleetDash Analytics Report",
14,
15
);



autoTable(pdf,{

startY:25,


head:[

[
"Metric",
"Value"
]

],


body:[

[
"Total Vehicles",
analytics.totalVehicles
],

[
"Active Vehicles",
analytics.activeVehicles
],

[
"Drivers",
analytics.totalDrivers
],

[
"Alerts",
analytics.totalAlerts
],

[
"Revenue",
analytics.revenue
],

[
"Fuel",
analytics.fuelConsumed
],

[
"Fleet Health",
`${analytics.fleetHealth}%`
]


]


});


pdf.save(
"FleetDash_Analytics.pdf"
);



};









const Card=({

title,

value,

icon

}:{

title:string;

value:string|number;

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
">


<p className="
text-gray-500
">

{title}

</p>


<div className="
text-blue-600
text-xl
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










const vehicleChart={


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









const fleetChart={


labels:[

"Active",

"Idle",

"Offline"

],


datasets:[{

data:[

analytics.activeVehicles,

analytics.idleVehicles,

analytics.offlineVehicles

]


}]


};










const revenueChart={


labels:[

"Jan",

"Feb",

"Mar",

"Apr",

"May",

"Jun"

],


datasets:[{


label:"Revenue",

data:[

120000,

180000,

250000,

220000,

300000,

analytics.revenue

]


}]


};










const fuelChart={


labels:[

"Jan",

"Feb",

"Mar",

"Apr",

"May",

"Jun"

],


datasets:[{


label:"Fuel Consumption",

data:[

3000,

3500,

2800,

4200,

3900,

analytics.fuelConsumed

]


}]


};








const options={


responsive:true,


plugins:{


legend:{


position:
"bottom" as const


}


}


};









return (


<div className="
space-y-8
">








{/* HEADER */}


<div className="
flex
justify-between
items-center
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

Fleet performance intelligence

</p>


</div>





<div className="
flex
gap-3
">


<button

onClick={refresh}

className="
bg-blue-600
text-white
px-5
py-3
rounded-lg
flex
items-center
gap-2
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





<button

onClick={exportPDF}

className="
bg-green-600
text-white
px-5
py-3
rounded-lg
flex
gap-2
items-center
"

>


<FiDownload/>

Export


</button>


</div>


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









{/* KPI */}


<div className="
grid
grid-cols-1
md:grid-cols-3
xl:grid-cols-6
gap-5
">


<Card

title="Vehicles"

value={analytics.totalVehicles}

icon={<FiTruck/>}

/>


<Card

title="Drivers"

value={analytics.totalDrivers}

icon={<FiUsers/>}

/>


<Card

title="Alerts"

value={analytics.totalAlerts}

icon={<FiAlertTriangle/>}

/>


<Card

title="Reports"

value={analytics.totalReports}

icon={<FiFileText/>}

/>


<Card

title="Fuel"

value={`${analytics.fuelConsumed} L`}

icon={<FiDroplet/>}

/>


<Card

title="Revenue"

value={`₹${analytics.revenue}`}

icon={<FiDollarSign/>}

/>



</div>









{/* HEALTH */}


<div className="
bg-white
shadow
rounded-xl
p-6
">


<h2 className="
text-xl
font-bold
">

Fleet Health Score

</h2>


<div className="
text-5xl
font-bold
text-blue-600
mt-4
">

{analytics.fleetHealth}%

</div>


</div>









{/* CHARTS */}


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

<h2 className="font-bold mb-5">

Vehicle Status

</h2>


<Bar

data={vehicleChart}

options={options}

/>


</div>






<div className="
bg-white
shadow
rounded-xl
p-6
">

<h2 className="font-bold mb-5">

Fleet Distribution

</h2>


<Doughnut

data={fleetChart}

options={options}

/>


</div>







<div className="
bg-white
shadow
rounded-xl
p-6
">

<h2 className="font-bold mb-5">

Revenue Trend

</h2>


<Line

data={revenueChart}

options={options}

/>


</div>






<div className="
bg-white
shadow
rounded-xl
p-6
">

<h2 className="font-bold mb-5">

Fuel Consumption Trend

</h2>


<Line

data={fuelChart}

options={options}

/>


</div>





</div>









</div>


);


};



export default Analytics;