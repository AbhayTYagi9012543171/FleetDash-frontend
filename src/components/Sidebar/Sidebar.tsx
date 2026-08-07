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
import toast from "react-hot-toast";

import { logout } from "../../store/slice/authSlice";
import type { AppDispatch } from "../../store/store";
import { useSidebar } from "../../context/SidebarContext";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { collapsed } = useSidebar();

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

    toast.success("Logged out successfully 👋");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside
      className={`
        hidden lg:flex
        flex-col
        bg-slate-900
        text-white
        border-r
        border-slate-800
        transition-all
        duration-300
        shrink-0
        ${
          collapsed
            ? "w-20"
            : "w-64"
        }
      `}
    >
      {/* Logo */}

      <div className="border-b border-slate-800 p-6">
        <h1
          className={`font-bold transition-all ${
            collapsed ? "text-lg text-center" : "text-2xl"
          }`}
        >
          FleetDash
        </h1>

        {!collapsed && (
          <p className="mt-1 text-sm text-slate-400">
            Fleet Management System
          </p>
        )}
      </div>

      {/* Navigation */}

      <nav className="flex-1 overflow-y-auto p-3">
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
                  ${
                    collapsed
                      ? "justify-center"
                      : "gap-3"
                  }
                  rounded-xl
                  px-4
                  py-3
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                `
                }
              >
                <span className="text-xl">
                  {item.icon}
                </span>

                {!collapsed && (
                  <span className="font-medium">
                    {item.name}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}

      <div className="border-t border-slate-800 p-4">
        <button
          onClick={handleLogout}
          className={`
            flex
            w-full
            items-center
            rounded-xl
            bg-red-600
            py-3
            transition
            hover:bg-red-700
            ${
              collapsed
                ? "justify-center"
                : "justify-center gap-3"
            }
          `}
        >
          <FaSignOutAlt />

          {!collapsed && (
            <span className="font-semibold">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;