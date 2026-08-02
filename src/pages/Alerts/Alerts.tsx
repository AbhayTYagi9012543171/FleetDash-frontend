import {
  useEffect,
  useState,
} from "react";

import {
  FiAlertTriangle,
  FiRefreshCw,
} from "react-icons/fi";

import {
  api,
} from "../../services/api";



interface Alert {

  _id:string;

  alertType:string;

  severity:string;

  message:string;

  location?:string;

  status:string;

  createdAt:string;

}





const Alerts =()=>{



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








// Fetch Alerts

const fetchAlerts =
async()=>{


try{


setError("");



const response =
await api.get("/alerts");



console.log(
"Alerts API:",
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
"Alerts Error:",
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









const severityStyle =
(severity:string)=>{


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







const statusStyle =
(status:string)=>{


switch(status)
{


case "Resolved":

return `
bg-green-100
text-green-700
`;



case "Pending":

return `
bg-yellow-100
text-yellow-700
`;



default:

return `
bg-gray-100
text-gray-700
`;



}


};









return (

<div className="
space-y-6
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
text-gray-800
">

Alerts

</h1>


<p className="
text-gray-500
">

Fleet alerts and notifications

</p>


</div>






<button


onClick={handleRefresh}


disabled={refreshing}


className="
bg-blue-600
text-white
px-4
py-2
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
p-3
rounded-lg
">

{error}

</div>


}









{/* Card */}



<div className="
bg-white
rounded-xl
shadow
overflow-hidden
">





<div className="
p-4
border-b
flex
justify-between
items-center
">



<h2 className="
text-xl
font-bold
flex
items-center
gap-2
">


<FiAlertTriangle/>


Alert List


</h2>




<span className="
bg-blue-100
text-blue-700
px-3
py-1
rounded-full
text-sm
">

{alerts.length}

</span>




</div>









<div className="
overflow-x-auto
">



{

loading ?


<div className="
p-6
text-gray-500
">

Loading alerts...

</div>



:

alerts.length===0 ?



<div className="
p-6
text-gray-500
">

No alerts found.

</div>



:


<table className="
w-full
min-w-[900px]
">



<thead className="
bg-gray-100
">


<tr>


<th className="p-3 text-left">
Type
</th>


<th className="p-3 text-left">
Severity
</th>


<th className="p-3 text-left">
Message
</th>


<th className="p-3 text-left">
Location
</th>


<th className="p-3 text-left">
Status
</th>


<th className="p-3 text-left">
Time
</th>


</tr>


</thead>







<tbody>


{

alerts.map(

(alert)=>(


<tr

key={alert._id}

className="
border-t
hover:bg-gray-50
"


>


<td className="
p-3
font-medium
">

{alert.alertType}

</td>





<td className="p-3">


<span

className={`
px-3
py-1
rounded-full
text-xs
font-medium
${severityStyle(
alert.severity
)}
`}

>


{alert.severity}


</span>


</td>






<td className="
p-3
max-w-xs
">

{alert.message}

</td>





<td className="p-3">

{
alert.location ||
"N/A"
}

</td>






<td className="p-3">


<span

className={`
px-3
py-1
rounded-full
text-xs
font-medium
${statusStyle(
alert.status
)}
`}
>

{alert.status}

</span>


</td>







<td className="
p-3
text-sm
text-gray-500
">


{

new Date(
alert.createdAt
)
.toLocaleString()

}


</td>





</tr>


)


)


}



</tbody>





</table>



}




</div>








</div>





</div>


);


};



export default Alerts;