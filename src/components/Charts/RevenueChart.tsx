import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useMemo, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const RevenueChart = () => {

  const [filter, setFilter] = useState("Monthly");

  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const revenue = [
    12000,
    18000,
    16000,
    25000,
    28000,
    34000,
    31000,
    38000,
    42000,
    47000,
    51000,
    58000,
  ];

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Revenue",
          data: revenue,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,0.15)",
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    }),
    []
  );

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {

        display: false,

      },

    },

    scales: {

      y: {

        beginAtZero: true,

      },

    },

  };
    return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            Revenue Analytics
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Monitor fleet revenue performance
          </p>

        </div>

        {/* Filters */}

        <div className="flex gap-2 flex-wrap">

          {["Today", "Week", "Monthly", "Year"].map((item) => (

            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`
                px-4
                py-2
                rounded-lg
                font-medium
                transition
                ${
                  filter === item
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

        <div className="bg-blue-50 rounded-xl p-5">

          <p className="text-sm text-gray-500">
            Total Revenue
          </p>

          <h2 className="text-3xl font-bold text-blue-700 mt-2">
            ₹5.8L
          </h2>

          <span className="text-green-600 font-semibold">
            +18%
          </span>

        </div>

        <div className="bg-green-50 rounded-xl p-5">

          <p className="text-sm text-gray-500">
            Monthly Revenue
          </p>

          <h2 className="text-3xl font-bold text-green-700 mt-2">
            ₹58K
          </h2>

          <span className="text-green-600 font-semibold">
            +12%
          </span>

        </div>

        <div className="bg-orange-50 rounded-xl p-5">

          <p className="text-sm text-gray-500">
            Average / Trip
          </p>

          <h2 className="text-3xl font-bold text-orange-600 mt-2">
            ₹2,450
          </h2>

          <span className="text-blue-600 font-semibold">
            Stable
          </span>

        </div>

      </div>

      {/* Chart */}

      <div className="h-96">

        <Line
          data={data}
          options={options}
        />

      </div>

    </div>

  );

};

export default RevenueChart;