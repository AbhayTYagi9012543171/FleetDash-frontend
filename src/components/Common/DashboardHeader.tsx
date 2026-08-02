import {
  FaTruck,
  FaTools,
  FaCheckCircle,
  FaSyncAlt,
  FaUserCircle,
  FaHeartbeat,
  FaGasPump,
  FaBell,
  FaSearch,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";


import {
  useAppSelector,
} from "../../redux/hooks";


import type {
  DashboardData,
} from "../../hooks/useDashboard";



interface DashboardHeaderProps {

  dashboard?: DashboardData;

  lastUpdated?: string;

  onRefresh?: () => void;

  refreshing?: boolean;

}



const DashboardHeader = ({
  dashboard,
  lastUpdated,
  onRefresh,
  refreshing,
}: DashboardHeaderProps) => {


  const navigate = useNavigate();


  const user = useAppSelector(
    (state)=>state.auth.user
  );



  const [currentTime,setCurrentTime] =
  useState(
    new Date()
  );


  const [search,setSearch] =
  useState("");




  useEffect(()=>{


    const timer =
    setInterval(()=>{

      setCurrentTime(
        new Date()
      );

    },1000);



    return()=>clearInterval(timer);


  },[]);





  const hour =
  currentTime.getHours();



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





  const today =
  currentTime.toLocaleDateString(
    "en-IN",
    {
      weekday:"long",
      day:"numeric",
      month:"long",
      year:"numeric",
    }
  );




  const clock =
  currentTime.toLocaleTimeString(
    "en-IN",
    {
      hour:"2-digit",
      minute:"2-digit",
      second:"2-digit",
    }
  );





  const totalVehicles =
  dashboard?.totalVehicles || 0;


  const activeVehicles =
  dashboard?.activeVehicles || 0;


  const totalDrivers =
  dashboard?.totalDrivers || 0;


  const totalAlerts =
  dashboard?.totalAlerts || 0;




  const fleetHealth =
  totalVehicles > 0
  ?
  Math.round(
    (activeVehicles /
    totalVehicles) * 100
  )
  :
  0;




  return (

<div
className="
bg-gradient-to-r
from-slate-900
via-blue-900
to-indigo-900
rounded-3xl
shadow-xl
p-6
text-white
mb-8
"
>


<div
className="
flex
flex-col
xl:flex-row
justify-between
gap-8
"
>



{/* LEFT SECTION */}


<div className="flex-1">


<h1
className="
text-4xl
font-bold
"
>

{greeting},{" "}

<span
className="
text-cyan-300
"
>

{user?.username || "Admin"}

</span>

👋

</h1>



<p
className="
mt-3
text-blue-100
text-lg
"
>

Fleet Management Control Center

</p>



<p
className="
text-blue-200
mt-2
"
>

Monitor vehicles, drivers and fleet performance
in real time.

</p>




<div
className="
flex
flex-wrap
gap-6
mt-6
"
>


<div className="flex items-center gap-2">

<FaCalendarAlt
className="text-cyan-300"
/>

<span>
{today}
</span>

</div>



<div className="flex items-center gap-2">

<FaClock
className="text-cyan-300"
/>

<span>
{clock}
</span>

</div>


</div>


</div>







{/* RIGHT SECTION */}



<div
className="
flex
flex-col
gap-4
"
>



<div className="relative">


<FaSearch
className="
absolute
left-4
top-1/2
-translate-y-1/2
text-gray-400
"
/>


<input

value={search}

onChange={
(e)=>setSearch(e.target.value)
}

placeholder="Search vehicles, drivers..."

className="
w-full
xl:w-96
bg-white
text-slate-700
rounded-xl
pl-12
pr-4
py-3
outline-none
"

/>


</div>





<div
className="
flex
flex-wrap
gap-3
"
>



<button

onClick={()=>
navigate("/alerts")
}

className="
relative
bg-white/20
p-3
rounded-xl
hover:bg-white/30
"

>


<FaBell
className="text-xl"
/>


<span
className="
absolute
-top-1
-right-1
bg-red-500
rounded-full
h-5
w-5
text-xs
flex
items-center
justify-center
"
>

{totalAlerts}

</span>


</button>






<button

onClick={onRefresh}

disabled={refreshing}

className="
flex
items-center
gap-2
bg-cyan-500
px-5
py-3
rounded-xl
font-semibold
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
"Refreshing..."
:
"Refresh"
}


</button>







<div
className="
flex
items-center
gap-3
bg-white/20
rounded-xl
px-4
py-2
"
>


<FaUserCircle
className="text-4xl"
/>


<div>

<h3 className="font-semibold">

{user?.username || "Admin"}

</h3>


<p className="text-sm text-blue-100">

{user?.role || "Administrator"}

</p>


</div>


</div>



</div>


</div>


</div>








{/* QUICK INFO */}


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

icon={<FaHeartbeat/>}

title="Fleet Health"

value={`${fleetHealth}%`}

/>



<InfoCard

icon={<FaGasPump/>}

title="Fuel Today"

value="640 L"

/>



<InfoCard

icon={<FaClock/>}

title="Last Sync"

value={lastUpdated || "--"}

/>


</div>








{/* KPI CARDS */}


<div
className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-4
gap-6
mt-8
"
>


<KPICard

title="Total Vehicles"

value={totalVehicles}

icon={<FaTruck/>}

color="blue"

/>



<KPICard

title="Active Vehicles"

value={activeVehicles}

icon={<FaCheckCircle/>}

color="green"

/>



<KPICard

title="Maintenance Due"

value={totalAlerts}

icon={<FaTools/>}

color="orange"

/>



<KPICard

title="Drivers"

value={totalDrivers}

icon={<FaUserCircle/>}

color="cyan"

/>



</div>




</div>

  );

};





const InfoCard = ({
icon,
title,
value
}:any)=>(
<div
className="
bg-white/10
rounded-2xl
p-5
flex
items-center
gap-4
"
>

<div className="text-3xl text-cyan-300">

{icon}

</div>


<div>

<p className="text-sm text-blue-100">

{title}

</p>

<h3 className="text-3xl font-bold">

{value}

</h3>

</div>


</div>
);






const KPICard = ({
title,
value,
icon,
color
}:any)=>(

<div
className="
bg-white
rounded-2xl
p-6
shadow-lg
"
>


<div
className="
flex
justify-between
items-center
"
>


<div>

<p className="text-gray-500">

{title}

</p>


<h2 className="text-4xl font-bold text-slate-800">

{value}

</h2>


</div>



<div
className={`
h-16
w-16
rounded-2xl
flex
items-center
justify-center
text-3xl

${
color==="blue"
?
"bg-blue-100 text-blue-600"
:
color==="green"
?
"bg-green-100 text-green-600"
:
color==="orange"
?
"bg-orange-100 text-orange-600"
:
"bg-cyan-100 text-cyan-600"
}

`}
>

{icon}

</div>



</div>


</div>


);



export default DashboardHeader;