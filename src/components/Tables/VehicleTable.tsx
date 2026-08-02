import {
  useEffect,
  useState,
} from "react";

import {
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";


import { api } from "../../services/api";

import type { Vehicle } from "../../types/vehicle";



// ==========================
// Component
// ==========================

const VehicleTable = () => {



const [vehicles,setVehicles] =
useState<Vehicle[]>([]);


const [loading,setLoading] =
useState(true);


const [error,setError] =
useState("");


const [searchTerm,setSearchTerm] =
useState("");






// ==========================
// Fetch Vehicles
// ==========================

const fetchVehicles = async()=>{


try{


setLoading(true);


const response =
await api.get("/vehicles");



console.log(
"Vehicle Table API:",
response.data
);



if(
Array.isArray(response.data.vehicles)
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



setError("");



}
catch(error){


console.error(
"Vehicle Load Error:",
error
);


setError(
"Unable to load vehicles"
);



}
finally{


setLoading(false);


}



};








useEffect(()=>{


fetchVehicles();


},[]);









// ==========================
// Status Color
// ==========================

const statusColor = (
status:string
)=>{


switch(status){


case "Active":

return "bg-green-100 text-green-700";



case "Idle":

return "bg-yellow-100 text-yellow-700";



case "Maintenance":

return "bg-orange-100 text-orange-700";



case "Offline":

return "bg-red-100 text-red-700";



default:

return "bg-gray-100 text-gray-700";


}



};










// ==========================
// Driver Name
// ==========================

const getDriverName =(
driver:any
)=>{


if(
typeof driver === "object"
){


return (
driver?.fullName ||
driver?.name ||
"N/A"
);


}


return driver || "N/A";


};









// ==========================
// Search Filter
// ==========================

const filteredVehicles =
vehicles.filter(
(vehicle)=>{


const search =
searchTerm.toLowerCase();



return (


vehicle.vehicleNumber
.toLowerCase()
.includes(search)


||

getDriverName(
vehicle.driver
)
.toLowerCase()
.includes(search)


||

vehicle.status
.toLowerCase()
.includes(search)



);



}

);








return (


<div className="
bg-white
rounded-2xl
shadow-lg
p-6
">








{/* Header */}


<div className="
flex
flex-col
lg:flex-row
justify-between
items-start
lg:items-center
gap-5
mb-6
">


<div>


<h2 className="
text-2xl
font-bold
text-gray-800
">

🚚 Vehicle List

</h2>


<p className="
text-gray-500
mt-1
">

Showing {filteredVehicles.length}
of {vehicles.length} vehicles

</p>


</div>







<div className="
flex
flex-col
sm:flex-row
gap-3
w-full
lg:w-auto
">



<div className="relative">


<FaSearch

className="
absolute
left-3
top-1/2
-translate-y-1/2
text-gray-400
"

/>



<input

type="text"

placeholder="
Search vehicle, driver, status...
"

value={searchTerm}

onChange={
e=>setSearchTerm(
e.target.value
)
}


className="
w-full
sm:w-80
pl-10
pr-4
py-2.5
border
rounded-xl
outline-none
focus:ring-2
focus:ring-blue-500
"

/>



</div>





<button

onClick={fetchVehicles}

className="
flex
items-center
justify-center
gap-2
bg-blue-600
hover:bg-blue-700
text-white
px-5
py-2.5
rounded-xl
"


>


<FaSyncAlt/>

Refresh


</button>



</div>




</div>









{
error &&

<div className="
mb-5
rounded-lg
bg-red-100
text-red-700
p-3
">

{error}

</div>

}










{/* Desktop Table */}


<div className="
hidden
md:block
overflow-x-auto
rounded-xl
border
">


<table className="
min-w-full
">


<thead className="
bg-gray-100
">


<tr>


<th className="px-5 py-4 text-left">
Vehicle
</th>


<th className="px-5 py-4 text-left">
Driver
</th>


<th className="px-5 py-4 text-left">
Speed
</th>


<th className="px-5 py-4 text-left">
Fuel
</th>


<th className="px-5 py-4 text-left">
Status
</th>


</tr>


</thead>





<tbody>



{
loading ?

<tr>

<td
colSpan={5}
className="
text-center
py-10
text-gray-500
"
>

Loading Vehicles...

</td>

</tr>



:


filteredVehicles.length===0 ?


<tr>

<td

colSpan={5}

className="
text-center
py-10
text-gray-500
"

>

🚚 No Vehicles Found

</td>

</tr>




:



filteredVehicles.map(
(vehicle)=>(


<tr

key={
vehicle._id ??
vehicle.vehicleNumber
}

className="
border-t
hover:bg-blue-50
"

>


<td className="
px-5
py-4
font-semibold
">

{vehicle.vehicleNumber}

</td>



<td className="px-5 py-4">

{
getDriverName(
vehicle.driver
)
}

</td>



<td className="px-5 py-4">

{vehicle.speed} km/h

</td>



<td className="px-5 py-4">

{vehicle.fuel}%

</td>




<td className="px-5 py-4">


<span

className={`
px-3
py-1
rounded-full
text-sm
font-medium
${statusColor(vehicle.status)}
`}

>

{vehicle.status}

</span>


</td>



</tr>


))


}



</tbody>


</table>


</div>









{/* Mobile Cards */}


<div className="
md:hidden
space-y-4
mt-6
">


{

filteredVehicles.map(
(vehicle)=>(


<div

key={
vehicle._id ??
vehicle.vehicleNumber
}

className="
border
rounded-2xl
p-5
shadow-sm
"

>


<div className="
flex
justify-between
">


<div>


<h3 className="
font-bold
text-lg
">

{vehicle.vehicleNumber}

</h3>


<p className="
text-gray-500
text-sm
">

Driver:
{" "}
{getDriverName(
vehicle.driver
)}

</p>


</div>




<span

className={`
px-3
py-1
rounded-full
text-xs
${statusColor(vehicle.status)}
`}

>

{vehicle.status}

</span>


</div>






<div className="
grid
grid-cols-2
gap-4
mt-5
">


<div className="
bg-gray-50
rounded-lg
p-3
">

<p className="text-xs">
Speed
</p>

<b>
{vehicle.speed} km/h
</b>


</div>




<div className="
bg-gray-50
rounded-lg
p-3
">

<p className="text-xs">
Fuel
</p>

<b>
{vehicle.fuel}%
</b>


</div>


</div>


</div>



))


}



</div>





</div>


);


};



export default VehicleTable;