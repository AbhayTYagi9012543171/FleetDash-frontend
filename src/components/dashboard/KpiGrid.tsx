import React from "react";

import KpiCard from "../dashboard/kpiCard";

import {
  FaTruck,
  FaGasPump,
  FaUserTie,
  FaWallet,
  FaTools,
  FaCheckCircle,
} from "react-icons/fa";

import type { DashboardData } from "../../hooks/useDashboard";


interface KpiGridProps {
  dashboard: DashboardData;
}



const KpiGrid: React.FC<KpiGridProps> = ({
  dashboard,
}) => {



  const stats = [

    {
      title: "Fleet Health Score",
      value: "85%",
      icon: FaTruck,
      color:
        "bg-gradient-to-r from-green-500 to-emerald-600",
      description:
        "Excellent vehicle condition",
      trend:
        "↑ 5% this month",
    },


    {
      title: "Fuel Analytics",
      value: "₹2,45,000",
      icon: FaGasPump,
      color:
        "bg-gradient-to-r from-yellow-400 to-orange-500",
      description:
        "Average Mileage 14.8 km/L",
      trend:
        "+3.2%",
    },


    {
      title: "Active Drivers",
      value: String(
        dashboard.totalDrivers || 0
      ),
      icon: FaUserTie,
      color:
        "bg-gradient-to-r from-blue-500 to-indigo-600",
      description:
        "Currently active drivers",
      trend:
        "+6%",
    },


    {
      title: "Today's Revenue",
      value: "₹1,25,000",
      icon: FaWallet,
      color:
        "bg-gradient-to-r from-purple-500 to-pink-600",
      description:
        "Daily business earnings",
      trend:
        "+12%",
    },


    {
      title: "Vehicle Availability",
      value:
        `${dashboard.activeVehicles || 42}/${dashboard.totalVehicles || 50}`,
      icon: FaCheckCircle,
      color:
        "bg-gradient-to-r from-cyan-500 to-blue-600",
      description:
        "84% vehicles available",
      trend:
        "+3 Vehicles",
    },


    {
      title: "Maintenance Due",
      value: String(
        dashboard.totalAlerts || 0
      ),
      icon: FaTools,
      color:
        "bg-gradient-to-r from-red-500 to-rose-600",
      description:
        "Service required",
      trend:
        "Attention",
    },


  ];





  return (

    <section
      className="
      w-full
      "
    >


      <div
        className="
        mb-5
        "
      >


        <h2
          className="
          text-xl
          sm:text-2xl
          font-bold
          text-slate-800
          "
        >

          Fleet Performance Overview

        </h2>



        <p
          className="
          text-sm
          text-gray-500
          mt-1
          "
        >

          Real-time fleet monitoring metrics

        </p>


      </div>






      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-3
        gap-5
        "
      >


        {
          stats.map((item)=>(


            <KpiCard

              key={item.title}

              title={item.title}

              value={item.value}

              icon={item.icon}

              color={item.color}

              description={item.description}

              trend={item.trend}

            />


          ))
        }


      </div>



    </section>


  );


};



export default KpiGrid;