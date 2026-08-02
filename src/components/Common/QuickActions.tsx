import {
  FaTruck,
  FaUserPlus,
  FaRoute,
  FaChartBar,
  FaMapMarkedAlt,
  FaCog,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";


interface ActionItem {

  id:number;

  title:string;

  subtitle:string;

  icon:React.ReactNode;

  color:string;

  hover:string;

  path:string;

}



const QuickActions = () => {


const navigate = useNavigate();



const actions:ActionItem[]=[


{
id:1,
title:"Add Vehicle",
subtitle:"Register fleet vehicle",
icon:<FaTruck/>,
color:"bg-blue-100 text-blue-600",
hover:"hover:bg-blue-600 hover:text-white",
path:"/vehicles",
},


{
id:2,
title:"Add Driver",
subtitle:"Create driver profile",
icon:<FaUserPlus/>,
color:"bg-green-100 text-green-600",
hover:"hover:bg-green-600 hover:text-white",
path:"/drivers",
},


{
id:3,
title:"Create Trip",
subtitle:"Assign vehicle & driver",
icon:<FaRoute/>,
color:"bg-purple-100 text-purple-600",
hover:"hover:bg-purple-600 hover:text-white",
path:"/trips",
},


{
id:4,
title:"Analytics",
subtitle:"Fleet performance reports",
icon:<FaChartBar/>,
color:"bg-orange-100 text-orange-600",
hover:"hover:bg-orange-600 hover:text-white",
path:"/analytics",
},


{
id:5,
title:"Live Tracking",
subtitle:"Monitor vehicles live",
icon:<FaMapMarkedAlt/>,
color:"bg-cyan-100 text-cyan-600",
hover:"hover:bg-cyan-600 hover:text-white",
path:"/tracking",
},


{
id:6,
title:"Settings",
subtitle:"Manage system",
icon:<FaCog/>,
color:"bg-gray-100 text-gray-600",
hover:"hover:bg-gray-700 hover:text-white",
path:"/settings",
},


];





return(


<div className="
bg-white
rounded-2xl
shadow-lg
border
border-gray-200
p-6
">


<div className="mb-6">


<h2 className="
text-2xl
font-bold
text-slate-800
">

Quick Actions

</h2>


<p className="
text-sm
text-gray-500
mt-1
">

Frequently used fleet operations

</p>


</div>




<div className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-3
gap-5
">


{
actions.map(action=>(


<button

key={action.id}

title={action.title}

onClick={()=>navigate(action.path)}

className="
group
relative
overflow-hidden
rounded-2xl
border
bg-white
p-5
shadow-sm
transition
duration-300
hover:-translate-y-2
hover:shadow-xl
cursor-pointer
"


>


<div className="
absolute
-right-8
-top-8
h-24
w-24
rounded-full
bg-gray-100
opacity-50
group-hover:scale-125
transition
"/>



<div className="relative">


<div
className={`
h-14
w-14
rounded-2xl
flex
items-center
justify-center
text-2xl
transition
${action.color}
${action.hover}
`}
>

{action.icon}

</div>



<h3 className="
mt-5
text-lg
font-bold
text-slate-800
">

{action.title}

</h3>



<p className="
mt-2
text-sm
text-gray-500
">

{action.subtitle}

</p>




<div className="
mt-6
flex
justify-between
items-center
">


<span className="
text-blue-600
font-semibold
text-sm
group-hover:translate-x-1
transition
">

Open →

</span>


<span className="
text-xs
text-gray-400
">

Click

</span>


</div>



</div>


</button>


))

}



</div>



</div>


);


};



export default QuickActions;