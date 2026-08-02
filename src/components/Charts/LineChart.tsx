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
  Line
} from "react-chartjs-2";

import type {
  ChartOptions
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

  title?: string;

  label?: string;

}





const LineChart = ({

  labels,

  values,

  title = "Vehicle Activity",

  label = "Running Vehicles",

}: Props) => {





const chartData = {


  labels:
    labels ??
    [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ],



  datasets:[

    {

      label,


      data:
        values ??
        [
          80,
          92,
          88,
          105,
          95,
          115,
          98,
        ],



      borderColor:
        "#2563eb",



      backgroundColor:
        "rgba(37,99,235,0.15)",



      fill:true,



      tension:0.4,



      pointRadius:5,



      pointHoverRadius:7,



      pointBackgroundColor:
        "#2563eb",



      pointBorderColor:
        "#ffffff",



      pointBorderWidth:2,


    }

  ]

};







const options:ChartOptions<"line"> = {


  responsive:true,


  maintainAspectRatio:false,



  plugins:{


    legend:{


      display:true,


      position:"bottom",


      labels:{


        boxWidth:14,


        padding:15,


      }


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
h-[350px]
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

Weekly fleet performance monitoring

</p>


</div>






<div

className="
h-[260px]
"

>


<Line

data={chartData}

options={options}

/>


</div>






</div>


);


};





export default LineChart;