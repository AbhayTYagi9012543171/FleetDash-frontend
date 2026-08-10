import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiActivity,
  FiCalendar,
  FiCircle,
  FiCompass,
  FiMap,
  FiMapPin,
  FiNavigation,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTarget,
  FiX,
} from "react-icons/fi";

import toast from "react-hot-toast";

import { api } from "../../services/api";
import AddGeofenceModal from "../../components/geofence/AddGeofenceModal";

// ======================================================
// TYPES
// ======================================================

interface GeofenceCenter {
  latitude: number;
  longitude: number;
}

interface Geofence {
  _id: string;
  name: string;
  center: GeofenceCenter;
  radius: number;
  createdAt?: string;
}

interface GeofenceApiResponse {
  success?: boolean;
  message?: string;
  geofences?: Geofence[];
  data?: Geofence[] | { geofences?: Geofence[] };
}

// ======================================================
// COMPONENT
// ======================================================

const Geofence = () => {
  // ====================================================
  // STATE
  // ====================================================

  const [geofences, setGeofences] = useState<Geofence[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);

  // ====================================================
  // FETCH GEOFENCES
  // ====================================================

  const fetchGeofences = useCallback(
    async (showToast = false) => {
      try {
        setError("");

        if (geofences.length > 0 || showToast) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response =
          await api.get<GeofenceApiResponse | Geofence[]>(
            "/geofences"
          );

        const responseData = response.data;

        let data: Geofence[] = [];

        if (Array.isArray(responseData)) {
          data = responseData;
        } else if (
          Array.isArray(responseData?.geofences)
        ) {
          data = responseData.geofences;
        } else if (
          Array.isArray(responseData?.data)
        ) {
          data = responseData.data;
        } else if (
          responseData?.data &&
          !Array.isArray(responseData.data) &&
          Array.isArray(
            responseData.data.geofences
          )
        ) {
          data = responseData.data.geofences;
        }

        setGeofences(data);

        if (showToast) {
          toast.success("Geofences refreshed");
        }
      } catch (err: unknown) {
        console.error("Geofence Error:", err);

        let message =
          "Unable to load geofences.";

        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err
        ) {
          const axiosError = err as {
            response?: {
              data?: {
                message?: string;
              };
            };
          };

          message =
            axiosError.response?.data?.message ||
            message;
        }

        setError(message);

        if (geofences.length === 0) {
          setGeofences([]);
        }

        toast.error(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [geofences.length]
  );

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    fetchGeofences();
  }, [fetchGeofences]);

  // ====================================================
  // SEARCH
  // ====================================================

  const filteredGeofences = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    if (!searchValue) {
      return geofences;
    }

    return geofences.filter((item) => {
      const name =
        item.name?.toLowerCase() || "";

      const latitude = String(
        item.center?.latitude ?? ""
      );

      const longitude = String(
        item.center?.longitude ?? ""
      );

      const radius = String(
        item.radius ?? ""
      );

      return (
        name.includes(searchValue) ||
        latitude.includes(searchValue) ||
        longitude.includes(searchValue) ||
        radius.includes(searchValue)
      );
    });
  }, [geofences, search]);

  // ====================================================
  // STATISTICS
  // ====================================================

  const statistics = useMemo(() => {
    const total = geofences.length;

    if (total === 0) {
      return {
        total: 0,
        averageRadius: 0,
        largestRadius: 0,
        smallestRadius: 0,
      };
    }

    const radii = geofences.map((item) => {
      const radius = Number(item.radius);

      return Number.isFinite(radius)
        ? radius
        : 0;
    });

    const totalRadius = radii.reduce(
      (sum, radius) => sum + radius,
      0
    );

    return {
      total,
      averageRadius: Math.round(
        totalRadius / total
      ),
      largestRadius: Math.max(...radii),
      smallestRadius: Math.min(...radii),
    };
  }, [geofences]);

  // ====================================================
  // HELPERS
  // ====================================================

  const formatCoordinate = (
    value?: number
  ) => {
    if (
      value === undefined ||
      value === null ||
      !Number.isFinite(Number(value))
    ) {
      return "N/A";
    }

    return Number(value).toFixed(6);
  };

  const formatRadius = (
    radius?: number
  ) => {
    const value = Number(radius);

    if (
      !Number.isFinite(value) ||
      value <= 0
    ) {
      return "0 m";
    }

    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)} km`;
    }

    return `${Math.round(value)} m`;
  };

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(parsedDate.getTime())
    ) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString(
      undefined,
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const clearSearch = () => {
    setSearch("");
  };

  // ====================================================
  // LOADING STATE
  // ====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-[1500px] space-y-7 p-4 sm:p-6 lg:p-8">

          {/* Header Skeleton */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="animate-pulse">

              <div className="flex items-center gap-4">

                <div className="h-14 w-14 rounded-2xl bg-slate-100" />

                <div className="flex-1">

                  <div className="h-8 w-72 max-w-full rounded-lg bg-slate-100" />

                  <div className="mt-3 h-4 w-[480px] max-w-full rounded-lg bg-slate-100" />

                </div>

              </div>

            </div>
          </section>

          {/* KPI Skeleton */}

          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="h-11 w-11 rounded-xl bg-slate-100" />

                  <div className="mt-5 h-3 w-24 rounded bg-slate-100" />

                  <div className="mt-3 h-7 w-20 rounded bg-slate-100" />
                </div>
              )
            )}

          </section>

          {/* Toolbar Skeleton */}

          <div className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />

          {/* Table Skeleton */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="space-y-4">

              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-16 animate-pulse rounded-xl bg-slate-100"
                  />
                )
              )}

            </div>

          </section>

        </div>
      </div>
    );
  }

  // ====================================================
  // MAIN
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      <div className="mx-auto max-w-[1500px] space-y-7 p-4 sm:p-6 lg:p-8">

        {/* ==================================================
            HEADER
        ================================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-50 blur-3xl" />

          <div className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-40 rounded-full bg-indigo-50 blur-3xl" />

          <div className="relative p-6 sm:p-8">

            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

              {/* Title */}

              <div className="flex items-start gap-4">

                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200">

                  <FiMapPin size={25} />

                  <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-emerald-500" />

                </div>

                <div className="min-w-0">

                  <div className="flex flex-wrap items-center gap-3">

                    <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                      Geofence Management
                    </h1>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">

                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                      Live

                    </span>

                  </div>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Create, monitor and manage
                    geographic boundaries for your
                    fleet operations.
                  </p>

                </div>

              </div>

              {/* Actions */}

              <div className="flex flex-col gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={() =>
                    fetchGeofences(true)
                  }
                  disabled={refreshing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <FiRefreshCw
                    size={16}
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

                <button
                  type="button"
                  onClick={() =>
                    setOpenModal(true)
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                >

                  <FiPlus size={17} />

                  Add Geofence

                </button>

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">

                  <FiX />

                </div>

                <div>

                  <p className="font-semibold text-red-900">
                    Geofence service unavailable
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    {error}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  fetchGeofences(true)
                }
                disabled={refreshing}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                Retry
              </button>

            </div>

          </section>
        )}

        {/* ==================================================
            KPI CARDS
        ================================================== */}

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total */}

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/40">

            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-blue-50 blur-2xl transition group-hover:bg-blue-100" />

            <div className="relative">

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                  <FiMap size={21} />

                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-600">
                  Active
                </span>

              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                Total Geofences
              </p>

              <div className="mt-1 flex items-end gap-2">

                <p className="text-3xl font-bold tracking-tight text-slate-950">
                  {statistics.total}
                </p>

                <span className="mb-1 text-xs text-slate-400">
                  boundaries
                </span>

              </div>

              <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-100">

                <div className="h-full w-full rounded-full bg-blue-500" />

              </div>

            </div>

          </div>

          {/* Average */}

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100/40">

            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-indigo-50 blur-2xl" />

            <div className="relative">

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                  <FiTarget size={21} />

                </div>

                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase text-indigo-600">
                  Average
                </span>

              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                Average Radius
              </p>

              <div className="mt-1 flex items-end gap-2">

                <p className="text-3xl font-bold tracking-tight text-slate-950">
                  {statistics.averageRadius}
                </p>

                <span className="mb-1 text-sm font-semibold text-slate-400">
                  m
                </span>

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Across all configured zones
              </p>

            </div>

          </div>

          {/* Largest */}

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100/40">

            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-purple-50 blur-2xl" />

            <div className="relative">

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">

                  <FiCircle size={21} />

                </div>

                <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-bold uppercase text-purple-600">
                  Maximum
                </span>

              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                Largest Radius
              </p>

              <div className="mt-1 flex items-end gap-2">

                <p className="text-3xl font-bold tracking-tight text-slate-950">
                  {statistics.largestRadius}
                </p>

                <span className="mb-1 text-sm font-semibold text-slate-400">
                  m
                </span>

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Maximum configured boundary
              </p>

            </div>

          </div>

          {/* Smallest */}

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100/40">

            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-emerald-50 blur-2xl" />

            <div className="relative">

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                  <FiActivity size={21} />

                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-600">
                  Minimum
                </span>

              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                Smallest Radius
              </p>

              <div className="mt-1 flex items-end gap-2">

                <p className="text-3xl font-bold tracking-tight text-slate-950">
                  {statistics.smallestRadius}
                </p>

                <span className="mb-1 text-sm font-semibold text-slate-400">
                  m
                </span>

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Minimum configured boundary
              </p>

            </div>

          </div>

        </section>

        {/* ==================================================
            SEARCH TOOLBAR
        ================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-950">
                Geofence Locations
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search and review all configured
                geographic boundaries.
              </p>

            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

              <div className="relative sm:w-[380px]">

                <FiSearch
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search name, coordinates or radius..."
                  aria-label="Search geofences"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />

                {search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <FiX size={15} />
                  </button>
                )}

              </div>

              <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">

                <FiActivity
                  className="text-emerald-500"
                  size={16}
                />

                <span>Showing</span>

                <strong className="text-slate-900">
                  {filteredGeofences.length}
                </strong>

                <span>
                  / {geofences.length}
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            TABLE
        ================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Table Header */}

          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-3">

                  <h2 className="text-lg font-bold text-slate-950">
                    Configured Boundaries
                  </h2>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                    {filteredGeofences.length}
                  </span>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Geographic zones currently managed
                  by FleetDash.
                </p>

              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700">

                <span className="relative flex h-2 w-2">

                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />

                </span>

                Monitoring Active

              </div>

            </div>

          </div>

          {/* Empty State */}

          {filteredGeofences.length === 0 && (
            <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">

              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">

                <div className="absolute inset-2 animate-pulse rounded-full border border-blue-100" />

                <FiMapPin
                  size={36}
                  className="relative text-blue-600"
                />

              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                No Geofences Found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">

                {search
                  ? "We couldn't find any geofences matching your search."
                  : "Create your first geographic boundary to start monitoring fleet movement."}

              </p>

              {search ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  <FiX />

                  Clear Search
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setOpenModal(true)
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
                >
                  <FiPlus />

                  Create Geofence
                </button>
              )}

            </div>
          )}

          {/* Desktop Table */}

          {filteredGeofences.length > 0 && (
            <>

              <div className="hidden overflow-x-auto lg:block">

                <table className="min-w-full">

                  <thead>

                    <tr className="border-b border-slate-100 bg-slate-50/80">

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Geofence
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Coordinates
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Radius
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Created
                      </th>

                      <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {filteredGeofences.map(
                      (item) => (
                        <tr
                          key={item._id}
                          className="group transition duration-200 hover:bg-blue-50/30"
                        >

                          {/* Geofence */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-4">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">

                                <FiMapPin
                                  size={19}
                                />

                              </div>

                              <div className="min-w-0">

                                <p className="truncate font-bold text-slate-800">
                                  {item.name ||
                                    "Unnamed Geofence"}
                                </p>

                                <p className="mt-1 text-xs font-medium text-slate-400">
                                  ID:{" "}
                                  {item._id
                                    ? item._id.slice(-8)
                                    : "N/A"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Coordinates */}

                          <td className="px-6 py-5">

                            <div className="space-y-2">

                              <div className="flex items-center gap-2">

                                <span className="w-7 text-[10px] font-bold uppercase text-slate-400">
                                  Lat
                                </span>

                                <span className="rounded-md bg-slate-50 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700">
                                  {formatCoordinate(
                                    item.center?.latitude
                                  )}
                                </span>

                              </div>

                              <div className="flex items-center gap-2">

                                <span className="w-7 text-[10px] font-bold uppercase text-slate-400">
                                  Lng
                                </span>

                                <span className="rounded-md bg-slate-50 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700">
                                  {formatCoordinate(
                                    item.center?.longitude
                                  )}
                                </span>

                              </div>

                            </div>

                          </td>

                          {/* Radius */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">

                                <FiCircle
                                  size={16}
                                />

                              </div>

                              <div>

                                <p className="font-bold text-slate-800">
                                  {formatRadius(
                                    item.radius
                                  )}
                                </p>

                                <p className="text-[11px] text-slate-400">
                                  Boundary radius
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Created */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-2.5">

                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400">

                                <FiCalendar
                                  size={14}
                                />

                              </div>

                              <div>

                                <p className="text-sm font-semibold text-slate-700">
                                  {formatDate(
                                    item.createdAt
                                  )}
                                </p>

                                <p className="text-[11px] text-slate-400">
                                  Created
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Status */}

                          <td className="px-6 py-5 text-center">

                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700">

                              <span className="relative flex h-2 w-2">

                                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                                <span className="relative h-2 w-2 rounded-full bg-emerald-500" />

                              </span>

                              Active

                            </span>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

              {/* ==================================================
                  MOBILE CARDS
              ================================================== */}

              <div className="divide-y divide-slate-100 lg:hidden">

                {filteredGeofences.map(
                  (item) => (
                    <article
                      key={item._id}
                      className="p-5 transition hover:bg-slate-50"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                            <FiMapPin />

                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-bold text-slate-800">
                              {item.name ||
                                "Unnamed Geofence"}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              ID:{" "}
                              {item._id?.slice(-8) ||
                                "N/A"}
                            </p>

                          </div>

                        </div>

                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">

                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                          Active

                        </span>

                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">

                        <div className="rounded-xl bg-slate-50 p-3">

                          <div className="flex items-center gap-2">

                            <FiNavigation
                              size={14}
                              className="text-blue-500"
                            />

                            <span className="text-[10px] font-bold uppercase text-slate-400">
                              Latitude
                            </span>

                          </div>

                          <p className="mt-2 break-all font-mono text-xs font-semibold text-slate-700">
                            {formatCoordinate(
                              item.center?.latitude
                            )}
                          </p>

                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">

                          <div className="flex items-center gap-2">

                            <FiCompass
                              size={14}
                              className="text-indigo-500"
                            />

                            <span className="text-[10px] font-bold uppercase text-slate-400">
                              Longitude
                            </span>

                          </div>

                          <p className="mt-2 break-all font-mono text-xs font-semibold text-slate-700">
                            {formatCoordinate(
                              item.center?.longitude
                            )}
                          </p>

                        </div>

                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3">

                        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">

                          <p className="text-[10px] font-bold uppercase text-indigo-500">
                            Radius
                          </p>

                          <p className="mt-1 font-bold text-indigo-800">
                            {formatRadius(
                              item.radius
                            )}
                          </p>

                        </div>

                        <div className="rounded-xl border border-slate-100 bg-white p-3">

                          <p className="text-[10px] font-bold uppercase text-slate-400">
                            Created
                          </p>

                          <p className="mt-1 text-xs font-semibold text-slate-700">
                            {formatDate(
                              item.createdAt
                            )}
                          </p>

                        </div>

                      </div>

                    </article>
                  )
                )}

              </div>

            </>
          )}

        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">

              <FiActivity size={16} />

            </div>

            <div>

              <p className="text-xs font-bold text-slate-700">
                Geofence monitoring is active
              </p>

              <p className="mt-0.5 text-[11px] text-slate-400">
                All configured boundaries are available
                for fleet monitoring.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">

            <FiMapPin className="text-blue-500" />

            {statistics.total} configured{" "}
            {statistics.total === 1
              ? "boundary"
              : "boundaries"}

          </div>

        </footer>

      </div>

      {/* ==================================================
          ADD GEOFENCE MODAL
      ================================================== */}

      <AddGeofenceModal
        isOpen={openModal}
        onClose={() =>
          setOpenModal(false)
        }
        onSuccess={() => {
          setOpenModal(false);
          fetchGeofences(true);
        }}
      />

    </div>
  );
};

export default Geofence;