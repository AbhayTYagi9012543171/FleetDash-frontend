import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import MobileSidebar from "../components/Sidebar/MobileSidebar";
import Navbar from "../components/Navbar/Navbar";

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      {/* ===========================
          Desktop Sidebar
      =========================== */}

      <Sidebar />

      {/* ===========================
          Mobile Sidebar
      =========================== */}

      <MobileSidebar
        open={mobileOpen}
        setOpen={setMobileOpen}
      />

      {/* ===========================
          Main Content
      =========================== */}

      <div className="flex flex-1 min-w-0 flex-col">

        {/* ===========================
            Navbar
        =========================== */}

        <header className="sticky top-0 z-40 shrink-0 border-b border-gray-200 bg-white shadow-sm">

          <Navbar
            onMenuClick={() =>
              setMobileOpen(true)
            }
          />

        </header>

        {/* ===========================
            Scrollable Content
        =========================== */}

        <main
          className="
            flex-1
            overflow-y-auto
            overflow-x-hidden
            bg-slate-100
          "
        >

          <div
            className="
              w-full
              max-w-screen-2xl
              mx-auto

              p-4
              sm:p-6
              lg:p-8
            "
          >
            <Outlet />
          </div>

        </main>

      </div>

    </div>
  );
};

export default MainLayout;