import {
  FaRoad,
  FaGasPump,
  FaRoute,
  FaBell,
  FaArrowUp,
  FaArrowDown,
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
      progress: 82,
      trend: "up",
      percentage: "+12%",
      subtitle: "Compared to yesterday",
    },
    {
      id: 2,
      title: "Fuel Used",
      value: "178 L",
      icon: <FaGasPump />,
      bg: "bg-green-100",
      color: "text-green-600",
      progress: 68,
      trend: "down",
      percentage: "-4%",
      subtitle: "Fuel efficiency improved",
    },
    {
      id: 3,
      title: "Trips Today",
      value: "36",
      icon: <FaRoute />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
      progress: 90,
      trend: "up",
      percentage: "+18%",
      subtitle: "Trips completed",
    },
    {
      id: 4,
      title: "Active Alerts",
      value: "5",
      icon: <FaBell />,
      bg: "bg-red-100",
      color: "text-red-600",
      progress: 25,
      trend: "down",
      percentage: "-10%",
      subtitle: "Fewer than yesterday",
    },
  ];
    return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-6
      "
    >

      {summary.map((item) => (

        <div
          key={item.id}
          className="
            relative
            overflow-hidden
            bg-white
            rounded-2xl
            border
            border-gray-200
            shadow-md
            p-6
            transition-all
            duration-300
            hover:-translate-y-2
            hover:shadow-2xl
          "
        >

          {/* Background Circle */}

          <div
            className="
              absolute
              -top-8
              -right-8
              h-24
              w-24
              rounded-full
              bg-gray-100
              opacity-60
            "
          />

          {/* Header */}

          <div className="relative flex justify-between items-start">

            <div>

              <p className="text-sm text-gray-500">
                {item.title}
              </p>

              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {item.value}
              </h2>

              <p className="text-xs text-gray-400 mt-2">
                {item.subtitle}
              </p>

            </div>

            <div
              className={`
                h-14
                w-14
                rounded-2xl
                flex
                items-center
                justify-center
                text-2xl
                shadow-md
                ${item.bg}
                ${item.color}
              `}
            >
              {item.icon}
            </div>

          </div>

          {/* Trend */}

          <div className="mt-6 flex justify-between items-center">

            <div
              className={`
                flex
                items-center
                gap-2
                font-semibold
                ${
                  item.trend === "up"
                    ? "text-green-600"
                    : "text-red-600"
                }
              `}
            >

              {
                item.trend === "up"
                  ? <FaArrowUp />
                  : <FaArrowDown />
              }

              {item.percentage}

            </div>

            <span className="text-xs text-gray-400">
              Today
            </span>

          </div>

          {/* Progress */}

          <div className="mt-4">

            <div className="flex justify-between mb-2">

              <span className="text-sm text-gray-500">
                Progress
              </span>

              <span className="text-sm font-semibold">
                {item.progress}%
              </span>

            </div>

            <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">

              <div
                className={`
                  h-full
                  rounded-full
                  ${
                    item.trend === "up"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }
                `}
                style={{
                  width: `${item.progress}%`,
                }}
              />

            </div>

          </div>

          {/* Footer */}

          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">

            <span className="text-xs text-gray-400">
              Updated just now
            </span>

            <span className="text-xs font-semibold text-blue-600">
              Live Data
            </span>

          </div>

        </div>

      ))}

    </div>
  );

};

export default FleetSummary;