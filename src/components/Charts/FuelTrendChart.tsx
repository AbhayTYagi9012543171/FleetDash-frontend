import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import {
  Line,
} from "react-chartjs-2";

import {
  useMemo,
} from "react";

import type {
  ChartOptions,
} from "chart.js";



ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);





interface Props {

  labels?: string[];

  values?: number[];

}






const FuelTrendChart = ({

  labels,

  values,

}: Props) => {




const chartLabels =
  labels ??
  [
    "Week 1",
    "Week 2",
    "Week 3",
    "Week 4",
  ];



const fuelData =
  values ??
  [
    450,
    520,
    480,
    600,
  ];





const totalFuel =
  fuelData.reduce(
    (sum,value)=>sum+value,
    0
  );



const averageFuel =
  Math.round(
    totalFuel / fuelData.length
  );







const data = useMemo(

()=>({


labels:chartLabels,


datasets:[

{

label:
"Fuel Consumption (Liters)",


data:fuelData,


fill:true,


tension:0.4,


borderWidth:3,


pointRadius:5,


pointHoverRadius:7,


borderColor:"#16a34a",


backgroundColor:
"rgba(22,163,74,0.15)",


}

]


}),

[
 chartLabels,
 fuelData
]

);









const options:ChartOptions<"line"> = {


responsive:true,


maintainAspectRatio:false,



plugins:{


legend:{


display:true,


position:"bottom",


},




tooltip:{


callbacks:{


label:(context)=>{


return `${context.raw} L consumed`;


}


}


}


},





scales:{



y:{


beginAtZero:true,


ticks:{


callback:(value)=>{


return `${value} L`;


}


}


},



x:{


grid:{


display:false,


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



{/* Header */}

<div className="mb-6">


<h2

className="
text-2xl
font-bold
text-slate-800
"

>

Fuel Consumption Trend

</h2>



<p

className="
text-sm
text-gray-500
mt-1
"

>

Weekly fuel usage monitoring

</p>


</div>









{/* Summary Cards */}


<div

className="
grid
grid-cols-1
md:grid-cols-3
gap-5
mb-6
"

>




<div

className="
bg-green-50
rounded-xl
p-5
"

>

<p className="text-sm text-gray-500">

Total Fuel Used

</p>


<h3

className="
text-3xl
font-bold
text-green-700
mt-2
"

>

{totalFuel} L

</h3>


<span className="text-green-600 font-semibold">

+6.8%

</span>


</div>







<div

className="
bg-blue-50
rounded-xl
p-5
"

>


<p className="text-sm text-gray-500">

Average / Week

</p>


<h3

className="
text-3xl
font-bold
text-blue-700
mt-2
"

>

{averageFuel} L

</h3>


<span className="text-blue-600 font-semibold">

Stable

</span>


</div>







<div

className="
bg-orange-50
rounded-xl
p-5
"

>


<p className="text-sm text-gray-500">

Fuel Efficiency

</p>


<h3

className="
text-3xl
font-bold
text-orange-600
mt-2
"

>

14.8 km/L

</h3>


<span className="text-green-600 font-semibold">

Excellent

</span>


</div>





</div>









{/* Chart */}


<div

className="
h-96
"

>


<Line

data={data}

options={options}

/>


</div>






</div>

);


};



export default FuelTrendChart;