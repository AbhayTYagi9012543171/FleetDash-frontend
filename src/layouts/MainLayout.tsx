import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

import { useSidebar } from "../context/SidebarContext";

const MainLayout = () => {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar (Desktop Only) */}
      <Sidebar />

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