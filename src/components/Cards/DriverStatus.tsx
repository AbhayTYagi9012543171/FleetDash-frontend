import {
  FaUserCheck,
  FaUserClock,
  FaUserAltSlash,
  FaStar,
} from "react-icons/fa";

interface DriverStat {
  id: number;
  title: string;
  value: string;
  percentage: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

const DriverStatus = () => {

  const stats: DriverStat[] = [

    {
      id: 1,
      title: "Active Drivers",
      value: "48",
      percentage: "+8%",
      icon: <FaUserCheck />,
      color: "text-green-600",
      bg: "bg-green-100",
    },

    {
      id: 2,
      title: "On Duty",
      value: "36",
      percentage: "+5%",
      icon: <FaUserClock />,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },

    {
      id: 3,
      title: "On Leave",
      value: "7",
      percentage: "-2%",
      icon: <FaUserAltSlash />,
      color: "text-red-600",
      bg: "bg-red-100",
    },

    {
      id: 4,
      title: "Safety Score",
      value: "96%",
      percentage: "+3%",
      icon: <FaStar />,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },

  ];
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            Driver Status
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Driver availability and performance overview
          </p>

        </div>

      </div>

      {/* Driver Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {stats.map((item) => (

          <div
            key={item.id}
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-xl
            "
          >

            {/* Background Circle */}

            <div
              className="
                absolute
                -right-8
                -top-8
                h-24
                w-24
                rounded-full
                bg-gray-100
                opacity-40
              "
            />

            <div className="relative">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>

                  <h3 className="text-3xl font-bold text-slate-800 mt-2">
                    {item.value}
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
                    ${item.bg}
                    ${item.color}
                  `}
                >
                  {item.icon}
                </div>

              </div>

              {/* Percentage */}

              <div className="mt-6 flex justify-between items-center">

                <span
                  className={`
                    font-semibold
                    ${item.percentage.startsWith("-")
                      ? "text-red-600"
                      : "text-green-600"
                    }
                  `}
                >
                  {item.percentage}
                </span>

                <span className="text-xs text-gray-400">
                  This Month
                </span>

              </div>

              {/* Progress */}

              <div className="mt-3 w-full h-2 rounded-full bg-gray-200 overflow-hidden">

                <div
                  className={`
                    h-full
                    rounded-full
                    ${item.percentage.startsWith("-")
                      ? "bg-red-500"
                      : "bg-green-500"
                    }
                  `}
                  style={{
                    width:
                      item.id === 1
                        ? "90%"
                        : item.id === 2
                          ? "75%"
                          : item.id === 3
                            ? "30%"
                            : "96%",
                  }}
                />

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );

};

export default DriverStatus;