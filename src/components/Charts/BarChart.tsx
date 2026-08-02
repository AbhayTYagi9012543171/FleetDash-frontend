import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  Bar,
} from "react-chartjs-2";

import type {
  ChartOptions,
} from "chart.js";



ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);





interface Props {

  labels?: string[];

  values?: number[];

  title?: string;

  label?: string;

}





const BarChart = ({

  labels,

  values,

  title = "Monthly Trips",

  label = "Trips",

}: Props) => {




const data = {


  labels:
    labels ??
    [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ],



  datasets:[

    {

      label,

      data:
        values ??
        [
          120,
          150,
          180,
          210,
          240,
          280,
        ],



      backgroundColor:

        [
          "#2563eb",
          "#16a34a",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#0ea5e9",
        ],



      borderRadius:8,


      maxBarThickness:40,


    }

  ]


};







const options:ChartOptions<"bar"> = {


  responsive:true,


  maintainAspectRatio:false,



  plugins:{


    legend:{


      display:false,


    },



    tooltip:{


      enabled:true,


      padding:10,


    }


  },







  scales:{


    y:{


      beginAtZero:true,


      ticks:{


        precision:0,


      },


      grid:{


        color:"#e5e7eb",


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
p-5
w-full
"

>



<div className="mb-4">


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

Monthly trip performance analytics

</p>


</div>






<div

className="
h-[300px]
"

>


<Bar

data={data}

options={options}

/>


</div>






</div>

);


};





export default BarChart;