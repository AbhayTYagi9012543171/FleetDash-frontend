import {
  FaTruck,
  FaTools,
  FaCheckCircle,
  FaSyncAlt,
  FaUserCircle,
  FaHeartbeat,
} from "react-icons/fa";

import { useAppSelector } from "../../redux/hooks";


interface DashboardHeaderProps {

  lastUpdated?: string;

  onRefresh?:()=>void;

  refreshing?:boolean;

}



const DashboardHeader = ({
lastUpdated,
onRefresh,
refreshing
}:DashboardHeaderProps)=>{


const user =
useAppSelector(
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
p-6
mb-6
"
>


{/* TOP SECTION */}

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


</div>






<div
className="
flex
items-center
gap-4
flex-wrap
"
>


{/* HEALTH */}

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

<p
className="
text-xs
text-gray-500
"
>
Fleet Health
</p>


<p
className="
font-bold
text-green-600
"
>
92% Excellent
</p>


</div>


</div>





{/* SYNC */}

<div
className="
bg-gray-50
px-5
py-3
rounded-xl
"
>


<p
className="
text-xs
text-gray-500
"
>

Last Sync

</p>


<p
className="
font-bold
"
>

{lastUpdated || "--"}

</p>


</div>





<button

onClick={onRefresh}

disabled={refreshing}

className="
bg-blue-600
text-white
px-5
py-3
rounded-xl
flex
items-center
gap-2
font-semibold
hover:bg-blue-700
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

<p
className="
font-bold
"
>

{user?.username || "Abhay"}

</p>


<p
className="
text-sm
text-gray-500
"
>

{user?.role || "Administrator"}

</p>


</div>


</div>



</div>


</div>







{/* FLEET OVERVIEW */}


<div
className="
grid
grid-cols-1
md:grid-cols-3
gap-5
mt-8
"
>


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
"
>

124

</h2>


<p>
Total Vehicles
</p>

</div>


</div>






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
"
>

98

</h2>


<p>
Active Vehicles
</p>


</div>


</div>






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
"
>

12

</h2>


<p>
Maintenance Due
</p>


</div>


</div>



</div>




</div>


);


};


export default DashboardHeader;