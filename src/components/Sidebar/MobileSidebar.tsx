import React from "react";

import {
  FaHome,
  FaTruck,
  FaUserTie,
  FaRoute,
  FaMapMarkedAlt,
  FaBell,
  FaChartBar,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useDispatch } from "react-redux";

import {
  logout,
} from "../../store/slice/authSlice";

import type {
  AppDispatch,
} from "../../store/store";

import toast from "react-hot-toast";


interface Props {
  open:boolean;
  setOpen:(value:boolean)=>void;
}


interface MenuItem {
  name:string;
  path:string;
  icon:React.ReactNode;
}


const MobileSidebar = ({
  open,
  setOpen,
}:Props)=>{


const navigate = useNavigate();

const dispatch =
useDispatch<AppDispatch>();



const menu:MenuItem[]=[

{
name:"Dashboard",
path:"/dashboard",
icon:<FaHome/>
},

{
name:"Vehicles",
path:"/vehicles",
icon:<FaTruck/>
},

{
name:"Drivers",
path:"/drivers",
icon:<FaUserTie/>
},

{
name:"Reports",
path:"/reports",
icon:<FaRoute/>
},

{
name:"Live Tracking",
path:"/tracking",
icon:<FaMapMarkedAlt/>
},

{
name:"Analytics",
path:"/analytics",
icon:<FaChartBar/>
},

{
name:"Alerts",
path:"/alerts",
icon:<FaBell/>
},

{
name:"Users",
path:"/users",
icon:<FaUsers/>
},

{
name:"Settings",
path:"/settings",
icon:<FaCog/>
},

];



const handleLogout=()=>{

dispatch(logout());

toast.success(
"Logged out successfully 👋"
);

navigate("/login");

setOpen(false);

};



return (

<>

{/* Overlay */}

{
open &&

<div

onClick={()=>setOpen(false)}

className="
fixed
inset-0
bg-black/50
z-40
lg:hidden
"

/>

}



{/* Sidebar */}

<aside

className={`
fixed
top-0
left-0
h-screen
w-72
bg-slate-900
text-white
z-50
transform
transition-transform
duration-300
lg:hidden

${open
? "translate-x-0"
: "-translate-x-full"
}

`}

>


<div className="
flex
items-center
justify-between
px-6
py-5
border-b
border-slate-700
">


<div>

<h1 className="text-2xl font-bold">
FleetDash
</h1>


<p className="text-sm text-slate-400">
Fleet Management
</p>


</div>


<button
onClick={()=>setOpen(false)}
>

<FaTimes size={22}/>

</button>


</div>




<nav className="
px-4
py-5
overflow-y-auto
">


<ul className="space-y-2">


{
menu.map(item=>(

<li key={item.path}>


<NavLink

to={item.path}

onClick={()=>setOpen(false)}

className={({isActive})=>

`
flex
items-center
gap-3
px-4
py-3
rounded-xl

${
isActive
?
"bg-blue-600"
:
"text-slate-300 hover:bg-slate-800"
}

`

}

>


<span>
{item.icon}
</span>


<span>
{item.name}
</span>


</NavLink>


</li>


))
}



</ul>


</nav>



<div className="
absolute
bottom-0
w-full
p-4
border-t
border-slate-700
">


<button

onClick={handleLogout}

className="
w-full
bg-red-600
py-3
rounded-xl
flex
items-center
justify-center
gap-3
font-semibold
"

>

<FaSignOutAlt/>

Logout


</button>


</div>



</aside>


</>

);


};


export default MobileSidebar;