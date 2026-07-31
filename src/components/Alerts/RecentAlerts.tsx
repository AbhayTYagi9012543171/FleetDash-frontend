import { useEffect, useState } from "react";
import { api } from "../../services/api";


interface AlertVehicle {

  vehicleNumber?: string;

}


interface AlertDriver {

  fullName?: string;

}



interface Alert {

  _id:string;

  vehicle?: AlertVehicle | string;

  driver?: AlertDriver | string;

  alertType:string;

  severity:string;

  message:string;

  location?:string;

  status:string;

  createdAt:string;

}





const RecentAlerts = () => {


const [alerts,setAlerts] =
useState<Alert[]>([]);


const [loading,setLoading] =
useState(true);


const [error,setError] =
useState("");







// ========================
// Fetch Alerts
// ========================

const fetchAlerts = async()=>{


try{


setLoading(true);


const response =
await api.get("/alerts");



console.log(
"Alerts API:",
response.data
);



if(response.data.success){


setAlerts(
response.data.alerts
);


}
else{


setAlerts([]);

}



setError("");



}
catch(error:any){


console.log(
"Alert Error:",
error
);


setAlerts([]);


setError(
"Unable to load alerts"
);



}
finally{


setLoading(false);


}


};







useEffect(()=>{


fetchAlerts();



const interval =
setInterval(
fetchAlerts,
15000
);



return ()=>clearInterval(interval);



},[]);









const getSeverityStyle = (
severity:string
)=>{


switch(severity){


case "Critical":

return "bg-red-100 text-red-700";


case "High":

return "bg-orange-100 text-orange-700";


case "Medium":

return "bg-yellow-100 text-yellow-700";


default:

return "bg-green-100 text-green-700";


}


};








const getVehicleName = (
vehicle:Alert["vehicle"]
)=>{


if(typeof vehicle === "object"){

return vehicle?.vehicleNumber || "N/A";

}


return vehicle || "N/A";


};







const getDriverName = (
driver:Alert["driver"]
)=>{


if(typeof driver === "object"){

return driver?.fullName || "N/A";

}


return driver || "N/A";


};









return (


<div
  className="
  bg-white
  rounded-xl
  shadow-md
  p-4
  sm:p-5
  md:p-6
  w-full
  overflow-hidden
">





<div className="
flex
flex-col
sm:flex-row
items-start
sm:items-center
justify-between
gap-3
mb-5
">


<h2 className="text-xl font-semibold">

Recent Alerts

</h2>



<button

onClick={fetchAlerts}

className="
w-full
sm:w-auto
text-sm
bg-blue-600
text-white
px-4
py-2
rounded-lg
hover:bg-blue-700
transition
"

>

Refresh

</button>



</div>








{
error &&

<p className="text-red-500 mb-3">

{error}

</p>

}







<div className="space-y-4">





{
loading ?


<p className="text-gray-500">

Loading alerts...

</p>



:



alerts.length===0 ?


<p className="text-gray-500">

No alerts found

</p>



:



alerts.slice(0,5).map((alert)=>(



<div

key={alert._id}

className="
border-b
pb-4
flex
flex-col
sm:flex-row
justify-between
items-start
gap-3
"

>




<div className="flex-1 min-w-0">


<h3 className="font-semibold text-gray-800 break-words">

{alert.alertType}

</h3>




<p className="text-sm text-gray-500 break-words">

Vehicle:
{" "}
{getVehicleName(alert.vehicle)}

</p>




<p className="text-sm text-gray-500 break-words">

Driver:
{" "}
{getDriverName(alert.driver)}

</p>





<p className="text-sm text-gray-500">

{alert.location || "Location unavailable"}

</p>





<p className="text-xs sm:text-sm text-gray-400 break-words">

{
new Date(alert.createdAt)
.toLocaleString()
}

</p>




</div>








<span

className={`
self-start
sm:self-auto
px-3
py-1
rounded-full
text-xs
sm:text-sm
font-medium
whitespace-nowrap
${getSeverityStyle(alert.severity)}
`}

>

{alert.severity}

</span>






</div>



))

}



</div>





</div>


);


};


export default RecentAlerts;