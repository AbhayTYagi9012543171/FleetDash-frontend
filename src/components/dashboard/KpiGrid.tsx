import React from "react";

import KpiCard from "../dashboard/kpiCard";

import {
  FaTruck,
  FaGasPump,
  FaUserTie,
  FaWallet,
  FaTools,
  FaCheckCircle,
} from "react-icons/fa";

import type { DashboardData } from "../../hooks/useDashboard";


interface Props {
  dashboard: DashboardData;
}


const KpiGrid: React.FC<Props> = ({ dashboard }) => {


const stats = [

{
 title:"Fleet Health",
 value:"92%",
 icon:FaTruck,
 color:"bg-green-500",
 description:"Healthy Vehicles"
},


{
 title:"Fuel Today",
 value:"640 L",
 icon:FaGasPump,
 color:"bg-yellow-500",
 description:"Fuel Consumed"
},


{
 title:"Active Drivers",
 value:String(dashboard.totalDrivers),
 icon:FaUserTie,
 color:"bg-blue-500",
 description:"Currently Working"
},


{
 title:"Today's Revenue",
 value:"₹1,24,000",
 icon:FaWallet,
 color:"bg-purple-500",
 description:"Total Earnings"
},


{
 title:"Vehicle Availability",
 value:`${dashboard.activeVehicles}/${dashboard.totalVehicles}`,
 icon:FaCheckCircle,
 color:"bg-cyan-500",
 description:"Ready To Use"
},


{
 title:"Maintenance Due",
 value:String(dashboard.totalAlerts),
 icon:FaTools,
 color:"bg-red-500",
 description:"Needs Service"
}

];



return (

<section className="w-full">

<div className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
gap-6
">

{
stats.map((item)=>(

<KpiCard

key={item.title}

title={item.title}

value={item.value}

icon={item.icon}

color={item.color}

description={item.description}

/>

))
}

</div>

</section>

);

};


export default KpiGrid;