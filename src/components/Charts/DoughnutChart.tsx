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

import {
  useMemo,
} from "react";



ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);





interface Props {

  running?: number;

  offline?: number;

  maintenance?: number;

  title?: string;

}





const DoughnutChart = ({

  running = 98,

  offline = 22,

  maintenance = 10,

  title = "Vehicle Status",

}: Props) => {





const total =
  running +
  offline +
  maintenance;





const data = useMemo(() => ({


  labels:[

    "Running",

    "Offline",

    "Maintenance",

  ],



  datasets:[

    {

      label:"Vehicle Status",


      data:[

        running,

        offline,

        maintenance,

      ],



      backgroundColor:[

        "#22c55e",

        "#ef4444",

        "#f59e0b",

      ],



      borderColor:"#ffffff",


      borderWidth:2,


      hoverOffset:10,


    }

  ]


}),[
  running,
  offline,
  maintenance
]);








const options:ChartOptions<"doughnut"> = {


  responsive:true,


  maintainAspectRatio:false,



  cutout:"70%",



  plugins:{



    legend:{


      position:"bottom",



      labels:{


        boxWidth:14,


        padding:16,


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
w-full
"

>



{/* Header */}

<div className="mb-5">


<h2

className="
text-xl
font-bold
text-slate-800
"

>

{title}

</h2>


<p

className="
text-sm
text-gray-500
"

>

Real-time vehicle availability

</p>


</div>








<div

className="
relative
h-[300px]
"

>


<Doughnut

data={data}

options={options}

/>




{/* Center Value */}

<div

className="
absolute
inset-0
flex
items-center
justify-center
pointer-events-none
"

>

<div className="text-center">


<h3

className="
text-3xl
font-bold
text-slate-800
"

>

{total}

</h3>



<p

className="
text-xs
text-gray-500
"

>

Vehicles

</p>


</div>


</div>






</div>







</div>

);


};





export default DoughnutChart;