import { Outlet } from "react-router-dom";

import { useState } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import MobileSidebar from "../components/Sidebar/MobileSidebar";
import Navbar from "../components/Navbar/Navbar";

import { useSidebar } from "../context/SidebarContext";

import {
  FaBars,
} from "react-icons/fa";


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
          transition-all
          duration-300
          w-full

          ${
            collapsed
              ? "lg:ml-20"
              : "lg:ml-64"
          }

        `}

      >



        {/* Mobile Header Button */}

        <div

          className="
          lg:hidden
          bg-white
          shadow
          h-16
          flex
          items-center
          px-4
          "

        >


          <button

            onClick={() =>
              setMobileOpen(true)
            }

            className="
            text-slate-800
            text-2xl
            "

          >

            <FaBars />

          </button>



          <h1 className="
          ml-4
          font-bold
          text-xl
          text-blue-600
          ">

            FleetDash

          </h1>


        </div>





        {/* Navbar */}

        <div className="sticky top-0 z-30">


          <Navbar />


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