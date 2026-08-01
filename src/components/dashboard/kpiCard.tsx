import React from "react";

interface Props {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const KpiCard = ({
  title,
  value,
  icon: Icon,
  color,
  description,
}: Props) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {title}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-2">
            {value}
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            {description}
          </p>
        </div>

        <div
          className={`${color} h-14 w-14 rounded-xl flex items-center justify-center`}
        >
          <Icon className="text-white text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default KpiCard;