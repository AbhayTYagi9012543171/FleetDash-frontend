import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";

import {
  useEffect,
  useMemo,
} from "react";

import type {
  Vehicle,
} from "../../types/vehicle";


import "leaflet/dist/leaflet.css";

import L from "leaflet";



// ==========================
// Leaflet Icon Fix
// ==========================


delete (L.Icon.Default.prototype as any)._getIconUrl;


L.Icon.Default.mergeOptions({

  iconRetinaUrl:
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",

  iconUrl:
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",

  shadowUrl:
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",

});




// ==========================
// Vehicle Icon
// ==========================


const vehicleIcon = new L.Icon({

  iconUrl:
  "https://cdn-icons-png.flaticon.com/512/744/744465.png",

  iconSize:[
    40,
    40
  ],

  iconAnchor:[
    20,
    20
  ],


});





// ==========================
// Geofence
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





interface Props {

 vehicles:Vehicle[];

 geofences?:Geofence[];

}








// ==========================
// Auto Center
// ==========================


const AutoCenter = ({
 vehicles,
}:{
 vehicles:Vehicle[];
})=>{


const map = useMap();



useEffect(()=>{


const validVehicle =
vehicles.find(
(v)=>
Number.isFinite(v.latitude)
&&
Number.isFinite(v.longitude)
);



if(validVehicle){


map.flyTo(

[
validVehicle.latitude,
validVehicle.longitude
],

12,

{
duration:1
}

);


}


},[vehicles,map]);



return null;


};










// ==========================
// Component
// ==========================


const LiveMap = ({

vehicles,

geofences=[],

}:Props)=>{





const validVehicles =
useMemo(()=>{


return vehicles.filter(

(v)=>

Number.isFinite(
Number(v.latitude)
)

&&

Number.isFinite(
Number(v.longitude)
)


);


},[vehicles]);






return (

<div

className="
relative
w-full
h-[350px]
sm:h-[450px]
lg:h-[600px]
rounded-2xl
overflow-hidden
border
shadow
"

>



{/* Counter */}


<div

className="
absolute
z-[1000]
top-4
left-4
bg-white
shadow-lg
rounded-xl
px-4
py-3
"

>


<p
className="
text-sm
text-gray-500
"
>

Live Vehicles

</p>


<h2
className="
text-xl
font-bold
text-blue-600
"
>

{validVehicles.length}

</h2>


</div>









<MapContainer


center={[
28.6139,
77.2090
]}


zoom={11}


className="
w-full
h-full
"


>


<AutoCenter
vehicles={validVehicles}
/>





<TileLayer


attribution="
&copy; OpenStreetMap
"


url="
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
"


/>








{
validVehicles.map(
(vehicle)=>(


<Marker

key={
vehicle._id ||
vehicle.vehicleNumber
}


position={[

vehicle.latitude,

vehicle.longitude

]}


icon={vehicleIcon}


>


<Popup>


<div
className="
min-w-[240px]
"
>


<h2
className="
font-bold
text-lg
text-blue-600
mb-3
"
>

🚚 {vehicle.vehicleNumber}

</h2>



<p>

<b>
Driver:
</b>

{" "}

{

typeof vehicle.driver==="object"

?

(vehicle.driver as any)
?.fullName

:

vehicle.driver

||

"Not Assigned"

}


</p>




<p>

<b>
Speed:
</b>

{" "}

{vehicle.speed}

km/h

</p>




<p>

<b>
Fuel:
</b>

{" "}

{vehicle.fuel}%

</p>




<p>

<b>
Status:
</b>

{" "}

<span

className={

vehicle.status==="Active"

?

"text-green-600 font-bold"

:

vehicle.status==="Idle"

?

"text-yellow-600 font-bold"

:

"text-red-600 font-bold"

}

>

{vehicle.status}

</span>


</p>



<hr
className="
my-2
"
/>


<p
className="
text-xs
text-gray-500
"
>

📍

{vehicle.latitude},

{vehicle.longitude}

</p>


</div>


</Popup>


</Marker>


)

)

}









{/* Geofences */}



{

geofences.map(

(zone)=>(


<Circle


key={zone._id}


center={[

zone.center.latitude,

zone.center.longitude

]}


radius={zone.radius}



pathOptions={{

color:"#2563eb",

fillOpacity:0.15

}}



>


<Popup>

<b>
{zone.name}
</b>


<br/>

Radius:

{" "}

{zone.radius}

meters


</Popup>



</Circle>


)

)

}







{

validVehicles.length===0 &&


<div

className="
absolute
inset-0
z-[999]
flex
items-center
justify-center
pointer-events-none
"

>


<div

className="
bg-white
shadow
rounded-xl
px-6
py-4
"

>


No vehicle location available


</div>


</div>


}




</MapContainer>







</div>


);


};



export default LiveMap;