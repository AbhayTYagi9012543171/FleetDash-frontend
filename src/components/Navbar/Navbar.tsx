import {
  FaBell,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";

import { useAppSelector } from "../../redux/hooks";



interface NavbarProps {

  onMenuClick?:()=>void;

}



const Navbar = ({
  onMenuClick
}:NavbarProps)=>{


const user =
useAppSelector(
(state)=>state.auth.user
);




return (

<header
className="
bg-white
shadow-sm
h-16
flex
items-center
justify-between
px-6
sticky
top-0
z-40
"
>



{/* Mobile Menu */}

<button

onClick={onMenuClick}

className="
lg:hidden
text-gray-600
text-xl
"

>

<FaBars />

</button>







{/* Header Title */}

<div>


<h1
className="
text-xl
font-bold
text-gray-800
"
>

FleetDash Admin

</h1>


<p
className="
text-xs
text-gray-500
"
>

Fleet Management System

</p>


</div>







{/* Right */}

<div
className="
flex
items-center
gap-6
"
>



{/* Notification */}

<button

className="
relative
text-gray-600
hover:text-blue-600
"

>


<FaBell
className="
text-xl
"
/>


<span

className="
absolute
-top-2
-right-2
bg-red-500
text-white
text-xs
rounded-full
w-4
h-4
flex
items-center
justify-center
"

>

3

</span>


</button>









{/* User Profile */}

<div
className="
flex
items-center
gap-3
"
>


<FaUserCircle

className="
text-3xl
text-gray-500
"

/>


<div
className="
hidden
md:block
"
>


<p
className="
font-semibold
text-gray-800
"
>

{
user?.username || "Admin"
}

</p>



<p
className="
text-sm
text-gray-500
"
>

{
user?.role || "Administrator"
}

</p>


</div>


</div>






</div>



</header>


);

};


export default Navbar;