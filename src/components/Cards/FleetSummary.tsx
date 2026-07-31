import {
  FaRoad,
  FaGasPump,
  FaRoute,
  FaBell,
} from "react-icons/fa";

const FleetSummary = () => {
  const summary = [
    {
      id: 1,
      title: "Distance Today",
      value: "2,340 km",
      icon: <FaRoad />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      id: 2,
      title: "Fuel Used",
      value: "178 L",
      icon: <FaGasPump />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      id: 3,
      title: "Trips Today",
      value: "36",
      icon: <FaRoute />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
    {
      id: 4,
      title: "Active Alerts",
      value: "5",
      icon: <FaBell />,
      bg: "bg-red-100",
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {summary.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-xl transition duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                {item.title}
              </p>

              <h2 className="text-3xl font-bold mt-2 text-gray-800">
                {item.value}
              </h2>
            </div>

            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${item.bg} ${item.color}`}
            >
              {item.icon}
            </div>
          </div>

          <div className="mt-5">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Updated just now
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FleetSummary;