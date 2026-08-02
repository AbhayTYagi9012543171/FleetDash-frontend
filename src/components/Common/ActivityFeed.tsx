import {
  FaTruck,
  FaMapMarkerAlt,
  FaGasPump,
  FaCheckCircle,
  FaUser,
  FaClock,
  FaSyncAlt,
} from "react-icons/fa";

import { useEffect, useState } from "react";

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

const ActivityFeed = () => {

  const [refreshing, setRefreshing] = useState(false);

  const [activities] = useState<Activity[]>([
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
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Future Socket.IO updates can be added here
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "vehicle":
        return <FaTruck className="text-blue-600" />;

      case "trip":
        return <FaMapMarkerAlt className="text-purple-600" />;

      case "fuel":
        return <FaGasPump className="text-green-600" />;

      case "driver":
        return <FaUser className="text-cyan-600" />;

      case "gps":
        return <FaMapMarkerAlt className="text-orange-600" />;

      default:
        return <FaCheckCircle className="text-green-600" />;
    }
  };
    return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">

      {/* Header */}

      <div className="flex items-center justify-between p-6 border-b border-gray-100">

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            Live Activity Feed
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Latest fleet activities in real time
          </p>

        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="
            flex
            items-center
            gap-2
            bg-blue-600
            hover:bg-blue-700
            disabled:bg-blue-400
            text-white
            px-4
            py-2
            rounded-xl
            transition
          "
        >
          <FaSyncAlt
            className={refreshing ? "animate-spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh"}

        </button>

      </div>

      {/* Timeline */}

      <div className="p-6">

        <div className="space-y-5">

          {activities.map((activity, index) => (

            <div
              key={activity.id}
              className="
                relative
                flex
                items-start
                gap-4
              "
            >

              {/* Timeline Line */}

              {index !== activities.length - 1 && (

                <div
                  className="
                    absolute
                    left-6
                    top-12
                    w-0.5
                    h-12
                    bg-gray-200
                  "
                />

              )}

              {/* Icon */}

              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-gray-100
                  flex
                  items-center
                  justify-center
                  text-xl
                  shrink-0
                "
              >
                {getIcon(activity.type)}
              </div>

              {/* Content */}

              <div className="flex-1">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">

                  <h3 className="font-semibold text-slate-800">
                    {activity.title}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-gray-400">

                    <FaClock />

                    <span>{activity.time}</span>

                  </div>

                </div>

                <p className="text-gray-500 mt-1">
                  {activity.description}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );

};

export default ActivityFeed;