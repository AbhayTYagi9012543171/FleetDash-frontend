import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiSearch,
  FiRefreshCw,
  FiMapPin,
  FiTruck,
  FiAlertTriangle,
  FiActivity,
  FiUser,
  FiClock,
  FiWifi,
  FiChevronRight,
  FiNavigation,
  FiRadio,
  FiFilter,
  FiX,
} from "react-icons/fi";

import { api } from "../../services/api";
import { socket } from "../../services/socket";

import LiveMap from "../../components/Map/LiveMap";

import type { Vehicle } from "../../types/vehicle";

// ======================================================
// TYPES
// ======================================================

interface Geofence {
  _id: string;

  name: string;

  center: {
    latitude: number;
    longitude: number;
  };

  radius: number;
}

type VehicleStatus =
  | "All"
  | "Active"
  | "Idle"
  | "Maintenance"
  | "Offline";

// ======================================================
// COMPONENT
// ======================================================

const LiveTracking = () => {
  // ====================================================
  // STATE
  // ====================================================

  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [geofences, setGeofences] =
    useState<Geofence[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<VehicleStatus>("All");

  const [lastUpdated, setLastUpdated] =
    useState("");

  const [error, setError] =
    useState("");

  // ====================================================
  // FETCH VEHICLES
  // ====================================================

  const fetchVehicles = useCallback(async () => {
    try {
      setError("");

      const response =
        await api.get("/vehicles");

      const data =
        response?.data?.vehicles ??
        response?.data?.data ??
        response?.data ??
        [];

      if (Array.isArray(data)) {
        setVehicles(data);
      } else {
        setVehicles([]);
      }

      setLastUpdated(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch (err) {
      console.error(
        "Vehicle Error:",
        err
      );

      setVehicles([]);

      setError(
        "Unable to load live vehicle data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ====================================================
  // FETCH GEOFENCES
  // ====================================================

  const fetchGeofences = useCallback(async () => {
    try {
      const response =
        await api.get("/geofences");

      const data =
        response?.data?.geofences ??
        response?.data?.data ??
        response?.data ??
        [];

      if (Array.isArray(data)) {
        setGeofences(data);
      } else {
        setGeofences([]);
      }
    } catch (err) {
      console.error(
        "Geofence Error:",
        err
      );

      setGeofences([]);
    }
  }, []);

  // ====================================================
  // INITIAL LOAD + SOCKET
  // ====================================================

  useEffect(() => {
    fetchVehicles();
    fetchGeofences();

    try {
      socket.connect();

      socket.on(
        "vehicleUpdate",
        (updatedVehicle: Vehicle) => {
          setVehicles((previous) =>
            previous.map((vehicle) =>
              vehicle._id ===
              updatedVehicle._id
                ? {
                    ...vehicle,
                    ...updatedVehicle,
                  }
                : vehicle
            )
          );

          setLastUpdated(
            new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          );
        }
      );
    } catch (err) {
      console.error(
        "Socket Error:",
        err
      );
    }

    const interval =
      window.setInterval(() => {
        fetchVehicles();
      }, 30000);

    return () => {
      socket.off(
        "vehicleUpdate"
      );

      try {
        socket.disconnect();
      } catch {
        // Ignore cleanup errors
      }

      window.clearInterval(interval);
    };
  }, [
    fetchVehicles,
    fetchGeofences,
  ]);

  // ====================================================
  // REFRESH
  // ====================================================

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await Promise.all([
        fetchVehicles(),
        fetchGeofences(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  // ====================================================
  // FILTER
  // ====================================================

  const filteredVehicles =
    useMemo(() => {
      const searchValue =
        search.toLowerCase().trim();

      return vehicles.filter(
        (vehicle) => {
          const vehicleNumber =
            String(
              vehicle.vehicleNumber ?? ""
            ).toLowerCase();

          const driver =
            String(
              vehicle.driver ?? ""
            ).toLowerCase();

          const searchMatch =
            !searchValue ||
            vehicleNumber.includes(
              searchValue
            ) ||
            driver.includes(
              searchValue
            );

          const statusMatch =
            status === "All" ||
            vehicle.status === status;

          return (
            searchMatch &&
            statusMatch
          );
        }
      );
    }, [
      vehicles,
      search,
      status,
    ]);

  // ====================================================
  // STATISTICS
  // ====================================================

  const statistics =
    useMemo(() => {
      const active =
        vehicles.filter(
          (vehicle) =>
            vehicle.status === "Active"
        ).length;

      const idle =
        vehicles.filter(
          (vehicle) =>
            vehicle.status === "Idle"
        ).length;

      const maintenance =
        vehicles.filter(
          (vehicle) =>
            vehicle.status ===
            "Maintenance"
        ).length;

      const offline =
        vehicles.filter(
          (vehicle) =>
            vehicle.status === "Offline"
        ).length;

      return {
        total: vehicles.length,
        active,
        idle,
        maintenance,
        offline,
      };
    }, [vehicles]);

  // ====================================================
  // STATUS STYLE
  // ====================================================

  const getStatusStyle = (
    vehicleStatus?: string
  ) => {
    switch (
      vehicleStatus?.toLowerCase()
    ) {
      case "active":
        return {
          badge:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
          dot: "bg-emerald-500",
          icon: "text-emerald-600",
        };

      case "idle":
        return {
          badge:
            "border-amber-200 bg-amber-50 text-amber-700",
          dot: "bg-amber-500",
          icon: "text-amber-600",
        };

      case "maintenance":
        return {
          badge:
            "border-orange-200 bg-orange-50 text-orange-700",
          dot: "bg-orange-500",
          icon: "text-orange-600",
        };

      case "offline":
        return {
          badge:
            "border-slate-200 bg-slate-100 text-slate-600",
          dot: "bg-slate-400",
          icon: "text-slate-500",
        };

      default:
        return {
          badge:
            "border-slate-200 bg-slate-100 text-slate-600",
          dot: "bg-slate-400",
          icon: "text-slate-500",
        };
    }
  };

  // ====================================================
  // STAT CARD
  // ====================================================

  const StatCard = ({
    title,
    value,
    icon,
    iconBackground,
    valueColor,
    description,
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    iconBackground: string;
    valueColor: string;
    description: string;
  }) => {
    return (
      <div
        className="
          group
          relative
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          transition-all
          duration-200
          hover:-translate-y-1
          hover:border-slate-300
          hover:shadow-lg
        "
      >
        {/* subtle background decoration */}
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-50 transition-transform duration-300 group-hover:scale-125" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {title}
            </p>

            <p
              className={`mt-3 text-3xl font-extrabold tracking-tight ${valueColor}`}
            >
              {loading ? "—" : value}
            </p>

            <p className="mt-1 text-xs font-medium text-slate-400">
              {description}
            </p>
          </div>

          <div
            className={`
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              ${iconBackground}
              shadow-sm
              transition-transform
              duration-200
              group-hover:scale-110
            `}
          >
            {icon}
          </div>
        </div>
      </div>
    );
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/70">
        <div className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8">

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="animate-pulse">
              <div className="h-7 w-56 rounded-lg bg-slate-100" />
              <div className="mt-3 h-4 w-80 max-w-full rounded bg-slate-100" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-2xl border border-slate-100 bg-white"
              />
            ))}
          </div>

          <div className="h-[560px] animate-pulse rounded-3xl bg-white shadow-sm" />

          <div className="h-72 animate-pulse rounded-3xl bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  // ====================================================
  // MAIN
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-50/70">

      <div className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8">

        {/* ==================================================
            HEADER
        ================================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          {/* Top accent */}
          <div className="h-1 bg-blue-600" />

          <div className="p-5 sm:p-7">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-8 ring-blue-50/50">
                  <FiMapPin size={25} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">

                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                      Live Tracking
                    </h1>

                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      LIVE
                    </span>

                  </div>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Monitor vehicle positions, fleet activity,
                    geofences, and operational status in real time.
                  </p>
                </div>

              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                {lastUpdated && (
                  <div className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">
                    <FiClock className="text-slate-400" />

                    Last updated

                    <span className="font-bold text-slate-700">
                      {lastUpdated}
                    </span>
                  </div>
                )}

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
                    py-3
                    text-sm
                    font-bold
                    text-white
                    shadow-sm
                    transition-all
                    hover:bg-blue-700
                    hover:shadow-md
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <FiRefreshCw
                    className={
                      refreshing
                        ? "animate-spin"
                        : ""
                    }
                  />

                  {refreshing
                    ? "Refreshing..."
                    : "Refresh Fleet"}
                </button>

              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <FiAlertTriangle />
                </div>

                <div>
                  <p className="text-sm font-bold text-red-800">
                    Fleet data unavailable
                  </p>

                  <p className="mt-0.5 text-xs text-red-600">
                    {error}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
              >
                <FiRefreshCw />
                Retry
              </button>

            </div>
          </div>
        )}

        {/* ==================================================
            KPI CARDS
        ================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

          <StatCard
            title="Total Fleet"
            value={statistics.total}
            description="Registered vehicles"
            icon={<FiTruck size={21} />}
            iconBackground="bg-blue-50 text-blue-600"
            valueColor="text-slate-900"
          />

          <StatCard
            title="Active"
            value={statistics.active}
            description="Currently moving"
            icon={<FiActivity size={21} />}
            iconBackground="bg-emerald-50 text-emerald-600"
            valueColor="text-emerald-600"
          />

          <StatCard
            title="Idle"
            value={statistics.idle}
            description="Temporarily stopped"
            icon={<FiClock size={21} />}
            iconBackground="bg-amber-50 text-amber-600"
            valueColor="text-amber-600"
          />

          <StatCard
            title="Maintenance"
            value={statistics.maintenance}
            description="Requires attention"
            icon={<FiAlertTriangle size={21} />}
            iconBackground="bg-orange-50 text-orange-600"
            valueColor="text-orange-600"
          />

          <StatCard
            title="Offline"
            value={statistics.offline}
            description="Not currently connected"
            icon={<FiWifi size={21} />}
            iconBackground="bg-slate-100 text-slate-500"
            valueColor="text-slate-600"
          />

        </div>

        {/* ==================================================
            MAP
        ================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Map Header */}

          <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-7">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <div className="flex flex-wrap items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FiNavigation size={19} />
                  </div>

                  <h2 className="text-xl font-extrabold text-slate-900">
                    Fleet Map
                  </h2>

                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-extrabold tracking-wide text-emerald-700">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    LIVE TRACKING
                  </span>

                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Real-time vehicle positions and configured geofence boundaries.
                </p>
              </div>

              {/* Map legend */}

              <div className="flex flex-wrap gap-2">

                <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {statistics.active} Active
                </span>

                <span className="inline-flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  {statistics.idle} Idle
                </span>

                <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  {statistics.offline} Offline
                </span>

              </div>

            </div>
          </div>

          {/* Map */}

          <div className="relative h-[430px] w-full bg-slate-100 sm:h-[550px] lg:h-[620px]">

            <LiveMap
              vehicles={filteredVehicles}
              geofences={geofences}
            />

            {/* Map overlay info */}

            <div className="pointer-events-none absolute left-4 top-4 z-10 hidden sm:block">

              <div className="rounded-xl border border-white/70 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">

                <div className="flex items-center gap-2">

                  <FiRadio className="text-blue-600" />

                  <span className="text-xs font-bold text-slate-700">
                    Real-time connection
                  </span>

                </div>

                <p className="mt-1 text-[11px] text-slate-400">
                  {filteredVehicles.length} vehicles visible
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            FILTER TOOLBAR
        ================================================== */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

            <div>
              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FiFilter size={17} />
                </div>

                <h2 className="text-lg font-extrabold text-slate-900">
                  Vehicle Monitoring
                </h2>

              </div>

              <p className="mt-2 text-sm text-slate-500">
                Search vehicles or filter the fleet by current status.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">

              {/* Search */}

              <div className="relative md:w-80">

                <FiSearch
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search vehicle or driver..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    py-3
                    pl-10
                    pr-10
                    text-sm
                    font-medium
                    text-slate-800
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-blue-50
                  "
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    <FiX />
                  </button>
                )}

              </div>

              {/* Status */}

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as VehicleStatus
                  )
                }
                className="
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-3
                  text-sm
                  font-bold
                  text-slate-700
                  outline-none
                  transition
                  focus:border-blue-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-50
                "
              >
                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Idle">
                  Idle
                </option>

                <option value="Maintenance">
                  Maintenance
                </option>

                <option value="Offline">
                  Offline
                </option>
              </select>

            </div>

          </div>

        </section>

        {/* ==================================================
            VEHICLE LIST
        ================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* List Header */}

          <div className="border-b border-slate-200 px-5 py-5 sm:px-7">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-3">

                  <h2 className="text-xl font-extrabold text-slate-900">
                    Fleet Vehicles
                  </h2>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {filteredVehicles.length}
                  </span>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Vehicles matching your current filters.
                </p>

              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                <FiActivity className="text-emerald-500" />
                Live monitoring
              </div>

            </div>

          </div>

          {/* Empty */}

          {filteredVehicles.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <FiTruck size={34} />
              </div>

              <h3 className="mt-5 text-lg font-extrabold text-slate-800">
                No vehicles found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                No vehicles match your current search or status filter.
                Try changing your filters.
              </p>

              {(search ||
                status !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatus("All");
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  <FiX />
                  Clear Filters
                </button>
              )}

            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {filteredVehicles.map(
                (vehicle) => {
                  const vehicleStatus =
                    getStatusStyle(
                      vehicle.status
                    );

                  return (
                    <div
                      key={
                        vehicle._id ??
                        vehicle.vehicleNumber
                      }
                      className="
                        group
                        flex
                        flex-col
                        gap-5
                        p-5
                        transition-all
                        duration-200
                        hover:bg-slate-50/80
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:px-7
                      "
                    >

                      {/* Vehicle Info */}

                      <div className="flex min-w-0 items-center gap-4">

                        <div className="relative">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                            <FiTruck size={21} />
                          </div>

                          {vehicle.status ===
                            "Active" && (
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
                            </span>
                          )}

                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="truncate text-sm font-extrabold text-slate-800 sm:text-base">
                              {vehicle.vehicleNumber ||
                                "Unknown Vehicle"}
                            </h3>

                            <span
                              className={`
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                border
                                px-2.5
                                py-1
                                text-[10px]
                                font-extrabold
                                uppercase
                                tracking-wide
                                ${vehicleStatus.badge}
                              `}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${vehicleStatus.dot}`}
                              />

                              {vehicle.status ||
                                "Unknown"}
                            </span>

                          </div>

                          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">

                            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <FiUser className="text-slate-400" />

                              {vehicle.driver ||
                                "Driver not assigned"}
                            </span>

                            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

                            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                              <FiMapPin />

                              GPS tracking
                            </span>

                          </div>

                        </div>

                      </div>

                      {/* Tracking */}

                      <div className="flex items-center justify-between gap-5 sm:justify-end">

                        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">

                          <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                            Tracking
                          </p>

                          <div className="mt-1 flex items-center gap-1.5">

                            <span className="relative flex h-2 w-2">

                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

                              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />

                            </span>

                            <span className="text-xs font-bold text-emerald-600">
                              Live
                            </span>

                          </div>

                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-300 transition group-hover:border-blue-200 group-hover:text-blue-600">
                          <FiChevronRight
                            size={18}
                            className="transition-transform group-hover:translate-x-0.5"
                          />
                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

          <div className="flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2 font-medium text-slate-500">

              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <FiActivity />
              </span>

              Live fleet monitoring is active.

            </div>

            <div className="flex items-center gap-2 text-slate-400">

              <FiRefreshCw />

              Automatic refresh every 30 seconds.

            </div>

          </div>

        </footer>

      </div>
    </div>
  );
};

export default LiveTracking;