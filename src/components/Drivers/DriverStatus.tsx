import {
  useEffect,
  useState,
} from "react";

import {
  api,
} from "../../services/api";

import {
  FaSyncAlt,
  FaUserTie,
  FaPhone,
} from "react-icons/fa";



interface Driver {

  _id:string;

  fullName?:string;

  name?:string;

  phoneNumber?:string;

  status?:string;

}





const DriverStatus = ()=>{



const [drivers,setDrivers]
=
useState<Driver[]>([]);



const [loading,setLoading]
=
useState(true);



const [refreshing,setRefreshing]
=
useState(false);



const [error,setError]
=
useState("");







// ==========================
// Fetch Drivers
// ==========================


const fetchDrivers =
async()=>{


try{


setError("");



const response =
await api.get("/drivers");



console.log(
"Drivers:",
response.data
);




const driverData =

response.data.drivers ||

response.data.data ||

response.data ||

[];





setDrivers(
driverData
);



}

catch(error)
{


console.error(error);


setError(
"Unable to load drivers"
);


setDrivers([]);


}

finally{


setLoading(false);


}



};








// ==========================
// Initial + Auto Refresh
// ==========================


useEffect(()=>{


fetchDrivers();



const timer =
setInterval(()=>{


fetchDrivers();


},10000);




return()=>{


clearInterval(timer);


};



},[]);









// ==========================
// Manual Refresh
// ==========================


const handleRefresh =
async()=>{


setRefreshing(true);


await fetchDrivers();


setRefreshing(false);



};










// ==========================
// Status Color
// ==========================


const getStatusColor =
(status:string="")=>{


switch(status)
{


case "Driving":

case "Active":

return `
bg-green-100
text-green-700
`;



case "Idle":

return `
bg-yellow-100
text-yellow-700
`;



case "Offline":

case "Inactive":

return `
bg-red-100
text-red-700
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
bg-white
rounded-xl
shadow-md
p-5
">






{/* Header */}



<div className="
flex
flex-col
sm:flex-row
justify-between
gap-4
mb-5
">


<div>


<h2 className="
text-xl
font-bold
flex
items-center
gap-2
">


<FaUserTie
className="
text-blue-600
"
/>


Driver Status


</h2>


<p className="
text-sm
text-gray-500
mt-1
">


Total Drivers:

<strong>

{" "}
{drivers.length}

</strong>


</p>


</div>







<button


onClick={handleRefresh}


disabled={refreshing}


className="
flex
items-center
justify-center
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










{/* Driver List */}




<div className="
space-y-4
">





{

loading ?


[1,2,3].map((item)=>(


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
w-1/3
">

</div>


</div>


))





:

drivers.length===0 ?



<p className="
text-gray-500
">

No drivers found

</p>





:


drivers.slice(0,5).map(

(driver)=>(


<div

key={driver._id}

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



<div>


<p className="
font-semibold
text-gray-800
flex
items-center
gap-2
">


<FaUserTie
className="
text-gray-400
"/>


{

driver.fullName ||

driver.name ||

"Unknown Driver"

}


</p>




<p className="
text-sm
text-gray-500
flex
items-center
gap-2
">


<FaPhone/>


{

driver.phoneNumber ||

"No phone"

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
w-fit
${getStatusColor(
driver.status
)}
`}


>


{

driver.status ||

"Unknown"

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



export default DriverStatus;