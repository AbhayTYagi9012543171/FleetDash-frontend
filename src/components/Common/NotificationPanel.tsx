import {
  FaBell,
  FaExclamationTriangle,
  FaGasPump,
  FaTools,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaSyncAlt,
} from "react-icons/fa";
import { useState, type JSX } from "react";

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  priority: "High" | "Medium" | "Low";
  icon: JSX.Element;
}

const NotificationPanel = () => {
  const [notifications] = useState<Notification[]>([
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-600";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-green-100 text-green-600";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">

      {/* Header */}

      <div className="flex items-center justify-between p-6 border-b">

        <div className="flex items-center gap-3">

          <div className="bg-blue-100 p-3 rounded-xl">

            <FaBell className="text-blue-600 text-xl" />

          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-800">
              Notifications
            </h2>

            <p className="text-sm text-gray-500">
              Fleet activity updates
            </p>

          </div>

        </div>

        <button
          className="
            flex
            items-center
            gap-2
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-4
            py-2
            rounded-lg
            transition
          "
        >
          <FaSyncAlt />
          Refresh
        </button>

      </div>

      {/* Notifications */}

      <div className="divide-y">

        {notifications.map((item) => (

          <div
            key={item.id}
            className="
              flex
              items-start
              gap-4
              p-5
              hover:bg-gray-50
              transition
            "
          >

            <div
              className={`
                h-12
                w-12
                rounded-xl
                flex
                items-center
                justify-center
                text-lg
                ${getPriorityColor(item.priority)}
              `}
            >
              {item.icon}
            </div>

            <div className="flex-1">

              <div className="flex justify-between items-start">

                <div>

                  <h3 className="font-semibold text-slate-800">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 mt-1 text-sm">
                    {item.description}
                  </p>

                </div>

                <span
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    ${getPriorityColor(item.priority)}
                  `}
                >
                  {item.priority}
                </span>

              </div>

              <p className="text-xs text-gray-400 mt-3">
                {item.time}
              </p>

            </div>

          </div>

        ))}

      </div>

      {/* Footer */}

      <div className="p-4 border-t bg-gray-50 rounded-b-2xl">

        <button
          className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            text-white
            py-3
            rounded-xl
            font-semibold
            transition
          "
        >
          View All Notifications
        </button>

      </div>

    </div>
  );
};

export default NotificationPanel;