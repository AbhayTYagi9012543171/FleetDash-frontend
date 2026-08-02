import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  Doughnut,
} from "react-chartjs-2";

import type {
  ChartOptions,
} from "chart.js";

import type {
  Vehicle,
} from "../../types/vehicle";



ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);





interface Props {

  vehicles: Vehicle[];

}







const VehicleUtilizationChart = ({

  vehicles = [],

}: Props) => {





const active =
vehicles.filter(
(vehicle)=>vehicle.status==="Active"
).length;




const idle =
vehicles.filter(
(vehicle)=>vehicle.status==="Idle"
).length;





const maintenance =
vehicles.filter(
(vehicle)=>vehicle.status==="Maintenance"
).length;





const offline =
vehicles.filter(
(vehicle)=>vehicle.status==="Offline"
).length;






const total =
vehicles.length;






const availability =

total > 0

?
Math.round(
((active + idle) / total) * 100
)

:
0;







const data = {


labels:[

"Active",

"Idle",

"Maintenance",

"Offline",

],



datasets:[

{


data:[

active,

idle,

maintenance,

offline,

],



backgroundColor:[

"#22c55e",

"#facc15",

"#f97316",

"#ef4444",

],



borderColor:"#ffffff",


borderWidth:2,


hoverOffset:12,


}


]


};









const options:ChartOptions<"doughnut"> = {


responsive:true,


maintainAspectRatio:false,



cutout:"72%",




plugins:{



legend:{


position:"bottom",



labels:{


usePointStyle:true,


padding:20,


}


},




tooltip:{


padding:10,


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




{/* Header */}


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









{/* Status Cards */}


<div

className="
grid
grid-cols-2
lg:grid-cols-4
gap-4
mb-6
"

>


<StatusCard

title="Active"

value={active}

style="bg-green-50 text-green-600"

/>



<StatusCard

title="Idle"

value={idle}

style="bg-yellow-50 text-yellow-600"

/>



<StatusCard

title="Maintenance"

value={maintenance}

style="bg-orange-50 text-orange-600"

/>



<StatusCard

title="Offline"

value={offline}

style="bg-red-50 text-red-600"

/>


</div>









{
total === 0 ?


(

<div

className="
h-[420px]
flex
items-center
justify-center
text-gray-400
"

>

No Vehicle Data Available

</div>

)


:


(

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

)


}









{/* Footer Stats */}


<div

className="
grid
grid-cols-1
md:grid-cols-3
gap-4
mt-8
"

>


<InfoCard

title="Utilization Rate"

value="84%"

color="text-blue-600"

/>



<InfoCard

title="Running Vehicles"

value={String(active)}

color="text-green-600"

/>



<InfoCard

title="Service Due"

value={String(maintenance)}

color="text-orange-600"

/>



</div>






</div>

);


};









const StatusCard = ({

title,

value,

style,

}:{

title:string;

value:number;

style:string;

})=>(

<div

className={`
rounded-xl
p-4
${style}
`}

>


<p className="text-sm">

{title}

</p>


<h3

className="
text-3xl
font-bold
mt-2
"

>

{value}

</h3>


</div>

);








const InfoCard = ({

title,

value,

color,

}:{

title:string;

value:string;

color:string;

})=>(

<div

className="
bg-gray-50
rounded-xl
p-4
"

>


<p className="text-gray-500">

{title}

</p>


<h3

className={`
text-2xl
font-bold
${color}
`}

>

{value}

</h3>


</div>

);





export default VehicleUtilizationChart;