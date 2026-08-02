import {
  Outlet,
} from "react-router-dom";

import {
  useSidebar,
} from "../context/SidebarContext";

import Sidebar from "../components/Sidebar/Sidebar";

import Navbar from "../components/Navbar/Navbar";





const AdminLayout = () => {


const {
  collapsed,
  mobileOpen,
  closeMobile,
}
=
useSidebar();







return (


<div className="
min-h-screen
bg-gray-100
flex
">








{/* Mobile Overlay */}


{
mobileOpen &&


<div

onClick={closeMobile}

className="
fixed
inset-0
bg-black/50
z-30
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
z-40
transition-all
duration-300

${

mobileOpen

?

"translate-x-0"

:

"-translate-x-full lg:translate-x-0"

}


`}


>


<Sidebar />


</aside>









{/* Main Content */}



<div


className={`
flex-1
flex
flex-col
min-h-screen
transition-all
duration-300


${

collapsed

?

"lg:ml-20"

:

"lg:ml-64"

}

`}



>









{/* Navbar */}



<header className="
sticky
top-0
z-20
bg-white
shadow-sm
">


<Navbar />


</header>









{/* Page */}



<main className="
flex-1
p-4
sm:p-6
overflow-y-auto
">


<Outlet />


</main>









</div>





</div>


);



};



export default AdminLayout;