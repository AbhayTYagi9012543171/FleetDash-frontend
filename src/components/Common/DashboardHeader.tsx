import {
  FaTruck,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

import {
  useEffect,
  useState,
} from "react";

import { useAppSelector } from "../../redux/hooks";


interface DashboardHeaderProps {

  lastUpdated:string;

  onRefresh:()=>void;

  refreshing:boolean;

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



const [
  now,
  setNow
]=useState(
new Date()
);



useEffect(()=>{


const timer =
setInterval(()=>{

setNow(
new Date()
);

},1000);



return ()=>clearInterval(timer);


},[]);





return (

<div className="
mb-6
sm:mb-8
w-full
overflow-hidden
">



{/* TOP HEADER */}

<div className="
flex
flex-col
lg:flex-row
lg:items-center
lg:justify-between
gap-5
">



<div>

<h1 className="
text-2xl
sm:text-3xl
md:text-4xl
font-bold
text-slate-800
">

Dashboard

</h1>



<p className="
text-sm
sm:text-base
text-gray-500
mt-1
">

Welcome back, {user?.username || "User"} 👋

</p>


</div>





{/* RIGHT SIDE */}

<div className="
flex
items-center
gap-3
flex-wrap
justify-end
">





{/* Last Updated */}

<div className="
bg-white
shadow
rounded-xl
px-4
py-3
">


<p className="
text-xs
text-gray-500
">

Last Updated

</p>


<p className="
font-semibold
text-gray-800
">

{
lastUpdated || 
now.toLocaleTimeString()
}

</p>


</div>





{/* Refresh */}

<button

onClick={onRefresh}

disabled={refreshing}

className="
bg-blue-600
hover:bg-blue-700
disabled:bg-blue-300
text-white
px-5
py-3
rounded-xl
font-semibold
transition
"

>

{

refreshing
?
"Refreshing..."
:
"Refresh"

}

</button>






{/* User */}

<div className="
bg-white
shadow
rounded-xl
px-5
py-3
">


<p className="
font-bold
">

{
user?.username || "Abhay"
}

</p>


<p className="
text-sm
text-gray-500
">

{
user?.role || "Admin"
}

</p>


</div>




</div>


</div>









{/* SUMMARY CARDS */}

<div className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-4
gap-4
sm:gap-6
mt-6
">





{/* Vehicles */}

<div className="
bg-white
rounded-xl
shadow
p-5
flex
items-center
gap-4
">


<div className="
bg-green-100
p-4
rounded-full
">


<FaTruck className="
text-green-600
text-xl
"/>


</div>


<div>

<h3 className="
font-bold
text-2xl
">

128

</h3>


<p className="
text-gray-500
">

Online Vehicles

</p>


</div>


</div>







{/* Location */}

<div className="
bg-white
rounded-xl
shadow
p-5
flex
items-center
gap-4
">


<div className="
bg-blue-100
p-4
rounded-full
">

<FaMapMarkerAlt
className="
text-blue-600
text-xl
"
/>


</div>


<div>

<h3 className="
font-bold
">

New Delhi

</h3>


<p className="
text-gray-500
">

Current Location

</p>


</div>


</div>







{/* Date */}

<div className="
bg-white
rounded-xl
shadow
p-5
flex
items-center
gap-4
">


<div className="
bg-yellow-100
p-4
rounded-full
">


<FaCalendarAlt
className="
text-yellow-600
text-xl
"
/>


</div>


<div>

<h3 className="
font-bold
">

{
now.toLocaleDateString()
}

</h3>


<p className="
text-gray-500
">

Today's Date

</p>


</div>


</div>







{/* Time */}

<div className="
bg-white
rounded-xl
shadow
p-5
flex
items-center
gap-4
">


<div className="
bg-red-100
p-4
rounded-full
">


<FaClock
className="
text-red-600
text-xl
"
/>


</div>


<div>

<h3 className="
font-bold
">

{
now.toLocaleTimeString()
}

</h3>


<p className="
text-gray-500
">

Current Time

</p>


</div>


</div>






</div>



</div>

);


};



export default DashboardHeader;