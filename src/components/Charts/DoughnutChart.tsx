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



interface Props {

  running?: number;

  offline?: number;

  maintenance?: number;

}



const DoughnutChart = ({
  running = 98,
  offline = 22,
  maintenance = 10,
}: Props) => {



const data = {


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

maintenance

],



backgroundColor:[

"#22c55e",

"#ef4444",

"#f59e0b",

],



borderColor:"#ffffff",


borderWidth:2,


hoverOffset:12,


}

]


};







const options = {


responsive:true,


maintainAspectRatio:false,



plugins:{



legend:{


position:"bottom" as const,


labels:{


boxWidth:15,


padding:20,


font:{


size:14,


},


},


},




tooltip:{


backgroundColor:"#1f2937",


titleColor:"#ffffff",


bodyColor:"#ffffff",


padding:10,


}




},



cutout:"70%",



};





return (


<div className="h-80 w-full">


<Doughnut

data={data}

options={options}

/>


</div>


);


};



export default DoughnutChart;