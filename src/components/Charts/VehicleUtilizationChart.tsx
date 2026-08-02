import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";


ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);



interface Vehicle {

  _id?: string;

  id?: number;

  vehicleNumber?: string;

  driver?: string;

  speed?: number;

  fuel?: number;

  status:
    | "Active"
    | "Idle"
    | "Maintenance"
    | "Offline";

  latitude?: number;

  longitude?: number;

}


interface Props {

  vehicles: Vehicle[];

}





const VehicleUtilizationChart = ({
  vehicles = []
}: Props) => {



const active =
vehicles.filter(
(v)=>v.status==="Active"
).length;



const idle =
vehicles.filter(
(v)=>v.status==="Idle"
).length;



const maintenance =
vehicles.filter(
(v)=>v.status==="Maintenance"
).length;



const offline =
vehicles.filter(
(v)=>v.status==="Offline"
).length;



const total =
vehicles.length || 100;




const availability =
Math.round(
((active + idle) / total) * 100
);







const data = {


labels:[

"Active",
"Idle",
"Maintenance",
"Offline"

],


datasets:[

{

data:[

active,
idle,
maintenance,
offline

],

borderWidth:0,

hoverOffset:12,

}

]

};







const options = {


responsive:true,


maintainAspectRatio:false,


cutout:"72%",


plugins:{


legend:{


position:"bottom" as const,


labels:{


usePointStyle:true,


padding:20


}


}


}



};







return (

<div

className="
bg-white
rounded-2xl
shadow-lg
border
border-gray-200
p-6
"

>




<div
className="
flex
justify-between
items-center
mb-6
"
>


<div>


<h2

className="
text-2xl
font-bold
text-slate-800
"

>

Vehicle Utilization

</h2>


<p
className="
text-sm
text-gray-500
mt-1
"
>

Fleet availability and operational status

</p>


</div>




<div
className="
bg-green-50
px-5
py-3
rounded-xl
"
>

<p className="text-xs text-gray-500">

Availability

</p>


<h3
className="
text-2xl
font-bold
text-green-600
"
>

{availability}%

</h3>


</div>



</div>









<div
className="
grid
grid-cols-2
lg:grid-cols-4
gap-4
mb-6
"
>


<div className="bg-green-50 rounded-xl p-4">

<p className="text-gray-500 text-sm">

Active

</p>


<h3 className="text-3xl font-bold text-green-600">

{active}

</h3>

</div>





<div className="bg-yellow-50 rounded-xl p-4">


<p className="text-gray-500 text-sm">

Idle

</p>


<h3 className="text-3xl font-bold text-yellow-600">

{idle}

</h3>


</div>







<div className="bg-orange-50 rounded-xl p-4">


<p className="text-gray-500 text-sm">

Maintenance

</p>


<h3 className="text-3xl font-bold text-orange-600">

{maintenance}

</h3>


</div>







<div className="bg-red-50 rounded-xl p-4">


<p className="text-gray-500 text-sm">

Offline

</p>


<h3 className="text-3xl font-bold text-red-600">

{offline}

</h3>


</div>



</div>









<div
className="
relative
h-[420px]
"
>


<Doughnut

data={data}

options={options}

/>




<div

className="
absolute
inset-0
flex
flex-col
items-center
justify-center
pointer-events-none
"

>


<span className="text-gray-500">

Total Fleet

</span>



<h2
className="
text-5xl
font-bold
text-slate-800
"
>

{total}

</h2>



<p
className="
text-green-600
font-semibold
mt-2
"
>

{availability}% Available

</p>



</div>



</div>









<div
className="
grid
grid-cols-1
md:grid-cols-3
gap-4
mt-8
"
>


<div className="bg-gray-50 rounded-xl p-4">

<p className="text-gray-500">

Utilization Rate

</p>


<h3 className="text-2xl font-bold text-blue-600">

84%

</h3>


</div>





<div className="bg-gray-50 rounded-xl p-4">


<p className="text-gray-500">

Running Vehicles

</p>


<h3 className="text-2xl font-bold text-green-600">

{active}

</h3>


</div>





<div className="bg-gray-50 rounded-xl p-4">


<p className="text-gray-500">

Service Due

</p>


<h3 className="text-2xl font-bold text-orange-600">

{maintenance}

</h3>


</div>



</div>






</div>

);


};



export default VehicleUtilizationChart;