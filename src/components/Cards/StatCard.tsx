import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;

  percentage?: string;
  trend?: "up" | "down";
  progress?: number;
  subtitle?: string;
  lastUpdated?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  color,

  percentage = "+12%",
  trend = "up",
  progress = 75,
  subtitle = "Compared to last month",
  lastUpdated = "Updated just now",
}: StatCardProps) => {

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {

    if (typeof value !== "number") {
      return;
    }

    let start = 0;

    const duration = 1200;

    const increment = Math.ceil(value / (duration / 20));

    const timer = setInterval(() => {

      start += increment;

      if (start >= value) {

        start = value;

        clearInterval(timer);

      }

      setDisplayValue(start);

    }, 20);

    return () => clearInterval(timer);

  }, [value]);

  const cardValue =
    typeof value === "number"
      ? displayValue
      : value;
        return (
    <div
      className="
        relative
        overflow-hidden
        bg-white
        rounded-2xl
        shadow-md
        border
        border-gray-200
        p-6
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-2xl
      "
    >

      {/* Decorative Background */}

      <div
        className="
          absolute
          top-0
          right-0
          w-24
          h-24
          rounded-full
          bg-blue-50
          -translate-y-10
          translate-x-10
        "
      />

      {/* Header */}

      <div className="relative flex justify-between items-start">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-slate-800 mt-3">

            {cardValue}

          </h2>

          <p className="text-sm text-gray-500 mt-2">
            {subtitle}
          </p>

        </div>

        <div
          className={`
            h-16
            w-16
            rounded-2xl
            flex
            items-center
            justify-center
            text-3xl
            shadow-lg
            ${color}
          `}
        >
          {icon}
        </div>

      </div>

      {/* Trend */}

      <div className="mt-6 flex items-center justify-between">

        <div
          className={`
            flex
            items-center
            gap-2
            font-semibold

            ${
              trend === "up"
                ? "text-green-600"
                : "text-red-600"
            }
          `}
        >

          {

            trend === "up"

            ?

            <FaArrowUp/>

            :

            <FaArrowDown/>

          }

          {percentage}

        </div>

        <span className="text-xs text-gray-400">
          This Month
        </span>

      </div>

      {/* Progress */}

      <div className="mt-4">

        <div className="flex justify-between mb-2">

          <span className="text-sm text-gray-500">
            Progress
          </span>

          <span className="text-sm font-semibold">
            {progress}%
          </span>

        </div>

        <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">

          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      {/* Footer */}

      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">

        <span className="text-xs text-gray-400">
          {lastUpdated}
        </span>

        <span className="text-xs font-semibold text-blue-600">
          Live Data
        </span>

      </div>

    </div>
  );

};

export default StatCard;