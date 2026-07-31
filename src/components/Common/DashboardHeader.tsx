import {
  FaTruck,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

import { useAppSelector } from "../../redux/hooks";


const DashboardHeader = () => {


const user =
useAppSelector(
(state)=>state.auth.user
);



const now = new Date();



return (

<div className="
mb-6
sm:mb-8
w-full
overflow-hidden
">


<div className="
flex
flex-col
sm:flex-row
items-start
sm:items-center
justify-between
gap-4
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
break-words
">

Welcome back, {user?.username || "User"} 👋

</p>


</div>





<div className="
bg-white
shadow
rounded-xl
px-5
py-3
w-full
sm:w-auto
max-w-full
">


<p className="font-bold">

{user?.username || "Guest"}

</p>


<p className="text-sm text-gray-500">

{user?.role || "User"}

</p>


</div>



</div>







<div className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-4
gap-4
sm:gap-6
mt-6
sm:mt-8
">



<div className="
bg-white
rounded-xl
shadow
p-4
sm:p-5
flex
items-center
gap-3
sm:gap-4
w-full
">


<div className="
bg-green-100
p-3
sm:p-4
rounded-full
shrink-0
">


<FaTruck className="
text-green-600
text-lg
sm:text-xl
"/>


</div>


<div>


<h3 className="
font-bold
text-xl
sm:text-2xl
truncate
">

128

</h3>


<p className="text-gray-500">

Online Vehicles

</p>


</div>


</div>







<div className="
bg-white
rounded-xl
shadow
p-4
sm:p-5
flex
items-center
gap-3
sm:gap-4
w-full
">


<div className="
bg-blue-100
p-3
sm:p-4
rounded-full
shrink-0
">

<FaMapMarkerAlt
className="
text-blue-600
text-lg
sm:text-xl
"
/>


</div>


<div>


<h3 className="
font-bold
text-sm
sm:text-base
truncate
">
New Delhi
</h3>


<p className="text-gray-500">

Current Location

</p>


</div>


</div>







<div className="
bg-white
rounded-xl
shadow
p-4
sm:p-5
flex
items-center
gap-3
sm:gap-4
w-full
">


<div className="
bg-yellow-100
p-3
sm:p-4
rounded-full
shrink-0
">

<FaCalendarAlt
className="
text-yellow-600
text-lg
sm:text-xl
"
/>


</div>


<div>


<h3 className="font-bold">

{now.toLocaleDateString()}

</h3>


<p className="text-gray-500">

Today's Date

</p>


</div>


</div>







<div className="
bg-white
rounded-xl
shadow
p-4
sm:p-5
flex
items-center
gap-3
sm:gap-4
w-full
">


<div className="
bg-red-100
p-3
sm:p-4
rounded-full
shrink-0
">

<FaClock
className="
text-red-600
text-lg
sm:text-xl
"
/>


</div>


<div>


<h3
className="
font-bold
text-sm
sm:text-base
truncate
"
>

{now.toLocaleTimeString()}

</h3>


<p className="text-gray-500">

Current Time

</p>


</div>


</div>





</div>



</div>

);

};


export default DashboardHeader;