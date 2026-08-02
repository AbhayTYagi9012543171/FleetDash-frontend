import {
  useEffect,
  useState,
} from "react";

import {
  api,
} from "../../services/api";

import {
  FaSyncAlt,
  FaBell,
} from "react-icons/fa";



interface AlertVehicle {

  vehicleNumber?:string;

}



interface AlertDriver {

  fullName?:string;

}



interface Alert {


  _id:string;

  vehicle?:AlertVehicle | string;

  driver?:AlertDriver | string;

  alertType:string;

  severity:string;

  message?:string;

  location?:string;

  status?:string;

  createdAt:string;


}







const RecentAlerts =()=>{



const [alerts,setAlerts]
=
useState<Alert[]>([]);



const [loading,setLoading]
=
useState(true);



const [refreshing,setRefreshing]
=
useState(false);



const [error,setError]
=
useState("");








// =======================
// Fetch Alerts
// =======================


const fetchAlerts =
async()=>{


try{


setError("");



const response =
await api.get("/alerts");



console.log(
"Alerts:",
response.data
);




const data =

response.data.alerts ||

response.data.data ||

response.data ||

[];




setAlerts(data);



}

catch(error)
{


console.error(
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



return()=>{


clearInterval(interval);


};



},[]);









const handleRefresh =
async()=>{


setRefreshing(true);


await fetchAlerts();


setRefreshing(false);


};









// Severity Style

const getSeverityStyle =
(
severity:string
)=>{


switch(severity)
{


case "Critical":

return `
bg-red-100
text-red-700
`;



case "High":

return `
bg-orange-100
text-orange-700
`;



case "Medium":

return `
bg-yellow-100
text-yellow-700
`;



default:

return `
bg-green-100
text-green-700
`;



}



};









const getVehicleName =
(
vehicle:Alert["vehicle"]
)=>{


if(typeof vehicle==="object")
{


return (
vehicle?.vehicleNumber ||
"N/A"
);


}



return vehicle || "N/A";


};









const getDriverName =
(
driver:Alert["driver"]
)=>{


if(typeof driver==="object")
{


return (
driver?.fullName ||
"N/A"
);


}



return driver || "N/A";


};









return (


<div className="
bg-white
rounded-xl
shadow-md
p-5
w-full
">








{/* Header */}



<div className="
flex
flex-col
sm:flex-row
justify-between
items-start
sm:items-center
gap-3
mb-5
">





<div className="
flex
items-center
gap-2
">


<FaBell
className="
text-blue-600
text-xl
"
/>



<h2 className="
text-xl
font-bold
">

Recent Alerts

</h2>



<span className="
bg-blue-100
text-blue-700
px-2
py-1
rounded-full
text-xs
">

{alerts.length}

</span>



</div>







<button

onClick={handleRefresh}

disabled={refreshing}


className="
flex
items-center
gap-2
bg-blue-600
text-white
px-4
py-2
rounded-lg
hover:bg-blue-700
disabled:opacity-50
"


>


<FaSyncAlt

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
p-3
rounded-lg
mb-4
">


{error}


</div>


}









<div className="
space-y-4
">








{

loading ?



[1,2,3].map(
(item)=>(


<div

key={item}

className="
animate-pulse
border-b
pb-4
"


>


<div className="
h-4
bg-gray-200
rounded
w-1/2
mb-2
">

</div>


<div className="
h-3
bg-gray-200
rounded
w-3/4
">

</div>



</div>



)

)



:



alerts.length===0 ?



<p className="
text-gray-500
">

No alerts found

</p>






:





alerts.slice(0,5).map(
(alert)=>(



<div

key={alert._id}

className="
border-b
pb-4
flex
flex-col
sm:flex-row
justify-between
gap-3
"


>






<div className="
flex-1
">





<h3 className="
font-semibold
text-gray-800
">


{alert.alertType}



</h3>







<p className="
text-sm
text-gray-500
">

Vehicle:

{" "}

{
getVehicleName(
alert.vehicle
)
}


</p>






<p className="
text-sm
text-gray-500
">


Driver:

{" "}

{
getDriverName(
alert.driver
)
}


</p>








<p className="
text-sm
text-gray-500
">

{
alert.location ||
"Location unavailable"
}


</p>






{
alert.message &&


<p className="
text-sm
text-gray-600
mt-1
">

{alert.message}

</p>


}







<p className="
text-xs
text-gray-400
">


{

new Date(
alert.createdAt
).toLocaleString()

}


</p>






</div>








<span

className={`
px-3
py-1
rounded-full
text-xs
font-medium
h-fit
${getSeverityStyle(
alert.severity
)}
`}


>


{
alert.severity
}


</span>






</div>



)


)



}





</div>







</div>


);



};



export default RecentAlerts;