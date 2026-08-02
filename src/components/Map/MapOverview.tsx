import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import {
  FaTruck,
  FaMapMarkerAlt,
  FaSyncAlt,
} from "react-icons/fa";



// Fix Leaflet default marker

delete (L.Icon.Default.prototype as any)._getIconUrl;


L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

});




// Vehicle Interface

interface Vehicle {


  _id?: string;


  vehicleNumber: string;


  driverName?: string;


  latitude: number;


  longitude: number;


  speed?: number;


  status: string;


}





const MapOverview = () => {



const [vehicles,setVehicles]
=
useState<Vehicle[]>([]);



const [loading,setLoading]
=
useState(true);



const [error,setError]
=
useState("");



const [refreshing,setRefreshing]
=
useState(false);






// Fetch Vehicles

const fetchVehicles = async()=>{


try{


setError("");



const response = await axios.get(

"http://localhost:5003/api/vehicles"

);



console.log(
"Vehicles:",
response.data
);



setVehicles(

response.data.vehicles ||

response.data

);



}

catch(error){


console.log(error);


setError(
"Vehicle data load failed"
);


}

finally{


setLoading(false);


}


};







// Initial Load + Auto Refresh

useEffect(()=>{


fetchVehicles();



const timer =
setInterval(()=>{


fetchVehicles();


},10000);



return ()=>{

clearInterval(timer);

};


},[]);







// Refresh Button

const refreshData = async()=>{


setRefreshing(true);


await fetchVehicles();


setRefreshing(false);


};







// Custom Marker

const vehicleIcon = (
status:string
)=>{


let color =
"red";



if(status==="Running")
{

color="green";

}



if(status==="Idle")
{

color="orange";

}





return L.divIcon({

className:"",

html:


`

<div style="

background:${color};

width:38px;

height:38px;

border-radius:50%;

display:flex;

align-items:center;

justify-content:center;

border:3px solid white;

box-shadow:0 0 8px gray;

">

🚚

</div>

`


});


};







return (

<div className="w-full space-y-4">



{/* Header */}

<div className="
flex
justify-between
items-center
">


<h2 className="
text-2xl
font-bold
">

Fleet Live Tracking

</h2>




<button

onClick={refreshData}

className="
bg-blue-600
text-white
px-4
py-2
rounded-lg
flex
items-center
gap-2
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
text-red-600
p-3
rounded-lg
">

{error}

</div>

}







<div className="
w-full
h-[500px]
rounded-xl
overflow-hidden
shadow-md
">





{

loading ?


<div className="
h-full
flex
items-center
justify-center
bg-gray-100
">

Loading Map...


</div>



:


<MapContainer


center={[

28.6692,

77.4538

]}


zoom={13}


scrollWheelZoom={true}


className="
w-full
h-full
"


>




<TileLayer


attribution="
&copy; OpenStreetMap contributors
"


url="
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
"


/>








{

vehicles.map(

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



icon={
vehicleIcon(
vehicle.status
)
}



>



<Popup>



<div className="
space-y-2
">


<h3 className="
font-bold
flex
items-center
gap-2
">


<FaTruck/>


{vehicle.vehicleNumber}



</h3>




<p>

Driver:

<strong>

{" "}

{

vehicle.driverName ||

"Not Assigned"

}

</strong>


</p>




<p className="
flex
items-center
gap-2
">


<FaMapMarkerAlt/>


Status:


<strong>

{

vehicle.status

}


</strong>


</p>




<p>

Speed:

<strong>

{" "}

{

vehicle.speed ||

0

}

km/h


</strong>


</p>



</div>



</Popup>




</Marker>


)

)


}





</MapContainer>



}



</div>





</div>

);


};



export default MapOverview;