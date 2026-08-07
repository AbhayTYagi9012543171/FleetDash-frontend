
import {
  useEffect,
  useState,
} from "react";

import {
  api,
} from "../../services/api";

import StatCard from "../../components/Cards/StatCard";

import {
  FaTruck,
  FaUsers,
  FaRoute,
  FaBell,
  FaSyncAlt,
} from "react-icons/fa";

// ==========================================
// Dashboard Data Interface
// ==========================================

interface DashboardData {
  totalVehicles: number;
  totalDrivers: number;
  totalTrips: number;
  totalAlerts: number;
}

// ==========================================
// Admin Dashboard
// ==========================================

const AdminDashboard = () => {
  // ========================================
  // State
  // ========================================

  const [data, setData] =
    useState<DashboardData>({
      totalVehicles: 0,
      totalDrivers: 0,
      totalTrips: 0,
      totalAlerts: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  // ========================================
  // Fetch Dashboard
  // ========================================

  const fetchDashboard = async () => {
    try {
      setError("");

      const response =
        await api.get("/dashboard");

      console.log(
        "Dashboard:",
        response.data
      );

      const dashboard =
        response?.data?.data ??
        response?.data?.dashboard ??
        response?.data ??
        {};

      setData({
        totalVehicles:
          Number(
            dashboard.totalVehicles ??
            dashboard.vehicles ??
            0
          ),

        totalDrivers:
          Number(
            dashboard.totalDrivers ??
            dashboard.drivers ??
            0
          ),

        totalTrips:
          Number(
            dashboard.totalTrips ??
            dashboard.trips ??
            0
          ),

        totalAlerts:
          Number(
            dashboard.totalAlerts ??
            dashboard.alerts ??
            0
          ),
      });
    } catch (err) {
      console.error(
        "Dashboard Error:",
        err
      );

      setError(
        "Unable to load dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // Initial Load
  // ========================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ========================================
  // Refresh
  // ========================================

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await fetchDashboard();
    } finally {
      setRefreshing(false);
    }
  };

  // ========================================
  // Loading State
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">

          <div className="mb-8">
            <div className="h-8 w-72 animate-pulse rounded-lg bg-gray-200" />

            <div className="mt-3 h-4 w-96 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-2xl bg-white shadow-sm"
                />
              )
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="h-72 animate-pulse rounded-2xl bg-white shadow-sm" />

            <div className="h-72 animate-pulse rounded-2xl bg-white shadow-sm" />
          </div>

        </div>
      </div>
    );
  }

  // ========================================
  // Dashboard
  // ========================================

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">

        {/* ==================================
            HEADER
        ================================== */}

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              FleetDash Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage and monitor your complete fleet system from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <FaSyncAlt
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

        {/* ==================================
            ERROR
        ================================== */}

        {error && (
          <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="font-semibold text-red-800">
                Dashboard Error
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>

          </div>
        )}

        {/* ==================================
            STATISTICS
        ================================== */}

        <section>

          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              Fleet Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current fleet performance at a glance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Total Vehicles"
              value={data.totalVehicles}
              icon={<FaTruck />}
              color="text-blue-600"
              percentage="+8%"
            />

            <StatCard
              title="Total Drivers"
              value={data.totalDrivers}
              icon={<FaUsers />}
              color="text-green-600"
              percentage="+5%"
            />

            <StatCard
              title="Total Trips"
              value={data.totalTrips}
              icon={<FaRoute />}
              color="text-purple-600"
              percentage="+12%"
            />

            <StatCard
              title="Alerts"
              value={data.totalAlerts}
              icon={<FaBell />}
              color="text-red-600"
              percentage="-2%"
            />

          </div>

        </section>

        {/* ==================================
            MAIN CONTENT
        ================================== */}

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Fleet Overview */}

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Fleet Overview
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Summary of your current fleet.
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FaTruck size={20} />
              </div>

            </div>

            <div className="mt-6 space-y-5">

              {/* Vehicles */}

              <div>

                <div className="mb-2 flex items-center justify-between text-sm">

                  <span className="font-medium text-gray-600">
                    Vehicles
                  </span>

                  <span className="font-bold text-gray-800">
                    {data.totalVehicles}
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">

                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width:
                        data.totalVehicles > 0
                          ? "75%"
                          : "0%",
                    }}
                  />

                </div>

              </div>

              {/* Drivers */}

              <div>

                <div className="mb-2 flex items-center justify-between text-sm">

                  <span className="font-medium text-gray-600">
                    Drivers
                  </span>

                  <span className="font-bold text-gray-800">
                    {data.totalDrivers}
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">

                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width:
                        data.totalDrivers > 0
                          ? "65%"
                          : "0%",
                    }}
                  />

                </div>

              </div>

              {/* Trips */}

              <div>

                <div className="mb-2 flex items-center justify-between text-sm">

                  <span className="font-medium text-gray-600">
                    Trips
                  </span>

                  <span className="font-bold text-gray-800">
                    {data.totalTrips}
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">

                  <div
                    className="h-full rounded-full bg-purple-500"
                    style={{
                      width:
                        data.totalTrips > 0
                          ? "85%"
                          : "0%",
                    }}
                  />

                </div>

              </div>

              {/* Alerts */}

              <div>

                <div className="mb-2 flex items-center justify-between text-sm">

                  <span className="font-medium text-gray-600">
                    Alerts
                  </span>

                  <span className="font-bold text-gray-800">
                    {data.totalAlerts}
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">

                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{
                      width:
                        data.totalAlerts > 0
                          ? "35%"
                          : "0%",
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* Recent Activities */}

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Recent Activities
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Latest fleet updates and activities.
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <FaBell size={18} />
              </div>

            </div>

            <div className="mt-6">

              <div className="flex items-start gap-4 border-b border-gray-100 pb-5">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <FaTruck />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    Fleet data synchronized
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Dashboard information was successfully updated.
                  </p>
                </div>

              </div>

              <div className="mt-5 flex items-start gap-4 border-b border-gray-100 pb-5">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <FaUsers />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    Driver management
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Driver information is available from the management section.
                  </p>
                </div>

              </div>

              <div className="mt-5 flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <FaRoute />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    Trip monitoring
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Monitor current and completed fleet trips.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ==================================
            QUICK SUMMARY
        ================================== */}

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FaTruck />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Vehicles
                </p>

                <p className="text-2xl font-bold text-gray-800">
                  {data.totalVehicles}
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <FaUsers />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Drivers
                </p>

                <p className="text-2xl font-bold text-gray-800">
                  {data.totalDrivers}
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <FaRoute />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Trips
                </p>

                <p className="text-2xl font-bold text-gray-800">
                  {data.totalTrips}
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* ==================================
            FOOTER
        ================================== */}

        <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-center text-sm text-gray-500 shadow-sm">
          FleetDash Admin Panel
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
