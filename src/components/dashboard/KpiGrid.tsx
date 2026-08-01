import React from "react";
import KpiCard from "../dashboard/kpiCard";
import { dashboardStats } from "../../data/dashboardStats";

const KpiGrid: React.FC = () => {
  return (
    <section className="w-full">
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-3
          gap-6
        "
      >
        {dashboardStats.map((item) => (
          <KpiCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
};

export default KpiGrid;