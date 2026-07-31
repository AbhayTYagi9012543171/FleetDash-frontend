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

import { Line } from "react-chartjs-2";


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



const LineChart = ({
  labels,
  values,
}:Props) => {



const chartData = {

labels:
labels || [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun"
],


datasets:[

{

label:
"Running Vehicles",


data:
values || [
  80,
  92,
  88,
  105,
  95,
  115,
  98
],


borderColor:"#2563eb",


backgroundColor:
"rgba(37,99,235,0.15)",


fill:true,


tension:0.4,


pointRadius:5,


pointBackgroundColor:"#2563eb",


pointHoverRadius:7,


}

]


};






const options = {


responsive:true,


maintainAspectRatio:false,



plugins:{


legend:{


display:true,


position:"bottom" as const,


}


},




scales:{


y:{


beginAtZero:true,


grid:{


color:"#e5e7eb",


}


},



x:{


grid:{


display:false


}


}



}



};






return (

<div className="h-80">


<Line

data={chartData}

options={options}

/>


</div>

);


};



export default LineChart;