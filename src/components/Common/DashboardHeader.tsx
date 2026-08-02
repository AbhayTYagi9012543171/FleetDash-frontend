import { useEffect, useState } from "react";
import {
  FaTruck,
  FaTools,
  FaCheckCircle,
  FaSyncAlt,
  FaUserCircle,
  FaHeartbeat,
  FaGasPump,
  FaBell,
  FaSearch,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

import { useAppSelector } from "../../redux/hooks";
import type { DashboardData } from "../../hooks/useDashboard";

interface DashboardHeaderProps {
  dashboard: DashboardData;
  lastUpdated?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const DashboardHeader = ({
  dashboard,
  lastUpdated,
  onRefresh,
  refreshing,
}: DashboardHeaderProps) => {
  const user = useAppSelector((state) => state.auth.user);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const today = currentTime.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const clock = currentTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const fleetHealth = Math.round(
    dashboard.totalVehicles > 0
      ? (dashboard.activeVehicles / dashboard.totalVehicles) * 100
      : 0
  );
  return (
  <div
    className="
      bg-gradient-to-r
      from-slate-900
      via-blue-900
      to-indigo-900
      rounded-3xl
      shadow-xl
      p-6
      text-white
      mb-8
    "
  >
    {/* Header */}

    <div className="flex flex-col xl:flex-row justify-between gap-8">

      {/* Left */}

      <div className="flex-1">

        <h1 className="text-4xl font-bold">
          {greeting},{" "}
          <span className="text-cyan-300">
            {user?.username || "Abhay"}
          </span>
          👋
        </h1>

        <p className="mt-3 text-blue-100 text-lg">
          Fleet Management Control Center
        </p>

        <p className="text-blue-200 mt-2">
          Monitor vehicles, drivers and fleet performance
          in real time.
        </p>

        <div className="flex flex-wrap gap-6 mt-6">

          <div className="flex items-center gap-2">

            <FaCalendarAlt className="text-cyan-300"/>

            <span className="text-sm">
              {today}
            </span>

          </div>

          <div className="flex items-center gap-2">

            <FaClock className="text-cyan-300"/>

            <span className="text-sm">
              {clock}
            </span>

          </div>

        </div>

      </div>

      {/* Right */}

      <div
        className="
          flex
          flex-col
          gap-4
          w-full
          xl:w-auto
        "
      >

        {/* Search */}

        <div className="relative">

          <FaSearch
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Search vehicles, drivers..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="
              w-full
              xl:w-96
              bg-white
              text-slate-700
              rounded-xl
              pl-12
              pr-4
              py-3
              outline-none
              focus:ring-4
              focus:ring-cyan-400
            "
          />

        </div>

        {/* Action Buttons */}

        <div className="flex flex-wrap gap-3">

          <button
            className="
              relative
              bg-white/20
              backdrop-blur-md
              p-3
              rounded-xl
              hover:bg-white/30
              transition
            "
          >

            <FaBell className="text-xl"/>

            <span
              className="
                absolute
                -top-1
                -right-1
                bg-red-500
                text-white
                rounded-full
                h-5
                w-5
                text-xs
                flex
                items-center
                justify-center
              "
            >
              4
            </span>

          </button>

          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="
              flex
              items-center
              gap-2
              bg-cyan-500
              hover:bg-cyan-600
              px-5
              py-3
              rounded-xl
              font-semibold
              transition
            "
          >

            <FaSyncAlt
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing ? "Refreshing..." : "Refresh"}

          </button>

          <div
            className="
              flex
              items-center
              gap-3
              bg-white/20
              backdrop-blur-md
              rounded-xl
              px-4
              py-2
            "
          >

            <FaUserCircle className="text-4xl"/>

            <div>

              <h3 className="font-semibold">
                {user?.username || "Abhay"}
              </h3>

              <p className="text-sm text-blue-100">
                {user?.role || "Administrator"}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

    {/* Fleet Quick Info */}

    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-4
        mt-8
      "
    >

      <div
        className="
          bg-white/10
          backdrop-blur-md
          rounded-2xl
          p-5
        "
      >

        <div className="flex items-center gap-3">

          <FaHeartbeat className="text-3xl text-green-300"/>

          <div>

            <p className="text-sm text-blue-100">
              Fleet Health
            </p>

            <h3 className="text-3xl font-bold">
              {fleetHealth}%
            </h3>

          </div>

        </div>

      </div>

      <div
        className="
          bg-white/10
          backdrop-blur-md
          rounded-2xl
          p-5
        "
      >

        <div className="flex items-center gap-3">

          <FaGasPump className="text-3xl text-yellow-300"/>

          <div>

            <p className="text-sm text-blue-100">
              Fuel Today
            </p>

            <h3 className="text-3xl font-bold">
              640 L
            </h3>

          </div>

        </div>

      </div>

      <div
        className="
          bg-white/10
          backdrop-blur-md
          rounded-2xl
          p-5
        "
      >

        <p className="text-sm text-blue-100">
          Last Sync
        </p>

        <h3 className="text-2xl font-bold mt-2">
          {lastUpdated || "--"}
        </h3>

      </div>

    </div>
        {/* KPI Cards */}

    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-6
        mt-8
      "
    >

      {/* Total Vehicles */}

      <div
        className="
          bg-white
          rounded-2xl
          p-6
          shadow-lg
          hover:shadow-2xl
          hover:-translate-y-1
          transition-all
          duration-300
        "
      >

        <div className="flex justify-between items-center">

          <div>

            <p className="text-gray-500 text-sm">
              Total Vehicles
            </p>

            <h2 className="text-4xl font-bold text-slate-800 mt-2">
              {dashboard.totalVehicles}
            </h2>

            <p className="text-green-600 text-sm mt-2 font-medium">
              ↑ 8% this month
            </p>

          </div>

          <div
            className="
              h-16
              w-16
              rounded-2xl
              bg-blue-100
              flex
              items-center
              justify-center
            "
          >
            <FaTruck className="text-3xl text-blue-600" />
          </div>

        </div>

      </div>

      {/* Active Vehicles */}

      <div
        className="
          bg-white
          rounded-2xl
          p-6
          shadow-lg
          hover:shadow-2xl
          hover:-translate-y-1
          transition-all
          duration-300
        "
      >

        <div className="flex justify-between items-center">

          <div>

            <p className="text-gray-500 text-sm">
              Active Vehicles
            </p>

            <h2 className="text-4xl font-bold text-slate-800 mt-2">
              {dashboard.activeVehicles}
            </h2>

            <p className="text-green-600 text-sm mt-2 font-medium">
              ↑ Running Smoothly
            </p>

          </div>

          <div
            className="
              h-16
              w-16
              rounded-2xl
              bg-green-100
              flex
              items-center
              justify-center
            "
          >
            <FaCheckCircle className="text-3xl text-green-600" />
          </div>

        </div>

      </div>

      {/* Maintenance */}

      <div
        className="
          bg-white
          rounded-2xl
          p-6
          shadow-lg
          hover:shadow-2xl
          hover:-translate-y-1
          transition-all
          duration-300
        "
      >

        <div className="flex justify-between items-center">

          <div>

            <p className="text-gray-500 text-sm">
              Maintenance Due
            </p>

            <h2 className="text-4xl font-bold text-slate-800 mt-2">
              {dashboard.totalAlerts}
            </h2>

            <p className="text-orange-600 text-sm mt-2 font-medium">
              Needs Attention
            </p>

          </div>

          <div
            className="
              h-16
              w-16
              rounded-2xl
              bg-orange-100
              flex
              items-center
              justify-center
            "
          >
            <FaTools className="text-3xl text-orange-600" />
          </div>

        </div>

      </div>

      {/* Drivers */}

      <div
        className="
          bg-white
          rounded-2xl
          p-6
          shadow-lg
          hover:shadow-2xl
          hover:-translate-y-1
          transition-all
          duration-300
        "
      >

        <div className="flex justify-between items-center">

          <div>

            <p className="text-gray-500 text-sm">
              Active Drivers
            </p>

            <h2 className="text-4xl font-bold text-slate-800 mt-2">
              {dashboard.totalDrivers}
            </h2>

            <p className="text-cyan-600 text-sm mt-2 font-medium">
              All Drivers Available
            </p>

          </div>

          <div
            className="
              h-16
              w-16
              rounded-2xl
              bg-cyan-100
              flex
              items-center
              justify-center
            "
          >
            <FaUserCircle className="text-3xl text-cyan-600" />
          </div>

        </div>

      </div>

    </div>
        {/* Bottom Dashboard Status */}

    <div
      className="
        mt-8
        border-t
        border-white/20
        pt-6
        flex
        flex-col
        md:flex-row
        justify-between
        items-center
        gap-4
      "
    >

      {/* Left */}

      <div className="flex items-center gap-3">

        <div
          className="
            h-3
            w-3
            rounded-full
            bg-green-400
            animate-pulse
          "
        />

        <span className="text-sm text-blue-100">
          System Status: All Services Operational
        </span>

      </div>

      {/* Right */}

      <div className="flex flex-wrap gap-6 text-sm text-blue-100">

        <span>
          🚚 Vehicles: {dashboard.totalVehicles}
        </span>

        <span>
          👨 Drivers: {dashboard.totalDrivers}
        </span>

        <span>
          ❤️ Fleet Health: {fleetHealth}%
        </span>

      </div>

    </div>

  </div>
);

};

export default DashboardHeader;