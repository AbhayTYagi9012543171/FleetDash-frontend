
import {
  FaTruck,
  FaUserPlus,
  FaRoute,
  FaChartBar,
  FaMapMarkedAlt,
  FaCog,
  FaArrowRight,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import type { ReactNode } from "react";

// ==========================
// Action Interface
// ==========================

interface ActionItem {
  id: number;
  title: string;
  subtitle: string;
  icon: ReactNode;
  color: string;
  hover: string;
  path: string;
}

// ==========================
// Quick Actions Component
// ==========================

const QuickActions = () => {
  const navigate = useNavigate();

  // ==========================
  // Quick Action Data
  // ==========================

  const actions: ActionItem[] = [
    {
      id: 1,
      title: "Add Vehicle",
      subtitle: "Register fleet vehicle",
      icon: <FaTruck />,
      color: "bg-blue-100 text-blue-600",
      hover: "hover:bg-blue-600 hover:text-white",
      path: "/vehicles",
    },

    {
      id: 2,
      title: "Add Driver",
      subtitle: "Create driver profile",
      icon: <FaUserPlus />,
      color: "bg-green-100 text-green-600",
      hover: "hover:bg-green-600 hover:text-white",
      path: "/drivers",
    },

    {
      id: 3,
      title: "Create Trip",
      subtitle: "Assign vehicle & driver",
      icon: <FaRoute />,
      color: "bg-purple-100 text-purple-600",
      hover: "hover:bg-purple-600 hover:text-white",
      path: "/trips",
    },

    {
      id: 4,
      title: "Analytics",
      subtitle: "Fleet performance reports",
      icon: <FaChartBar />,
      color: "bg-orange-100 text-orange-600",
      hover: "hover:bg-orange-600 hover:text-white",
      path: "/analytics",
    },

    {
      id: 5,
      title: "Live Tracking",
      subtitle: "Monitor vehicles live",
      icon: <FaMapMarkedAlt />,
      color: "bg-cyan-100 text-cyan-600",
      hover: "hover:bg-cyan-600 hover:text-white",
      path: "/tracking",
    },

    {
      id: 6,
      title: "Settings",
      subtitle: "Manage system",
      icon: <FaCog />,
      color: "bg-gray-100 text-gray-600",
      hover: "hover:bg-gray-700 hover:text-white",
      path: "/settings",
    },
  ];

  // ==========================
  // Navigation Handler
  // ==========================

  const handleAction = (path: string): void => {
    navigate(path);
  };

  return (
    <section className="w-full">
      {/* ==========================
          Header
      =========================== */}

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="
              h-10
              w-10
              rounded-xl
              bg-blue-100
              text-blue-600
              flex
              items-center
              justify-center
            "
          >
            <FaRoute />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Quick Actions
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Frequently used fleet operations
            </p>
          </div>
        </div>
      </div>

      {/* ==========================
          Action Grid
      =========================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-5
        "
      >
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            title={action.title}
            onClick={() => handleAction(action.path)}
            className="
              group
              relative
              overflow-hidden
              w-full
              text-left
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:ring-offset-2
              cursor-pointer
            "
          >
            {/* Decorative Circle */}

            <div
              className="
                absolute
                -right-8
                -top-8
                h-24
                w-24
                rounded-full
                bg-gray-50
                transition-transform
                duration-300
                group-hover:scale-150
              "
            />

            {/* Content */}

            <div className="relative">
              {/* Icon */}

              <div
                className={`
                  h-14
                  w-14
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  text-2xl
                  transition-all
                  duration-300
                  ${action.color}
                  ${action.hover}
                  group-hover:scale-110
                  group-hover:shadow-md
                `}
              >
                {action.icon}
              </div>

              {/* Title */}

              <h3
                className="
                  mt-5
                  text-lg
                  font-bold
                  text-slate-800
                  transition-colors
                  duration-300
                  group-hover:text-blue-600
                "
              >
                {action.title}
              </h3>

              {/* Subtitle */}

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                  leading-5
                "
              >
                {action.subtitle}
              </p>

              {/* Action Link */}

              <div
                className="
                  mt-5
                  flex
                  items-center
                  justify-between
                  text-sm
                  font-semibold
                  text-blue-600
                "
              >
                <span>Open</span>

                <span
                  className="
                    h-8
                    w-8
                    rounded-full
                    bg-blue-50
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-300
                    group-hover:bg-blue-600
                    group-hover:text-white
                    group-hover:translate-x-1
                  "
                >
                  <FaArrowRight className="text-xs" />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
