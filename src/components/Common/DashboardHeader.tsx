import {
  FaTruck,
  FaTools,
  FaCheckCircle,
  FaSyncAlt,
  FaUserCircle,
  FaHeartbeat,
  FaGasPump,
} from "react-icons/fa";

import { useAppSelector } from "../../redux/hooks";

import type { DashboardData } from "../../hooks/useDashboard";


interface DashboardHeaderProps {

  dashboard: DashboardData;

  lastUpdated?: string;

  onRefresh?: () => void;

  refreshing?: boolean;

}



const DashboardHeader = ({
  dashboard,
  lastUpdated,
  onRefresh,
  refreshing
}: DashboardHeaderProps) => {



const user = useAppSelector(
(state)=>state.auth.user
);



const hour = new Date().getHours();



const greeting =
hour < 12
?
"Good Morning"
:
hour < 18
?
"Good Afternoon"
:
"Good Evening";





return (

<div
className="
bg-white
rounded-2xl
shadow-sm
border
border-gray-100
p-6
mb-6
"
>


{/* TOP HEADER */}

<div
className="
flex
flex-col
xl:flex-row
xl:items-center
xl:justify-between
gap-6
"
>


<div>


<h1
className="
text-3xl
font-bold
text-slate-800
"
>

{greeting}, {user?.username || "Abhay"} 👋

</h1>


<p
className="
text-gray-500
mt-2
"
>

Fleet Management Control Center

</p>


<p
className="
text-sm
text-gray-400
mt-1
"
>

Real-time fleet monitoring & operations dashboard

</p>


</div>





<div
className="
flex
items-center
gap-4
flex-wrap
"
>



{/* Fleet Health */}

<div
className="
bg-green-50
px-5
py-3
rounded-xl
flex
items-center
gap-3
"
>


<FaHeartbeat
className="
text-green-600
text-2xl
"
/>


<div>

<p className="
text-xs
text-gray-500
">

Fleet Health

</p>


<p className="
font-bold
text-green-600
">

92% Excellent

</p>


</div>


</div>






{/* Fuel */}

<div
className="
bg-purple-50
px-5
py-3
rounded-xl
flex
items-center
gap-3
"
>


<FaGasPump
className="
text-purple-600
text-2xl
"
/>


<div>

<p className="
text-xs
text-gray-500
">

Fuel Today

</p>


<p className="
font-bold
text-purple-600
">

640 L

</p>


</div>


</div>







{/* Sync */}

<div
className="
bg-gray-50
px-5
py-3
rounded-xl
"
>


<p className="
text-xs
text-gray-500
">

Last Sync

</p>


<p className="
font-bold
text-slate-800
"
>

{lastUpdated || "--"}

</p>


</div>







{/* Refresh Button */}

<button

onClick={onRefresh}

disabled={refreshing}

className="
bg-blue-600
hover:bg-blue-700
text-white
px-5
py-3
rounded-xl
flex
items-center
gap-2
font-semibold
transition
"

>


<FaSyncAlt

className={
refreshing
?
"animate-spin"
:
""
}

/>


{
refreshing
?
"Refreshing"
:
"Refresh"
}


</button>







{/* USER */}

<div
className="
flex
items-center
gap-3
bg-gray-50
px-4
py-3
rounded-xl
"
>


<FaUserCircle

className="
text-3xl
text-gray-500
"

/>


<div>


<p className="
font-bold
text-slate-800
">

{user?.username || "Abhay"}

</p>


<p className="
text-sm
text-gray-500
">

{user?.role || "Administrator"}

</p>


</div>


</div>





</div>


</div>







{/* FLEET OVERVIEW CARDS */}


<div
className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-4
gap-5
mt-8
"
>





{/* Total Vehicles */}

<div
className="
bg-blue-50
rounded-xl
p-5
flex
items-center
gap-4
"
>


<div
className="
bg-blue-600
text-white
p-4
rounded-full
"
>

<FaTruck/>

</div>


<div>

<h2
className="
text-3xl
font-bold
text-slate-800
"
>

{dashboard.totalVehicles || 0}

</h2>


<p className="
text-gray-600
">

Total Vehicles

</p>


</div>


</div>







{/* Active Vehicles */}

<div
className="
bg-green-50
rounded-xl
p-5
flex
items-center
gap-4
"
>


<div
className="
bg-green-600
text-white
p-4
rounded-full
"
>

<FaCheckCircle/>

</div>


<div>

<h2
className="
text-3xl
font-bold
text-slate-800
"
>

{dashboard.activeVehicles || 0}

</h2>


<p className="
text-gray-600
">

Active Vehicles

</p>


</div>


</div>







{/* Maintenance */}

<div
className="
bg-orange-50
rounded-xl
p-5
flex
items-center
gap-4
"
>


<div
className="
bg-orange-500
text-white
p-4
rounded-full
"
>

<FaTools/>

</div>


<div>

<h2
className="
text-3xl
font-bold
text-slate-800
"
>

{dashboard.totalAlerts || 0}

</h2>


<p className="
text-gray-600
">

Maintenance Due

</p>


</div>


</div>








{/* Drivers */}

<div
className="
bg-cyan-50
rounded-xl
p-5
flex
items-center
gap-4
"
>


<div
className="
bg-cyan-600
text-white
p-4
rounded-full
"
>

<FaUserCircle/>

</div>


<div>


<h2
className="
text-3xl
font-bold
text-slate-800
"
>

{dashboard.totalDrivers || 0}

</h2>


<p className="
text-gray-600
">

Active Drivers

</p>


</div>


</div>






</div>



</div>


);


};


export default DashboardHeader;