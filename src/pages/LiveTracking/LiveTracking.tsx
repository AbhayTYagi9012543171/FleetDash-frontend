import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiSearch,
  FiRefreshCw,
  FiMapPin,
  FiTruck,
  FiAlertTriangle,
} from "react-icons/fi";


import { api } from "../../services/api";

import { socket } from "../../services/socket";

import LiveMap from "../../components/Map/LiveMap";

import type { Vehicle } from "../../types/vehicle";




// ==========================
// Geofence Interface
// ==========================

interface Geofence {

  _id:string;

  name:string;

  center:{
    latitude:number;
    longitude:number;
  };

  radius:number;

}




const LiveTracking =()=>{


const [
vehicles,
setVehicles
]=
useState<Vehicle[]>([]);



const [
geofences,
setGeofences
]=
useState<Geofence[]>([]);



const [
loading,
setLoading
]=
useState(false);



const [
search,
setSearch
]=
useState("");



const [
status,
setStatus
]=
useState("All");



const [
lastUpdated,
setLastUpdated
]=
useState("");



const [
error,
setError
]=
useState("");






// ==========================
// Fetch Vehicles
// ==========================


const fetchVehicles =
async()=>{


try{


setLoading(true);

setError("");



const response =
await api.get("/vehicles");



let data:Vehicle[]=[];



if(
Array.isArray(response.data?.vehicles)
){

data=response.data.vehicles;

}

else if(
Array.isArray(response.data)
){

data=response.data;

}



setVehicles(data);



setLastUpdated(
new Date()
.toLocaleTimeString()
);



}

catch(err:any){


console.error(err);


setError(
"Unable to load vehicles"
);


setVehicles([]);


}

finally{


setLoading(false);


}


};









// ==========================
// Fetch Geofences
// ==========================


const fetchGeofences =
async()=>{


try{


const response =
await api.get("/geofences");



let data:Geofence[]=[];



if(
Array.isArray(response.data?.geofences)
){

data=response.data.geofences;

}

else if(
Array.isArray(response.data)
){

data=response.data;

}



setGeofences(data);



}

catch(error){


console.error(
"Geofence Error",
error
);


}



};









// ==========================
// Socket Connection
// ==========================


useEffect(()=>{


fetchVehicles();

fetchGeofences();



socket.connect();





socket.on(

"vehicleUpdate",

(updatedVehicle:Vehicle)=>{



setVehicles(
(prev)=>


prev.map(
(vehicle)=>

vehicle._id === updatedVehicle._id

?

{
...vehicle,
...updatedVehicle
}

:

vehicle

)

);



setLastUpdated(
new Date()
.toLocaleTimeString()
);



}

);





const interval =
setInterval(()=>{


fetchVehicles();


},30000);





return()=>{


socket.off(
"vehicleUpdate"
);


socket.disconnect();


clearInterval(interval);


};



},[]);









// ==========================
// Filter
// ==========================


const filteredVehicles =
useMemo(()=>{


return vehicles.filter(
(vehicle)=>{


const searchMatch =
vehicle.vehicleNumber
?.toLowerCase()
.includes(
search.toLowerCase()
);



const statusMatch =
status==="All"
||
vehicle.status===status;



return (
searchMatch &&
statusMatch
);


}

);


},[
vehicles,
search,
status
]);








// ==========================
// Stats
// ==========================


const total =
vehicles.length;



const active =
vehicles.filter(
v=>v.status==="Active"
).length;



const idle =
vehicles.filter(
v=>v.status==="Idle"
).length;



const maintenance =
vehicles.filter(
v=>v.status==="Maintenance"
).length;



const offline =
vehicles.filter(
v=>v.status==="Offline"
).length;










return (

<div className="space-y-6">





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

Live Tracking

</h1>


<p className="text-gray-500">

Real time fleet monitoring

</p>



{
lastUpdated &&

<p className="text-sm text-gray-400">

Updated:
{lastUpdated}

</p>

}


</div>





<button

onClick={fetchVehicles}

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


<FiRefreshCw/>

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
flex
gap-2
">

<FiAlertTriangle/>

{error}

</div>

}







{/* STATS */}


<div className="
grid
grid-cols-1
md:grid-cols-5
gap-5
">


<StatCard title="Total" value={total}/>

<StatCard
title="Active"
value={active}
color="text-green-600"
/>


<StatCard
title="Idle"
value={idle}
color="text-yellow-600"
/>


<StatCard
title="Maintenance"
value={maintenance}
color="text-orange-600"
/>


<StatCard
title="Offline"
value={offline}
color="text-red-600"
/>



</div>









{/* FILTER */}


<div className="
bg-white
p-5
rounded-xl
shadow
flex
gap-4
">


<div className="
flex
items-center
border
rounded-lg
px-3
flex-1
">


<FiSearch/>


<input

className="
w-full
p-3
outline-none
"

placeholder="
Search vehicle number
"

value={search}

onChange={
e=>setSearch(
e.target.value
)
}

/>


</div>





<select

value={status}

onChange={
e=>setStatus(
e.target.value
)
}

className="
border
rounded-lg
px-4
"

>

<option>
All
</option>

<option>
Active
</option>

<option>
Idle
</option>

<option>
Maintenance
</option>

<option>
Offline
</option>


</select>



</div>










{/* MAP */}



<div className="
bg-white
shadow
rounded-xl
p-5
">


<h2 className="
font-bold
text-xl
mb-4
flex
gap-2
">

<FiMapPin/>

Live Vehicle Map

</h2>



<LiveMap

vehicles={
filteredVehicles
}

geofences={
geofences
}

/>


</div>









{/* VEHICLE CARDS */}


<div className="
bg-white
rounded-xl
shadow
">


<h2 className="
text-xl
font-bold
p-5
border-b
">

Vehicles

</h2>





{
loading ?

<p className="p-5">

Loading vehicles...

</p>


:


filteredVehicles.length===0 ?

<p className="p-5 text-gray-500">

No vehicles found

</p>


:


filteredVehicles.map(
(vehicle)=>(


<div

key={
vehicle._id ??
vehicle.vehicleNumber
}

className="
p-5
border-b
"

>


<div className="
flex
justify-between
">


<div>


<h3 className="font-bold">

{vehicle.vehicleNumber}

</h3>


<p className="text-gray-500">

{
vehicle.driver ??
"Not Assigned"
}

</p>


</div>


<FiTruck/>


</div>



<p>
Speed:
{vehicle.speed ?? 0}
km/h
</p>



<p>
Fuel:
{vehicle.fuel ?? 0}%
</p>



<p>
Status:
<b>
{" "}
{vehicle.status}
</b>
</p>



</div>


)

)



}




</div>







</div>

);


};









const StatCard =({

title,

value,

color="text-gray-800"


}:{

title:string;

value:number;

color?:string;

})=>(


<div className="
bg-white
shadow
rounded-xl
p-5
">


<p className="text-gray-500">

{title}

</p>


<h2 className={`
text-3xl
font-bold
${color}
`}>

{value}

</h2>


</div>


);



export default LiveTracking;