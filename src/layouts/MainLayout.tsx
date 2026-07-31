import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

import { useSidebar } from "../context/SidebarContext";



const MainLayout = () => {


  const {
    collapsed
  } = useSidebar();





  return (

    <div className="
      min-h-screen
      bg-gray-100
    ">


      {/* =====================
          Sidebar
      ====================== */}

      <div className="
        fixed
        left-0
        top-0
        h-screen
        z-40
      ">

        <Sidebar />

      </div>








      {/* =====================
          Main Content
      ====================== */}


      <div

        className={`
          transition-all
          duration-300

          ${
            collapsed
            ? "ml-20"
            : "ml-64"
          }

        `}

      >




        {/* Navbar */}

        <div className="
          sticky
          top-0
          z-30
        ">

          <Navbar />

        </div>







        {/* Page Content */}

        <main

          className="
            p-6
            min-h-[calc(100vh-64px)]
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