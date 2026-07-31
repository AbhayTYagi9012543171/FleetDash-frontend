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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  labels?: string[];
  values?: number[];
}

const LineChart = ({
  labels,
  values,
}: Props) => {
  const chartData = {
    labels: labels || [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ],

    datasets: [
      {
        label: "Running Vehicles",

        data: values || [
          80,
          92,
          88,
          105,
          95,
          115,
          98,
        ],

        borderColor: "#2563eb",

        backgroundColor: "rgba(37,99,235,0.15)",

        fill: true,

        tension: 0.4,

        pointRadius: 4,

        pointHoverRadius: 6,

        pointBackgroundColor: "#2563eb",

        pointBorderColor: "#ffffff",

        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: true,

        position: "bottom" as const,

        labels: {
          boxWidth: 14,

          boxHeight: 14,

          padding: 16,

          font: {
            size: 12,
          },
        },
      },

      tooltip: {
        backgroundColor: "#1f2937",

        titleColor: "#ffffff",

        bodyColor: "#ffffff",

        padding: 10,
      },
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          font: {
            size: 12,
          },
        },

        grid: {
          color: "#e5e7eb",
        },
      },

      x: {
        ticks: {
          font: {
            size: 12,
          },
        },

        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div
      className="
        w-full
        h-64
        sm:h-72
        md:h-80
        overflow-hidden
      "
    >
      <Line
        data={chartData}
        options={options}
      />
    </div>
  );
};

export default LineChart;