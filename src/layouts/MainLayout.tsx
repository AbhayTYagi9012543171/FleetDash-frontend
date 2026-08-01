import { Outlet } from "react-router-dom";

import { useState } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import MobileSidebar from "../components/Sidebar/MobileSidebar";
import Navbar from "../components/Navbar/Navbar";

import { useSidebar } from "../context/SidebarContext";



const MainLayout = () => {


  const {
    collapsed
  } = useSidebar();



  const [
    mobileOpen,
    setMobileOpen
  ] = useState(false);




  return (

    <div className="min-h-screen bg-gray-100 flex">


      {/* Desktop Sidebar */}

      <Sidebar />




      {/* Mobile Sidebar */}

      <MobileSidebar

        open={mobileOpen}

        setOpen={setMobileOpen}

      />




      {/* Main Content */}

      <div

        className={`
          flex-1
          w-full
          transition-all
          duration-300

          ${
            collapsed
              ? "lg:ml-20"
              : "lg:ml-64"
          }

        `}

      >



        {/* Navbar */}

        <div className="sticky top-0 z-40">

          <Navbar

            onMenuClick={() =>
              setMobileOpen(true)
            }

          />

        </div>





        {/* Page Content */}

        <main

          className="
            p-3
            sm:p-4
            md:p-6
            min-h-[calc(100vh-64px)]
            overflow-x-hidden
            overflow-y-auto
          "

        >

          <Outlet />


        </main>



      </div>



    </div>

  );


};


export default MainLayout;