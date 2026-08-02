import {
  FaHeartbeat,
  FaTruck,
  FaGasPump,
  FaTools,
  FaShieldAlt,
} from "react-icons/fa";

interface HealthMetric {
  id: number;
  title: string;
  value: string;
  color: string;
  bg: string;
  icon: React.ReactNode;
}

const FleetHealthCard = () => {

  const metrics: HealthMetric[] = [

    {
      id: 1,
      title: "Vehicle Health",
      value: "96%",
      color: "text-green-600",
      bg: "bg-green-100",
      icon: <FaTruck />,
    },

    {
      id: 2,
      title: "Fuel Efficiency",
      value: "18.2 km/L",
      color: "text-blue-600",
      bg: "bg-blue-100",
      icon: <FaGasPump />,
    },

    {
      id: 3,
      title: "Maintenance",
      value: "12 Due",
      color: "text-orange-600",
      bg: "bg-orange-100",
      icon: <FaTools />,
    },

    {
      id: 4,
      title: "Safety Score",
      value: "98%",
      color: "text-purple-600",
      bg: "bg-purple-100",
      icon: <FaShieldAlt />,
    },

  ];
    return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            Fleet Health
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Overall fleet performance and operational health
          </p>

        </div>

        <div className="flex items-center gap-3 bg-green-50 px-5 py-3 rounded-xl">

          <div className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl">
            <FaHeartbeat />
          </div>

          <div>

            <p className="text-sm text-gray-500">
              Overall Score
            </p>

            <h3 className="text-3xl font-bold text-green-600">
              94%
            </h3>

          </div>

        </div>

      </div>

      {/* Main Health Banner */}

      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl p-6 text-white mb-8">

        <h3 className="text-3xl font-bold">
          Excellent Fleet Condition
        </h3>

        <p className="mt-2 text-green-100">
          Your fleet is performing efficiently with minimal maintenance issues.
        </p>

        <div className="mt-6">

          <div className="w-full h-4 rounded-full bg-green-300 overflow-hidden">

            <div
              className="h-full bg-white rounded-full"
              style={{ width: "94%" }}
            />

          </div>

          <div className="flex justify-between mt-2 text-sm">

            <span>0%</span>

            <span>94%</span>

            <span>100%</span>

          </div>

        </div>

      </div>

      {/* Metric Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {metrics.map((metric) => (

          <div
            key={metric.id}
            className="
              bg-white
              border
              border-gray-200
              rounded-2xl
              p-5
              shadow-sm
              hover:shadow-xl
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  {metric.title}
                </p>

                <h3 className="text-3xl font-bold text-slate-800 mt-2">
                  {metric.value}
                </h3>

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
                  ${metric.bg}
                  ${metric.color}
                `}
              >
                {metric.icon}
              </div>

            </div>

            <div className="mt-5">

              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">

                <div
                  className={`
                    h-full
                    rounded-full
                    ${
                      metric.id === 1
                        ? "bg-green-500 w-[96%]"
                        : metric.id === 2
                        ? "bg-blue-500 w-[88%]"
                        : metric.id === 3
                        ? "bg-orange-500 w-[65%]"
                        : "bg-purple-500 w-[98%]"
                    }
                  `}
                />

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );

};

export default FleetHealthCard;