import React from "react";
import {
  FaHome,
  FaTruck,
  FaUserTie,
  FaRoute,
  FaMapMarkedAlt,
  FaBell,
  FaChartBar,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { logout } from "../../store/slice/authSlice";
import type { AppDispatch } from "../../store/store";
import toast from "react-hot-toast";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();


  const menu: MenuItem[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Vehicles",
      path: "/vehicles",
      icon: <FaTruck />,
    },
    {
      name: "Drivers",
      path: "/drivers",
      icon: <FaUserTie />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <FaRoute />,
    },
    {
      name: "Live Tracking",
      path: "/tracking",
      icon: <FaMapMarkedAlt />,
    },
    {
      name: "Geofence",
      path: "/geofence",
      icon: <FaMapMarkedAlt />,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <FaChartBar />,
    },
    {
      name: "Alerts",
      path: "/alerts",
      icon: <FaBell />,
    },
    {
      name: "Users",
      path: "/users",
      icon: <FaUsers />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <FaCog />,
    },
  ];

  const handleLogout = () => {

    dispatch(logout());

    toast.success(
      "Logged out successfully 👋"
    );

    navigate("/login", {
      replace: true,
    });

  };

  return (
    <aside
      className="
        hidden
        lg:flex
        fixed
        top-0
        left-0
        h-screen
        w-64
        bg-slate-900
        text-white
        flex-col
        shadow-2xl
        z-50
      "
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-700 shrink-0">

        <h1 className="text-2xl font-bold tracking-wide">
          FleetDash
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Fleet Management System
        </p>

      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">

        <ul className="space-y-2">

          {menu.map((item) => (

            <li key={item.path}>

              <NavLink
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                  `
                }
              >
                <span className="text-lg">
                  {item.icon}
                </span>

                <span className="font-medium">
                  {item.name}
                </span>

              </NavLink>

            </li>

          ))}

        </ul>

      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 p-4 shrink-0">

        <button
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-3
            rounded-xl
            bg-red-600
            py-3
            font-semibold
            transition-all
            hover:bg-red-700
            active:scale-95
          "
        >
          <FaSignOutAlt />

          <span>Logout</span>

        </button>

      </div>

    </aside>
  );
};

export default Sidebar;