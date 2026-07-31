import { useEffect, useState } from "react";

import { api } from "../../services/api";


interface Driver {
  fullName?: string;
}


interface Vehicle {

  _id:string;

  vehicleNumber:string;

  driver?: Driver | string;

  speed:number;

  fuel:number;

  status:string;

}




const VehicleTable = () => {


const [vehicles,setVehicles] = 
useState<Vehicle[]>([]);


const [loading,setLoading] =
useState<boolean>(true);


const [error,setError] =
useState("");





// ========================
// Fetch Vehicles
// ========================

const fetchVehicles = async()=>{


try{


setLoading(true);


const response =
await api.get("/vehicles");



console.log(
"Vehicle API Response:",
response.data
);



if(response.data.success){


setVehicles(
response.data.vehicles
);


}
else{


setVehicles([]);

}



setError("");



}
catch(error:any){


console.log(
"Vehicle Fetch Error:",
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








return (


<div className="bg-white rounded-xl shadow-md p-6">





<div className="flex justify-between items-center mb-5">


<h2 className="text-xl font-semibold">

Vehicle List

</h2>





<button

onClick={fetchVehicles}

className="
bg-blue-600 
hover:bg-blue-700
text-white
px-4
py-2
rounded-lg
"

>

Refresh

</button>



</div>







{
error &&

<div className="
text-red-500
mb-4
">

{error}

</div>

}






<div className="overflow-x-auto">


<table className="w-full">



<thead className="bg-gray-100">


<tr>


<th className="p-3 text-left">
Vehicle
</th>


<th className="p-3 text-left">
Driver
</th>


<th className="p-3 text-left">
Speed
</th>


<th className="p-3 text-left">
Fuel
</th>


<th className="p-3 text-left">
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
className="p-5 text-center"
>

Loading Vehicles...


</td>


</tr>



:



vehicles.length === 0 ?



<tr>


<td

colSpan={5}

className="p-5 text-center text-gray-500"

>

No Vehicles Found


</td>


</tr>



:



vehicles.map((vehicle)=>(



<tr

key={vehicle._id}

className="
border-t
hover:bg-gray-50
"



>





<td className="p-3 font-medium">

{vehicle.vehicleNumber}

</td>








<td className="p-3">


{

typeof vehicle.driver === "object"

?

vehicle.driver?.fullName || "N/A"

:

vehicle.driver || "N/A"

}



</td>







<td className="p-3">

{vehicle.speed || 0} km/h

</td>








<td className="p-3">

{vehicle.fuel || 0}%

</td>







<td className="p-3">


<span

className={

`
px-3
py-1
rounded-full
text-sm
font-medium

${
vehicle.status === "Active"

?

"bg-green-100 text-green-700"

:

vehicle.status === "Idle"

?

"bg-yellow-100 text-yellow-700"

:

"bg-red-100 text-red-700"

}

`

}


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





</div>


);


};



export default VehicleTable;