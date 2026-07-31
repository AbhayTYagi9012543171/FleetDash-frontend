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

interface Props {
  running?: number;
  offline?: number;
  maintenance?: number;
}

const DoughnutChart = ({
  running = 98,
  offline = 22,
  maintenance = 10,
}: Props) => {
  const data = {
    labels: [
      "Running",
      "Offline",
      "Maintenance",
    ],

    datasets: [
      {
        label: "Vehicle Status",

        data: [
          running,
          offline,
          maintenance,
        ],

        backgroundColor: [
          "#22c55e",
          "#ef4444",
          "#f59e0b",
        ],

        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
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

    cutout: "70%",
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
      <Doughnut
        data={data}
        options={options}
      />
    </div>
  );
};

export default DoughnutChart;