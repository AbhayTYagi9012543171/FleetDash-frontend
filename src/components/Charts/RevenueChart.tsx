import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useMemo } from "react";

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
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
  ];

  const revenue = [
    50000,
    75000,
    95000,
    120000,
    145000,
    170000,
  ];

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Monthly Revenue",
          data: revenue,
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,0.15)",
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: "#2563eb",
        },
      ],
    }),
    []
  );

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: true,
        position: "top",
      },

      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"line">) =>
            `Revenue: ₹${Number(context.raw).toLocaleString()}`,
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          callback: (value) => `₹${Number(value) / 1000}k`,
        },
      },
    },
  };

  return (
    <div
      className="
      bg-white
      rounded-2xl
      shadow-lg
      border
      border-gray-200
      p-6
      "
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Monthly Revenue Analytics
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Fleet business revenue growth
        </p>
      </div>

      {/* KPI Cards */}
      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-5
        mb-6
        "
      >
        <div className="bg-blue-50 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Total Revenue
          </p>

          <h3 className="text-3xl font-bold text-blue-700 mt-2">
            ₹6.55L
          </h3>

          <span className="text-green-600 font-semibold">
            +18%
          </span>
        </div>

        <div className="bg-green-50 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Latest Month
          </p>

          <h3 className="text-3xl font-bold text-green-700 mt-2">
            ₹1.70L
          </h3>

          <span className="text-green-600 font-semibold">
            +12%
          </span>
        </div>

        <div className="bg-orange-50 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Average / Trip
          </p>

          <h3 className="text-3xl font-bold text-orange-600 mt-2">
            ₹2,450
          </h3>

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