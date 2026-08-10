
import {
  FaBell,
  FaExclamationTriangle,
  FaGasPump,
  FaTools,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaSyncAlt,
  FaArrowRight,
} from "react-icons/fa";

import { useState } from "react";

import type { ReactNode } from "react";

// ==========================
// Notification Types
// ==========================

type NotificationPriority = "High" | "Medium" | "Low";

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  priority: NotificationPriority;
  icon: ReactNode;
}

// ==========================
// Notification Component
// ==========================

const NotificationPanel = () => {
  const [loading, setLoading] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Overspeed Alert",
      description: "Vehicle UP14AB1234 exceeded 90 km/h",
      time: "2 min ago",
      priority: "High",
      icon: <FaExclamationTriangle />,
    },

    {
      id: 2,
      title: "Low Fuel",
      description: "Vehicle DL10CD4567 fuel below 20%",
      time: "8 min ago",
      priority: "Medium",
      icon: <FaGasPump />,
    },

    {
      id: 3,
      title: "Maintenance Due",
      description: "Truck MH12XY9876 requires servicing",
      time: "35 min ago",
      priority: "Medium",
      icon: <FaTools />,
    },

    {
      id: 4,
      title: "Trip Completed",
      description: "Trip TR102 completed successfully",
      time: "1 hour ago",
      priority: "Low",
      icon: <FaCheckCircle />,
    },

    {
      id: 5,
      title: "Vehicle Offline",
      description: "RJ09AA2211 GPS disconnected",
      time: "2 hours ago",
      priority: "High",
      icon: <FaMapMarkerAlt />,
    },
  ]);

  // ==========================
  // Refresh Notifications
  // ==========================

  const refreshNotifications = () => {
    setLoading(true);

    setTimeout(() => {
      setNotifications((prev) => [...prev]);
      setLoading(false);
    }, 800);
  };

  // ==========================
  // Priority Styles
  // ==========================

  const getPriorityColor = (
    priority: NotificationPriority
  ): string => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-600";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      case "Low":
        return "bg-green-100 text-green-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityDot = (
    priority: NotificationPriority
  ): string => {
    switch (priority) {
      case "High":
        return "bg-red-500";

      case "Medium":
        return "bg-yellow-500";

      case "Low":
        return "bg-green-500";

      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      className="
        w-full
        bg-white
        rounded-2xl
        border
        border-gray-200
        shadow-lg
        overflow-hidden
      "
    >
      {/* ==========================
          Header
      =========================== */}

      <div
        className="
          p-5
          sm:p-6
          border-b
          border-gray-100
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
        "
      >
        <div className="flex items-center gap-4">
          <div
            className="
              h-12
              w-12
              rounded-xl
              bg-blue-100
              text-blue-600
              flex
              items-center
              justify-center
              text-xl
              shrink-0
            "
          >
            <FaBell />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              Notifications
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Fleet activity updates
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={refreshNotifications}
          disabled={loading}
          className="
            flex
            items-center
            justify-center
            gap-2
            bg-blue-600
            hover:bg-blue-700
            disabled:bg-blue-400
            disabled:cursor-not-allowed
            text-white
            px-4
            py-2.5
            rounded-xl
            font-medium
            transition-all
            duration-200
            shadow-sm
            hover:shadow-md
          "
        >
          <FaSyncAlt
            className={loading ? "animate-spin" : ""}
          />

          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ==========================
          Notification Summary
      =========================== */}

      <div
        className="
          grid
          grid-cols-3
          border-b
          border-gray-100
        "
      >
        <div className="p-4 text-center border-r border-gray-100">
          <p className="text-xs text-gray-500">
            Total
          </p>

          <p className="text-xl font-bold text-slate-800 mt-1">
            {notifications.length}
          </p>
        </div>

        <div className="p-4 text-center border-r border-gray-100">
          <p className="text-xs text-gray-500">
            High Priority
          </p>

          <p className="text-xl font-bold text-red-600 mt-1">
            {
              notifications.filter(
                (item) => item.priority === "High"
              ).length
            }
          </p>
        </div>

        <div className="p-4 text-center">
          <p className="text-xs text-gray-500">
            Recent
          </p>

          <p className="text-xl font-bold text-green-600 mt-1">
            {notifications.length > 0 ? "Active" : "None"}
          </p>
        </div>
      </div>

      {/* ==========================
          Notification List
      =========================== */}

      <div className="divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="p-10 text-center">
            <div
              className="
                mx-auto
                h-16
                w-16
                rounded-full
                bg-green-100
                text-green-600
                flex
                items-center
                justify-center
                text-2xl
              "
            >
              <FaCheckCircle />
            </div>

            <h3 className="text-lg font-semibold text-slate-800 mt-4">
              All caught up!
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              There are no new notifications.
            </p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="
                group
                p-5
                hover:bg-gray-50
                transition-all
                duration-200
              "
            >
              <div className="flex items-start gap-4">
                {/* Icon */}

                <div
                  className={`
                    h-12
                    w-12
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    text-lg
                    shrink-0
                    ${getPriorityColor(item.priority)}
                  `}
                >
                  {item.icon}
                </div>

                {/* Content */}

                <div className="flex-1 min-w-0">
                  <div
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                      gap-2
                    "
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-800">
                        {item.title}
                      </h3>

                      <span
                        className={`
                          h-2
                          w-2
                          rounded-full
                          ${getPriorityDot(item.priority)}
                        `}
                      />
                    </div>

                    <span className="text-xs text-gray-400 shrink-0">
                      {item.time}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1 leading-5">
                    {item.description}
                  </p>

                  <div className="mt-3">
                    <span
                      className={`
                        inline-flex
                        items-center
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        ${getPriorityColor(item.priority)}
                      `}
                    >
                      {item.priority} Priority
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ==========================
          Footer
      =========================== */}

      <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100">
        <button
          type="button"
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            bg-blue-600
            hover:bg-blue-700
            text-white
            py-3
            rounded-xl
            font-semibold
            transition-all
            duration-200
            shadow-sm
            hover:shadow-md
          "
        >
          View All Notifications

          <FaArrowRight className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;
