import {
  FaRoad,
  FaGasPump,
  FaRoute,
  FaBell,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

import type { ReactNode } from "react";


interface SummaryCard {

  id:number;

  title:string;

  value:string;

  subtitle:string;

  icon:ReactNode;

  bg:string;

  iconColor:string;

  progress:number;

  trend:"up" | "down";

  percentage:string;

  progressColor:string;

}



const FleetSummary = () => {



const summary:SummaryCard[] = [


{
id:1,
title:"Distance Today",
value:"2,340 km",
subtitle:"Compared to yesterday",
icon:<FaRoad/>,
bg:"bg-blue-100",
iconColor:"text-blue-600",
progress:82,
trend:"up",
percentage:"+12%",
progressColor:"bg-blue-500"
},



{
id:2,
title:"Fuel Used",
value:"178 L",
subtitle:"Fuel efficiency improved",
icon:<FaGasPump/>,
bg:"bg-green-100",
iconColor:"text-green-600",
progress:68,
trend:"down",
percentage:"-4%",
progressColor:"bg-green-500"
},



{
id:3,
title:"Trips Today",
value:"36",
subtitle:"Trips completed",
icon:<FaRoute/>,
bg:"bg-yellow-100",
iconColor:"text-yellow-600",
progress:90,
trend:"up",
percentage:"+18%",
progressColor:"bg-yellow-500"
},



{
id:4,
title:"Active Alerts",
value:"5",
subtitle:"Fewer than yesterday",
icon:<FaBell/>,
bg:"bg-red-100",
iconColor:"text-red-600",
progress:25,
trend:"down",
percentage:"-10%",
progressColor:"bg-red-500"
},


];





return (

<div

className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-4
gap-6
"

>



{
summary.map((item)=>(



<div

key={item.id}

className="
relative
overflow-hidden
bg-white
rounded-2xl
border
border-gray-200
shadow-md
p-6
transition-all
duration-300
hover:-translate-y-2
hover:shadow-2xl
"


>


{/* Decorative */}


<div

className="
absolute
-right-10
-top-10
h-28
w-28
rounded-full
bg-gray-100
opacity-50
"

 />






{/* Header */}


<div

className="
relative
flex
justify-between
items-start
"

>


<div>


<p
className="
text-sm
text-gray-500
"

>

{item.title}

</p>



<h2

className="
text-3xl
font-bold
text-slate-800
mt-2
"

>

{item.value}

</h2>



<p

className="
text-xs
text-gray-400
mt-2
"

>

{item.subtitle}

</p>



</div>





<div

className={`
h-14
w-14
rounded-2xl
flex
items-center
justify-center
text-2xl
shadow-md
${item.bg}
${item.iconColor}
`}

>

{item.icon}

</div>



</div>







{/* Trend */}



<div

className="
mt-6
flex
justify-between
items-center
"

>


<div

className={`
flex
items-center
gap-2
font-semibold
${
item.trend==="up"
?
"text-green-600"
:
"text-red-600"
}
`}

>


{
item.trend==="up"
?
<FaArrowUp/>
:
<FaArrowDown/>
}


{item.percentage}


</div>



<span

className="
text-xs
text-gray-400
"

>

Today

</span>


</div>








{/* Progress */}



<div className="mt-5">


<div

className="
flex
justify-between
mb-2
"

>


<span

className="
text-sm
text-gray-500
"

>

Performance

</span>


<span

className="
text-sm
font-semibold
"

>

{item.progress}%

</span>


</div>




<div

className="
w-full
h-2
rounded-full
bg-gray-200
overflow-hidden
"

>


<div

className={`
h-full
rounded-full
transition-all
duration-700
${item.progressColor}
`}

style={{

width:`${item.progress}%`

}}


/>


</div>


</div>









{/* Footer */}



<div

className="
mt-6
pt-4
border-t
border-gray-100
flex
justify-between
items-center
"

>


<span

className="
text-xs
text-gray-400
"

>

Updated just now

</span>



<span

className="
text-xs
font-semibold
text-blue-600
"

>

Live Data

</span>



</div>







</div>



))

}



</div>


);


};



export default FleetSummary;