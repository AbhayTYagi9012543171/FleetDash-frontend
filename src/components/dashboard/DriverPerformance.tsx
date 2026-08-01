import { FaUserTie, FaStar } from "react-icons/fa";

import useDrivers from "../../hooks/useDrivers";
import type { Driver } from "../../services/driverService";


const DriverPerformance = () => {


const {
  drivers,
  loading
}=useDrivers();



if(loading){

return (

<div className="bg-white rounded-xl shadow-md p-6">

Loading Drivers...

</div>

);

}



return (

<div
className="
bg-white
rounded-xl
shadow-md
p-6
"
>


<h2
className="
text-xl
font-semibold
mb-6
"
>

Driver Performance

</h2>



<div className="space-y-4">


{
drivers.slice(0,5).map(
(driver: Driver,index:number)=>(


<div
key={driver._id}
className="
flex
items-center
justify-between
border-b
pb-4
"
>


<div className="flex items-center gap-4">


<div
className="
bg-blue-500
text-white
p-3
rounded-full
"
>

<FaUserTie />

</div>



<div>

<h3 className="font-semibold">

{index + 1}. {driver.fullName}

</h3>


<p className="text-sm text-gray-500">

Experience: {driver.experience} years

</p>


<p className="text-sm text-gray-500">

Status: {driver.status}

</p>


</div>


</div>



<div
className="
flex
items-center
gap-2
text-green-600
font-bold
"
>

<FaStar />

{driver.status === "Driving"
 ? "95%"
 : "85%"}


</div>



</div>


))

}



</div>



</div>

);

};


export default DriverPerformance;