import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";

interface SidebarContextType {
  collapsed: boolean;
  mobileOpen: boolean;
  toggleSidebar: () =>void;
  toggleMobile: () =>void;
  closeMobile: () =>void;
}

const SidebarContext =
createContext<SidebarContextType | null>(null);

export const SidebarProvider = ({
  children,
}:{
  children:ReactNode;
})=>{

  const [collapsed,setCollapsed]=
  useState(false);

  const [mobileOpen,setMobileOpen]=
  useState(false);

  const toggleSidebar=()=>{
    setCollapsed(prev=>!prev);
  };

  const toggleMobile=()=>{
    setMobileOpen(prev=>!prev);
  };

  const closeMobile=()=>{
    setMobileOpen(false);
  };

  // Close mobile sidebar when screen becomes desktop
  useEffect(()=>{

    const handleResize=()=>{

      if(window.innerWidth>=1024){
        setMobileOpen(false);
      }

    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return()=>window.removeEventListener(
      "resize",
      handleResize
    );

  },[]);

  return(

    <SidebarContext.Provider
      value={{
        collapsed,
        mobileOpen,
        toggleSidebar,
        toggleMobile,
        closeMobile,
      }}
    >

      {children}

    </SidebarContext.Provider>

  );

};

export const useSidebar=()=>{

  const context=
  useContext(SidebarContext);

  if(!context){

    throw new Error(
      "useSidebar must be used inside SidebarProvider"
    );

  }

  return context;

};