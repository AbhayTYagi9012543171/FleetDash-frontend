import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import { api } from "../../services/api";




// ===============================
// Fix Leaflet Icon
// ===============================

delete (L.Icon.Default.prototype as any)._getIconUrl;


L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",

});





// ===============================
// Interface
// ===============================

interface Vehicle {


  _id:string;


  vehicleNumber:string;


  driver?:string;


  latitude:number;


  longitude:number;


  speed:number;


  fuel:number;


  status:string;


}






const LiveMap = () => {



const [vehicles,setVehicles] =
useState<Vehicle[]>([]);



const [loading,setLoading] =
useState(false);





// ===============================
// Fetch Live Tracking
// ===============================


const fetchTracking = async()=>{


try{


setLoading(true);



const response =
await api.get("/tracking");



console.log(
"Tracking API Response:",
response.data
);




let vehicleData:Vehicle[]=[];



if(
Array.isArray(response.data)
){

vehicleData=response.data;

}



else if(
Array.isArray(response.data.vehicles)
){

vehicleData=response.data.vehicles;

}



else if(
Array.isArray(response.data.tracking)
){

vehicleData=response.data.tracking;

}





setVehicles(vehicleData);



}


catch(error){


console.error(
"Tracking Error:",
error
);


setVehicles([]);


}


finally{


setLoading(false);


}


};








useEffect(()=>{


fetchTracking();



const interval =
setInterval(
fetchTracking,
10000
);



return ()=>clearInterval(interval);



},[]);









return (


<div className="w-full">



{
loading &&

<p className="text-sm text-gray-500 mb-2">

Updating vehicle location...

</p>

}







{
vehicles.length===0 && !loading &&

<div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500 mb-3">

No live vehicles available

</div>

}







<MapContainer


center={[
28.6139,
77.2090
]}


zoom={11}


scrollWheelZoom={true}


style={{

height:"450px",

width:"100%",

borderRadius:"12px"

}}



>



<TileLayer

url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"

/>






{

vehicles.map((vehicle)=>(



<Marker


key={vehicle._id}


position={[

vehicle.latitude || 28.6139,

vehicle.longitude || 77.2090

]}



>





<Popup>



<div className="space-y-2">


<h3 className="font-bold text-lg">

🚚 {vehicle.vehicleNumber}

</h3>




<p>

Driver:
{" "}
{vehicle.driver || "N/A"}

</p>





<p>

Speed:
{" "}
{vehicle.speed || 0} km/h

</p>





<p>

Fuel:
{" "}
{vehicle.fuel || 0} %

</p>





<p>

Status:

{" "}

<span

className={

vehicle.status==="Active"

?
"text-green-600 font-semibold"

:
"text-red-600 font-semibold"

}

>

{vehicle.status}

</span>


</p>





</div>



</Popup>





</Marker>



))


}






</MapContainer>







</div>


);



};


export default LiveMap;