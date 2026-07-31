import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";


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

}



const BarChart = ({
  labels,
  values,
}: Props) => {



const data = {


labels:

labels || [

"Jan",

"Feb",

"Mar",

"Apr",

"May",

"Jun",

],



datasets:[

{

label:"Trips",



data:

values || [

120,

150,

180,

210,

240,

280,

],




backgroundColor:[

"#2563eb",

"#16a34a",

"#f59e0b",

"#ef4444",

"#8b5cf6",

"#0ea5e9",

],



borderRadius:8,


}

]


};






const options = {


responsive:true,


maintainAspectRatio:false,



plugins:{



legend:{


display:false,


},


tooltip:{


backgroundColor:"#1f2937",


titleColor:"#ffffff",


bodyColor:"#ffffff",


padding:10,


}



},





scales:{



y:{


beginAtZero:true,


grid:{


color:"#e5e7eb",


},


},




x:{


grid:{


display:false,


},


},



}



};






return (

<div className="h-80">


<Bar

data={data}

options={options}

/>


</div>

);


};



export default BarChart;