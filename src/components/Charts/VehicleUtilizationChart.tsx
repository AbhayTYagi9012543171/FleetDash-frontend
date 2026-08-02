import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const VehicleUtilizationChart = () => {

  const data = {

    labels: [

      "Active",

      "Idle",

      "Maintenance",

      "Offline",

    ],

    datasets: [

      {

        data: [

          62,
          18,
          12,
          8,

        ],

        backgroundColor: [

          "#22c55e",
          "#facc15",
          "#f97316",
          "#ef4444",

        ],

        borderWidth: 0,

        hoverOffset: 12,

      },

    ],

  };

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    cutout: "72%",

    plugins: {

      legend: {

        position: "bottom" as const,

        labels: {

          usePointStyle: true,

          padding: 20,

          font: {

            size: 13,

          },

        },

      },

    },

  };
    return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            Vehicle Utilization
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Fleet availability and operational status
          </p>

        </div>

        <div className="bg-green-50 px-5 py-3 rounded-xl">

          <p className="text-xs text-gray-500">
            Fleet Availability
          </p>

          <h3 className="text-2xl font-bold text-green-600">
            92%
          </h3>

        </div>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <div className="bg-green-50 rounded-xl p-4">

          <p className="text-sm text-gray-500">
            Active
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            62
          </h2>

        </div>

        <div className="bg-yellow-50 rounded-xl p-4">

          <p className="text-sm text-gray-500">
            Idle
          </p>

          <h2 className="text-3xl font-bold text-yellow-600 mt-2">
            18
          </h2>

        </div>

        <div className="bg-orange-50 rounded-xl p-4">

          <p className="text-sm text-gray-500">
            Maintenance
          </p>

          <h2 className="text-3xl font-bold text-orange-600 mt-2">
            12
          </h2>

        </div>

        <div className="bg-red-50 rounded-xl p-4">

          <p className="text-sm text-gray-500">
            Offline
          </p>

          <h2 className="text-3xl font-bold text-red-600 mt-2">
            8
          </h2>

        </div>

      </div>

      {/* Doughnut Chart */}

      <div className="relative h-[420px]">

        <Doughnut
          data={data}
          options={options}
        />

        {/* Center Content */}

        <div
          className="
            absolute
            inset-0
            flex
            flex-col
            items-center
            justify-center
            pointer-events-none
          "
        >

          <span className="text-sm text-gray-500">
            Total Fleet
          </span>

          <h2 className="text-5xl font-bold text-slate-800">
            100
          </h2>

          <p className="text-green-600 font-semibold mt-2">
            92% Available
          </p>

        </div>

      </div>

      {/* Footer */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

        <div className="bg-gray-50 rounded-xl p-4">

          <p className="text-sm text-gray-500">
            Utilization Rate
          </p>

          <h3 className="text-2xl font-bold text-blue-600 mt-2">
            84%
          </h3>

        </div>

        <div className="bg-gray-50 rounded-xl p-4">

          <p className="text-sm text-gray-500">
            Running Vehicles
          </p>

          <h3 className="text-2xl font-bold text-green-600 mt-2">
            62
          </h3>

        </div>

        <div className="bg-gray-50 rounded-xl p-4">

          <p className="text-sm text-gray-500">
            Service Due
          </p>

          <h3 className="text-2xl font-bold text-orange-600 mt-2">
            12
          </h3>

        </div>

      </div>

    </div>
  );

};

export default VehicleUtilizationChart;