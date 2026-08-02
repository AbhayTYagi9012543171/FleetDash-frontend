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



// ==========================
// Live Tracking
// ==========================

const LiveTracking = () => {


const [vehicles,setVehicles] =
useState<Vehicle[]>([]);


const [geofences,setGeofences] =
useState<Geofence[]>([]);


const [loading,setLoading] =
useState(false);


const [search,setSearch] =
useState("");


const [status,setStatus] =
useState("All");





// ==========================
// Fetch Vehicles
// ==========================

const fetchVehicles = async()=>{


try{


setLoading(true);


const response =
await api.get("/vehicles");



console.log(
"Vehicle Response:",
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



}
catch(error){


console.error(
"Vehicle Fetch Error:",
error
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


const fetchGeofences = async()=>{


try{


const response =
await api.get("/geofences");



console.log(
"Geofence Response:",
response.data
);



if(
Array.isArray(response.data.geofences)
){


setGeofences(
response.data.geofences
);


}

else if(
Array.isArray(response.data)
){


setGeofences(
response.data
);


}

else{


setGeofences([]);

}



}
catch(error){


console.error(
"Geofence Error:",
error
);


setGeofences([]);

}


};







// ==========================
// Socket
// ==========================


useEffect(()=>{


fetchVehicles();

fetchGeofences();



socket.connect();



socket.on(
"vehicleUpdate",
(updatedVehicle:Vehicle)=>{


setVehicles(
(previous)=>


previous.map(
(vehicle)=>


(
vehicle._id &&
updatedVehicle._id &&
vehicle._id === updatedVehicle._id
)

?


{

...vehicle,

...updatedVehicle

}


:

vehicle



)

);


}

);



return()=>{


socket.off(
"vehicleUpdate"
);


socket.disconnect();


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
.toLowerCase()
.includes(
search.toLowerCase()
);



const statusMatch =
status==="All" ||
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
// Statistics
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

<div className="flex justify-between items-center">


<div>


<h1 className="text-3xl font-bold">

Live Tracking

</h1>


<p className="text-gray-500">

Monitor fleet vehicles in real time

</p>


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
gap-2
items-center
"


>


<FiRefreshCw/>

Refresh


</button>



</div>









{/* STATS */}


<div className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-5
gap-5
">


<StatCard
title="Total"
value={total}
/>


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









{/* SEARCH */}



<div className="
bg-white
shadow
rounded-xl
p-5
flex
gap-4
">


<div className="
border
rounded-lg
flex
items-center
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

placeholder="Search vehicle"

value={search}

onChange={
e=>setSearch(e.target.value)
}

/>


</div>



<select

className="
border
rounded-lg
px-4
"

value={status}

onChange={
e=>setStatus(e.target.value)
}

>


<option value="All">
All
</option>


<option value="Active">
Active
</option>


<option value="Idle">
Idle
</option>


<option value="Maintenance">
Maintenance
</option>


<option value="Offline">
Offline
</option>


</select>



</div>










{/* MAP */}


<div className="
bg-white
shadow
rounded-xl
p-4
">


<div className="
flex
gap-2
mb-4
">


<FiMapPin/>


<h2 className="text-xl font-bold">

Live Vehicle Map

</h2>


</div>




<LiveMap

vehicles={filteredVehicles}

geofences={geofences}

/>



</div>









{/* VEHICLE LIST */}



<div className="
bg-white
shadow
rounded-xl
">


<h2 className="
text-xl
font-bold
p-4
border-b
">

Vehicles

</h2>




{
loading &&

<p className="p-4">

Loading vehicles...

</p>

}





{
filteredVehicles.map(
(vehicle)=>(


<div

key={
vehicle._id ??
vehicle.id ??
vehicle.vehicleNumber
}

className="
p-4
border-b
"


>


<div className="flex justify-between">


<div>


<h3 className="font-bold">

{vehicle.vehicleNumber}

</h3>


<p className="text-gray-500">

{vehicle.driver ?? "Not Assigned"}

</p>


</div>



<FiTruck/>


</div>




<p>
Speed : {vehicle.speed} km/h
</p>


<p>
Fuel : {vehicle.fuel}%
</p>


<p>
Status :
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







// ==========================
// Stat Card
// ==========================


const StatCard =({

title,

value,

color="text-gray-800"


}:{

title:string;

value:number;

color?:string;

})=>{


return (

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


};




export default LiveTracking;