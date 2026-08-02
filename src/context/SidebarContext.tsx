import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";



interface SidebarContextType {

  collapsed:boolean;

  mobileOpen:boolean;

  toggleSidebar:()=>void;

  toggleMobile:()=>void;

  closeMobile:()=>void;

}





const SidebarContext =
createContext<SidebarContextType | undefined>(
  undefined
);







interface SidebarProviderProps {

  children:ReactNode;

}





export const SidebarProvider = ({
  children,
}:SidebarProviderProps)=>{



const [
  collapsed,
  setCollapsed
]
=
useState<boolean>(false);




const [
  mobileOpen,
  setMobileOpen
]
=
useState<boolean>(false);







const toggleSidebar = ()=>{


setCollapsed(
(prev)=>!prev
);


};







const toggleMobile = ()=>{


setMobileOpen(
(prev)=>!prev
);


};







const closeMobile = ()=>{


setMobileOpen(false);


};









// Close mobile sidebar on desktop

useEffect(()=>{


const handleResize = ()=>{


if(
window.innerWidth >= 1024
)
{

setMobileOpen(false);

}


};




window.addEventListener(
"resize",
handleResize
);



return()=>{


window.removeEventListener(
"resize",
handleResize
);


};



},[]);








const value =
useMemo(()=>({

collapsed,

mobileOpen,

toggleSidebar,

toggleMobile,

closeMobile,


}),[

collapsed,

mobileOpen

]);







return (

<SidebarContext.Provider
value={value}
>

{children}

</SidebarContext.Provider>


);


};









export const useSidebar = ()=>{


const context =
useContext(
SidebarContext
);



if(!context)
{


throw new Error(

"useSidebar must be used inside SidebarProvider"

);


}



return context;



};