
import {
  FaTruck,
  FaMapMarkerAlt,
  FaGasPump,
  FaCheckCircle,
  FaUser,
  FaClock,
  FaSyncAlt,
  FaRoute,
} from "react-icons/fa";

import { useState } from "react";

import type { ReactNode } from "react";

interface Activity {
  id: number;
  title: string;
  description: string;
  time: string;
  type:
    | "vehicle"
    | "trip"
    | "fuel"
    | "driver"
    | "gps"
    | "success";
}

interface ActivityStyle {
  icon: ReactNode;
  bg: string;
  color: string;
}

const ActivityFeed = () => {
  const [refreshing, setRefreshing] = useState(false);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      title: "Vehicle Started",
      description: "UP14 AB 1234 started its trip",
      time: "2 min ago",
      type: "vehicle",
    },
    {
      id: 2,
      title: "Trip Completed",
      description: "Trip TR-204 completed successfully",
      time: "8 min ago",
      type: "success",
    },
    {
      id: 3,
      title: "Fuel Refilled",
      description: "178 Litres added to UP16 CD 5678",
      time: "14 min ago",
      type: "fuel",
    },
    {
      id: 4,
      title: "Driver Logged In",
      description: "Rahul Kumar logged into dashboard",
      time: "21 min ago",
      type: "driver",
    },
    {
      id: 5,
      title: "GPS Updated",
      description: "Vehicle location synchronized",
      time: "30 min ago",
      type: "gps",
    },
    {
      id: 6,
      title: "Vehicle Assigned",
      description: "New driver assigned to UP32 EF 4455",
      time: "42 min ago",
      type: "vehicle",
    },
  ]);

  const handleRefresh = () => {
    if (refreshing) return;

    setRefreshing(true);

    setTimeout(() => {
      setActivities((prev) => [...prev]);
      setRefreshing(false);
    }, 1000);
  };

  const getActivityStyle = (
    type: Activity["type"]
  ): ActivityStyle => {
    switch (type) {
      case "vehicle":
        return {
          icon: <FaTruck />,
          bg: "bg-blue-100",
          color: "text-blue-600",
        };

      case "trip":
        return {
          icon: <FaRoute />,
          bg: "bg-purple-100",
          color: "text-purple-600",
        };

      case "fuel":
        return {
          icon: <FaGasPump />,
          bg: "bg-yellow-100",
          color: "text-yellow-600",
        };

      case "driver":
        return {
          icon: <FaUser />,
          bg: "bg-indigo-100",
          color: "text-indigo-600",
        };

      case "gps":
        return {
          icon: <FaMapMarkerAlt />,
          bg: "bg-orange-100",
          color: "text-orange-600",
        };

      case "success":
        return {
          icon: <FaCheckCircle />,
          bg: "bg-green-100",
          color: "text-green-600",
        };

      default:
        return {
          icon: <FaClock />,
          bg: "bg-gray-100",
          color: "text-gray-600",
        };
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
        shadow-sm
        p-5
        sm:p-6
      "
    >
      {/* =========================
          Header
      ========================== */}
      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
          mb-6
        "
      >
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              Live Activity Feed
            </h2>

            {/* Live Indicator */}
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="
                    absolute
                    inline-flex
                    h-full
                    w-full
                    rounded-full
                    bg-green-400
                    opacity-75
                    animate-ping
                  "
                />

                <span
                  className="
                    relative
                    inline-flex
                    h-2.5
                    w-2.5
                    rounded-full
                    bg-green-500
                  "
                />
              </span>

              Live
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            Latest fleet activities in real time
          </p>
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="
            w-full
            sm:w-auto
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
            className={refreshing ? "animate-spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* =========================
          Activity Timeline
      ========================== */}
      <div className="space-y-1">
        {activities.length === 0 ? (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              py-16
              text-center
            "
          >
            <div
              className="
                h-16
                w-16
                rounded-full
                bg-gray-100
                flex
                items-center
                justify-center
                text-gray-400
                text-2xl
              "
            >
              <FaClock />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-700">
              No Recent Activities
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              Fleet activities will appear here.
            </p>
          </div>
        ) : (
          activities.map((activity, index) => {
            const style = getActivityStyle(activity.type);

            return (
              <div
                key={activity.id}
                className="
                  relative
                  flex
                  items-start
                  gap-3
                  sm:gap-4
                  p-3
                  sm:p-4
                  rounded-xl
                  hover:bg-gray-50
                  transition-colors
                "
              >
                {/* Timeline Line */}
                {index !== activities.length - 1 && (
                  <div
                    className="
                      absolute
                      left-[27px]
                      sm:left-[31px]
                      top-16
                      bottom-[-4px]
                      w-0.5
                      bg-gray-200
                    "
                  />
                )}

                {/* Activity Icon */}
                <div
                  className={`
                    relative
                    z-10
                    shrink-0
                    h-11
                    w-11
                    sm:h-12
                    sm:w-12
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    text-lg
                    sm:text-xl
                    ${style.bg}
                    ${style.color}
                  `}
                >
                  {style.icon}
                </div>

                {/* Activity Content */}
                <div className="min-w-0 flex-1">
                  <div
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                      gap-1
                    "
                  >
                    <h3 className="font-semibold text-slate-800 truncate">
                      {activity.title}
                    </h3>

                    <span
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-xs
                        text-gray-400
                        shrink-0
                      "
                    >
                      <FaClock className="text-[10px]" />
                      {activity.time}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* =========================
          Footer
      ========================== */}
      {activities.length > 0 && (
        <div
          className="
            mt-5
            pt-4
            border-t
            border-gray-100
            flex
            items-center
            justify-between
          "
        >
          <span className="text-xs text-gray-400">
            Showing latest {activities.length} activities
          </span>

          <span className="flex items-center gap-2 text-xs font-semibold text-green-600">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            System Online
          </span>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;



