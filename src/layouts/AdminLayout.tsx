import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";


const AdminLayout = () => {


  return (

    <div className="
      min-h-screen
      bg-gray-100
      flex
    ">


      {/* =====================
          Admin Sidebar
      ====================== */}

      <aside className="
        fixed
        left-0
        top-0
        h-screen
        z-40
      ">

        <Sidebar />

      </aside>





      {/* =====================
          Admin Main Area
      ====================== */}

      <div className="
        flex-1
        ml-64
        flex
        flex-col
        min-h-screen
      ">




        {/* Navbar */}

        <header className="
          sticky
          top-0
          z-30
        ">

          <Navbar />

        </header>






        {/* Page Content */}

        <main className="
          flex-1
          p-6
          overflow-y-auto
        ">


          <Outlet />


        </main>



      </div>



    </div>

  );


};


export default AdminLayout;