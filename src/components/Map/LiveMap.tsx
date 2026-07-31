import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";



// Fix leaflet marker icon issue


delete (L.Icon.Default.prototype as any)._getIconUrl;


L.Icon.Default.mergeOptions({

    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",

    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",

    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",

});





interface Vehicle {


    _id?:string;

    id?:number;

    vehicleNumber:string;

    driver:string;

    speed:number;

    fuel:number;

    status:
    | "Active"
    | "Idle"
    | "Offline";


    latitude:number;

    longitude:number;


}





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







const LiveMap =({

    vehicles,

    geofences=[]

}:Props)=>{





return(


<MapContainer


center={[

28.6139,

77.2090

]}


zoom={12}


style={{

height:"500px",

width:"100%"

}}



>


<TileLayer


url="
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
"


/>







{/* ================= VEHICLES ================= */}



{

vehicles.map(
(vehicle)=>(


<Marker


key={
vehicle._id ||
vehicle.id
}


position={[

vehicle.latitude,

vehicle.longitude

]}


>



<Popup>


<div>


<h3 className="font-bold">

{vehicle.vehicleNumber}

</h3>


<p>

Driver:
{vehicle.driver}

</p>


<p>

Speed:
{vehicle.speed} km/h

</p>



<p>

Fuel:
{vehicle.fuel}%

</p>



<p>

Status:
{vehicle.status}

</p>



</div>



</Popup>



</Marker>


)

)

}









{/* ================= GEOFENCE ================= */}




{

geofences.map(
(zone)=>(


<Circle


key={
zone._id
}


center={[

zone.center.latitude,

zone.center.longitude

]}



radius={
zone.radius
}


pathOptions={{

color:"blue",

fillOpacity:0.15

}}



>


<Popup>


<div>


<h3 className="font-bold">

{zone.name}

</h3>



<p>

Radius:
{zone.radius} meters

</p>



</div>


</Popup>



</Circle>



)

)

}





</MapContainer>


);


};



export default LiveMap;