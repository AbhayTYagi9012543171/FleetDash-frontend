import React from "react";

interface RevenueCardProps {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
}

const RevenueCard: React.FC<RevenueCardProps> = ({
  title,
  value,
  change,
  positive = true,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
      <p className="text-sm text-gray-500 font-medium">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-gray-900 mt-2">
        {value}
      </h2>

      <div className="mt-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            positive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {positive ? "▲" : "▼"} {change}
        </span>
      </div>
    </div>
  );
};

export default RevenueCard;