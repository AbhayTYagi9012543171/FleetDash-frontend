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
    <div
      className="
        w-full
        bg-white
        rounded-2xl
        shadow-md
        border
        border-gray-200
        p-4
        sm:p-5
        lg:p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-gray-500 truncate">
            {title}
          </p>

          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-800 break-words">
            {value}
          </h2>
        </div>

        <div
          className={`
            flex
            items-center
            justify-center
            shrink-0
            w-12
            h-12
            sm:w-14
            sm:h-14
            rounded-full
            bg-gray-100
            text-xl
            sm:text-2xl
            ${color}
          `}
        >
          {icon}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
          <span className="font-semibold text-green-600">
            {percentage}
          </span>

          <span className="text-gray-400 whitespace-nowrap">
            This Month
          </span>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-3/4 rounded-full bg-blue-600"></div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;