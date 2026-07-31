import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  percentage?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  color,
  percentage = "+12%",
}: StatCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>

          <h2 className="text-3xl font-bold mt-2 text-gray-800">
            {value}
          </h2>
        </div>

        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-gray-100 ${color}`}
        >
          {icon}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-green-600 font-semibold">
            {percentage}
          </span>

          <span className="text-gray-400">
            This Month
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;