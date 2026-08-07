
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaIdCard,
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaSyncAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserTie,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaSortAmountDown,
} from "react-icons/fa";

import { api } from "../../services/api";

// ============================================================
// TYPES
// ============================================================

interface Driver {
  _id?: string;
  id?: string;

  fullName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  address: string;

  experience: number;

  status: string;
  licenseStatus?: string;

  avatar?: string;

  totalTrips?: number;
  completedTrips?: number;
  cancelledTrips?: number;

  rating?: number;
  performance?: number;

  joiningDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface DriverForm {
  fullName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  address: string;
  experience: number;
  status: string;
}

type ModalType =
  | "add"
  | "view"
  | "edit"
  | "delete"
  | null;

// ============================================================
// CONSTANTS
// ============================================================

const STATUS_OPTIONS = [
  "All",
  "Available",
  "On Trip",
  "Inactive",
];

const LICENSE_OPTIONS = [
  "All",
  "Licensed",
  "Pending",
  "Expired",
];

const PAGE_SIZE = 8;

// ============================================================
// HELPERS
// ============================================================

const getDriverId = (driver: Driver) =>
  driver._id || driver.id || "";

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const getStatusClass = (status = "") => {
  switch (status.toLowerCase()) {
    case "available":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";

    case "on trip":
      return "bg-amber-50 text-amber-700 ring-amber-200";

    case "inactive":
      return "bg-red-50 text-red-700 ring-red-200";

    default:
      return "bg-slate-50 text-slate-600 ring-slate-200";
  }
};

const getLicenseClass = (status = "") => {
  switch (status.toLowerCase()) {
    case "licensed":
      return "text-emerald-600";

    case "expired":
      return "text-red-600";

    case "pending":
      return "text-amber-600";

    default:
      return "text-slate-500";
  }
};

const getLicenseStatus = (driver: Driver) => {
  if (driver.licenseStatus) {
    return driver.licenseStatus;
  }

  return "Licensed";
};

const getErrorMessage = (error: any) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong. Please try again.";

const emptyForm: DriverForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
  licenseNumber: "",
  address: "",
  experience: 0,
  status: "Available",
};

// ============================================================
// COMPONENT
// ============================================================

const Drivers = () => {
  // ==========================================================
  // STATE
  // ==========================================================

  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [licenseFilter, setLicenseFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("name");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [modal, setModal] =
    useState<ModalType>(null);

  const [selectedDriver, setSelectedDriver] =
    useState<Driver | null>(null);

  const [formData, setFormData] =
    useState<DriverForm>(emptyForm);

  const [submitting, setSubmitting] =
    useState(false);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // ==========================================================
  // TOAST
  // ==========================================================

  const showToast = useCallback(
    (
      type: "success" | "error",
      message: string
    ) => {
      setToast({
        type,
        message,
      });

      window.setTimeout(() => {
        setToast(null);
      }, 3500);
    },
    []
  );

  // ==========================================================
  // FETCH DRIVERS
  // ==========================================================

  const fetchDrivers = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        setError("");

        const response =
          await api.get("/drivers");

        const data =
          response?.data?.drivers ??
          response?.data?.data ??
          response?.data ??
          [];

        setDrivers(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(
          "Drivers API Error:",
          err
        );

        const message =
          getErrorMessage(err);

        setError(message);

        setDrivers([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh = async () => {
    setRefreshing(true);

    await fetchDrivers(false);

    showToast(
      "success",
      "Driver data refreshed successfully."
    );
  };

  // ==========================================================
  // FILTER + SORT
  // ==========================================================

  const filteredDrivers = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    const result = drivers.filter(
      (driver) => {
        const matchesSearch =
          !query ||
          driver.fullName
            ?.toLowerCase()
            .includes(query) ||
          driver.email
            ?.toLowerCase()
            .includes(query) ||
          driver.phoneNumber
            ?.toLowerCase()
            .includes(query) ||
          driver.licenseNumber
            ?.toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "All" ||
          driver.status === statusFilter;

        const matchesLicense =
          licenseFilter === "All" ||
          getLicenseStatus(driver) ===
            licenseFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesLicense
        );
      }
    );

    result.sort((a, b) => {
      if (sortBy === "name") {
        return (
          a.fullName || ""
        ).localeCompare(
          b.fullName || ""
        );
      }

      if (sortBy === "experience") {
        return (
          Number(b.experience || 0) -
          Number(a.experience || 0)
        );
      }

      if (sortBy === "trips") {
        return (
          Number(b.totalTrips || 0) -
          Number(a.totalTrips || 0)
        );
      }

      return 0;
    });

    return result;
  }, [
    drivers,
    search,
    statusFilter,
    licenseFilter,
    sortBy,
  ]);

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredDrivers.length /
        PAGE_SIZE
    )
  );

  const paginatedDrivers =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        PAGE_SIZE;

      return filteredDrivers.slice(
        start,
        start + PAGE_SIZE
      );
    }, [
      filteredDrivers,
      currentPage,
    ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    licenseFilter,
    sortBy,
  ]);

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const statistics = useMemo(() => {
    const total = drivers.length;

    const available =
      drivers.filter(
        (driver) =>
          driver.status ===
          "Available"
      ).length;

    const onTrip =
      drivers.filter(
        (driver) =>
          driver.status ===
          "On Trip"
      ).length;

    const licensed =
      drivers.filter(
        (driver) =>
          getLicenseStatus(driver) ===
          "Licensed"
      ).length;

    const averageExperience =
      total > 0
        ? drivers.reduce(
            (sum, driver) =>
              sum +
              Number(
                driver.experience || 0
              ),
            0
          ) / total
        : 0;

    return {
      total,
      available,
      onTrip,
      licensed,
      averageExperience,
    };
  }, [drivers]);

  // ==========================================================
  // FORM
  // ==========================================================

  const handleInputChange = (
    event:
      React.ChangeEvent<
        HTMLInputElement |
          HTMLTextAreaElement |
          HTMLSelectElement
      >
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "experience"
          ? Number(value)
          : value,
    }));
  };

  // ==========================================================
  // OPEN ADD
  // ==========================================================

  const openAddModal = () => {
    setFormData({
      ...emptyForm,
    });

    setSelectedDriver(null);

    setModal("add");
  };

  // ==========================================================
  // OPEN VIEW
  // ==========================================================

  const openViewModal = (
    driver: Driver
  ) => {
    setSelectedDriver(driver);
    setModal("view");
  };

  // ==========================================================
  // OPEN EDIT
  // ==========================================================

  const openEditModal = (
    driver: Driver
  ) => {
    setSelectedDriver(driver);

    setFormData({
      fullName:
        driver.fullName || "",
      email:
        driver.email || "",
      phoneNumber:
        driver.phoneNumber || "",
      licenseNumber:
        driver.licenseNumber || "",
      address:
        driver.address || "",
      experience:
        Number(
          driver.experience || 0
        ),
      status:
        driver.status ||
        "Available",
    });

    setModal("edit");
  };

  // ==========================================================
  // OPEN DELETE
  // ==========================================================

  const openDeleteModal = (
    driver: Driver
  ) => {
    setSelectedDriver(driver);
    setModal("delete");
  };

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const closeModal = () => {
    if (submitting) return;

    setModal(null);
    setSelectedDriver(null);
  };

  // ==========================================================
  // ADD DRIVER
  // ==========================================================

  const handleAddDriver = async () => {
    if (!formData.fullName.trim()) {
      showToast(
        "error",
        "Driver name is required."
      );
      return;
    }

    if (!formData.email.trim()) {
      showToast(
        "error",
        "Email is required."
      );
      return;
    }

    if (
      !formData.phoneNumber.trim()
    ) {
      showToast(
        "error",
        "Phone number is required."
      );
      return;
    }

    if (
      !formData.licenseNumber.trim()
    ) {
      showToast(
        "error",
        "License number is required."
      );
      return;
    }

    try {
      setSubmitting(true);

      await api.post(
        "/drivers",
        formData
      );

      showToast(
        "success",
        "Driver added successfully."
      );

      closeModal();

      await fetchDrivers(false);
    } catch (err) {
      console.error(
        "Add Driver Error:",
        err
      );

      showToast(
        "error",
        getErrorMessage(err)
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================================
  // UPDATE DRIVER
  // ==========================================================

  const handleUpdateDriver =
    async () => {
      if (
        !selectedDriver
      ) {
        return;
      }

      const id =
        getDriverId(
          selectedDriver
        );

      if (!id) {
        showToast(
          "error",
          "Driver ID is missing."
        );
        return;
      }

      try {
        setSubmitting(true);

        await api.put(
          `/drivers/${id}`,
          formData
        );

        showToast(
          "success",
          "Driver updated successfully."
        );

        closeModal();

        await fetchDrivers(false);
      } catch (err) {
        console.error(
          "Update Driver Error:",
          err
        );

        showToast(
          "error",
          getErrorMessage(err)
        );
      } finally {
        setSubmitting(false);
      }
    };

  // ==========================================================
  // DELETE DRIVER
  // ==========================================================

  const handleDeleteDriver =
    async () => {
      if (
        !selectedDriver
      ) {
        return;
      }

      const id =
        getDriverId(
          selectedDriver
        );

      if (!id) {
        showToast(
          "error",
          "Driver ID is missing."
        );
        return;
      }

      try {
        setSubmitting(true);

        await api.delete(
          `/drivers/${id}`
        );

        showToast(
          "success",
          "Driver deleted successfully."
        );

        closeModal();

        await fetchDrivers(false);
      } catch (err) {
        console.error(
          "Delete Driver Error:",
          err
        );

        showToast(
          "error",
          getErrorMessage(err)
        );
      } finally {
        setSubmitting(false);
      }
    };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-64 rounded-lg bg-slate-200" />

          <div className="mt-2 h-4 w-96 max-w-full rounded bg-slate-200" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>

        <div className="h-[520px] animate-pulse rounded-2xl border border-slate-200 bg-white" />
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error && drivers.length === 0) {
    return (
      <div className="min-h-[500px] rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <FaExclamationTriangle size={26} />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Unable to load drivers
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            onClick={() =>
              fetchDrivers()
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <FaSyncAlt />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-full space-y-7 pb-10">
      {/* ======================================================
          TOAST
      ======================================================= */}

      {toast && (
        <div
          className={`fixed right-5 top-5 z-[100] flex max-w-sm items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl ${
            toast.type === "success"
              ? "border-emerald-200 bg-white text-emerald-700"
              : "border-red-200 bg-white text-red-700"
          }`}
        >
          {toast.type ===
          "success" ? (
            <FaCheckCircle />
          ) : (
            <FaExclamationTriangle />
          )}

          <span className="text-sm font-semibold">
            {toast.message}
          </span>

          <button
            onClick={() =>
              setToast(null)
            }
            className="ml-auto text-slate-400 hover:text-slate-700"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* ======================================================
          HEADER
      ======================================================= */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 py-7 text-white shadow-xl sm:px-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-indigo-300">
              <FaUserTie />
              Fleet Management
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Driver Management
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Manage your fleet drivers,
              monitor availability,
              licenses and driver
              performance from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaSyncAlt
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </button>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-slate-100"
            >
              <FaPlus />
              Add Driver
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================
          KPI CARDS
      ======================================================= */}

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Drivers"
          value={statistics.total}
          description="Registered drivers"
          icon={<FaUsers />}
          iconClass="bg-blue-50 text-blue-600"
          accent="blue"
        />

        <StatCard
          title="Available"
          value={statistics.available}
          description="Ready for assignment"
          icon={<FaUserCheck />}
          iconClass="bg-emerald-50 text-emerald-600"
          accent="green"
        />

        <StatCard
          title="On Trip"
          value={statistics.onTrip}
          description="Currently active"
          icon={<FaUserClock />}
          iconClass="bg-amber-50 text-amber-600"
          accent="amber"
        />

        <StatCard
          title="Licensed"
          value={statistics.licensed}
          description={`${statistics.averageExperience.toFixed(
            1
          )} yrs avg. experience`}
          icon={<FaIdCard />}
          iconClass="bg-indigo-50 text-indigo-600"
          accent="indigo"
        />
      </section>

      {/* ======================================================
          FILTER BAR
      ======================================================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          {/* Search */}

          <div className="relative min-w-0 flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search by name, email, phone or license..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          {/* Filters */}

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <FaFilter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="h-12 appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              >
                {STATUS_OPTIONS.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status === "All"
                        ? "All Status"
                        : status}
                    </option>
                  )
                )}
              </select>
            </div>

            <select
              value={licenseFilter}
              onChange={(event) =>
                setLicenseFilter(
                  event.target.value
                )
              }
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
            >
              {LICENSE_OPTIONS.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status === "All"
                      ? "All Licenses"
                      : status}
                  </option>
                )
              )}
            </select>

            <div className="relative">
              <FaSortAmountDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value
                  )
                }
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="name">
                  Sort: Name
                </option>

                <option value="experience">
                  Sort: Experience
                </option>

                <option value="trips">
                  Sort: Trips
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col justify-between gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center">
          <span>
            Showing{" "}
            <strong className="text-slate-800">
              {paginatedDrivers.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-800">
              {filteredDrivers.length}
            </strong>{" "}
            drivers
          </span>

          {(search ||
            statusFilter !==
              "All" ||
            licenseFilter !==
              "All") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter(
                  "All"
                );
                setLicenseFilter(
                  "All"
                );
              }}
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* ======================================================
          ERROR BANNER
      ======================================================= */}

      {error && drivers.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <FaExclamationTriangle className="mt-0.5 shrink-0" />

          <div className="flex-1">
            <p className="text-sm font-bold">
              Unable to refresh driver data
            </p>

            <p className="mt-1 text-xs text-amber-700">
              {error}
            </p>
          </div>

          <button
            onClick={() =>
              fetchDrivers()
            }
            className="text-xs font-bold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* ======================================================
          TABLE
      ======================================================= */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Fleet Drivers
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Driver directory and current
              operational status.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
            {filteredDrivers.length}{" "}
            Drivers
          </div>
        </div>

        {paginatedDrivers.length ===
        0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FaUsers size={24} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-800">
              No drivers found
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-500">
              No drivers match your
              current search or filter
              criteria.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setStatusFilter(
                  "All"
                );
                setLicenseFilter(
                  "All"
                );
              }}
              className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-[1050px] w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Driver
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      License
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Experience
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Performance
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {paginatedDrivers.map(
                    (driver) => {
                      const performance =
                        Math.min(
                          100,
                          Math.max(
                            0,
                            Number(
                              driver.performance ??
                                85
                            )
                          )
                        );

                      const license =
                        getLicenseStatus(
                          driver
                        );

                      return (
                        <tr
                          key={
                            getDriverId(
                              driver
                            ) ||
                            driver.email
                          }
                          className="group transition hover:bg-slate-50/70"
                        >
                          {/* Driver */}

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              {driver.avatar ? (
                                <img
                                  src={
                                    driver.avatar
                                  }
                                  alt={
                                    driver.fullName
                                  }
                                  className="h-11 w-11 rounded-xl object-cover ring-2 ring-slate-100"
                                />
                              ) : (
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white shadow-sm">
                                  {getInitials(
                                    driver.fullName
                                  )}
                                </div>
                              )}

                              <div className="min-w-0">
                                <p className="truncate font-bold text-slate-800">
                                  {
                                    driver.fullName
                                  }
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                  {driver.totalTrips ??
                                    0}{" "}
                                  total trips
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}

                          <td className="px-6 py-5">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <FaEnvelope className="text-slate-400" />

                                <span>
                                  {
                                    driver.email
                                  }
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <FaPhone className="text-slate-400" />

                                <span>
                                  {
                                    driver.phoneNumber
                                  }
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* License */}

                          <td className="px-6 py-5">
                            <div>
                              <p className="font-semibold text-slate-700">
                                {
                                  driver.licenseNumber
                                }
                              </p>

                              <p
                                className={`mt-1 text-xs font-semibold ${getLicenseClass(
                                  license
                                )}`}
                              >
                                {license}
                              </p>
                            </div>
                          </td>

                          {/* Experience */}

                          <td className="px-6 py-5">
                            <p className="font-bold text-slate-800">
                              {
                                driver.experience
                              }{" "}
                              yrs
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Professional
                            </p>
                          </td>

                          {/* Performance */}

                          <td className="px-6 py-5">
                            <div className="w-32">
                              <div className="mb-1.5 flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-600">
                                  Score
                                </span>

                                <span className="text-xs font-bold text-slate-800">
                                  {
                                    performance
                                  }
                                  %
                                </span>
                              </div>

                              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                                  style={{
                                    width: `${performance}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Status */}

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${getStatusClass(
                                driver.status
                              )}`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />

                              {
                                driver.status
                              }
                            </span>
                          </td>

                          {/* Actions */}

                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-1.5">
                              <ActionButton
                                title="View driver"
                                onClick={() =>
                                  openViewModal(
                                    driver
                                  )
                                }
                                className="text-blue-600 hover:bg-blue-50"
                              >
                                <FaEye />
                              </ActionButton>

                              <ActionButton
                                title="Edit driver"
                                onClick={() =>
                                  openEditModal(
                                    driver
                                  )
                                }
                                className="text-emerald-600 hover:bg-emerald-50"
                              >
                                <FaEdit />
                              </ActionButton>

                              <ActionButton
                                title="Delete driver"
                                onClick={() =>
                                  openDeleteModal(
                                    driver
                                  )
                                }
                                className="text-red-600 hover:bg-red-50"
                              >
                                <FaTrash />
                              </ActionButton>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}

            <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:px-6">
              <p className="text-xs text-slate-500">
                Page{" "}
                <strong className="text-slate-800">
                  {currentPage}
                </strong>{" "}
                of{" "}
                <strong className="text-slate-800">
                  {totalPages}
                </strong>
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          1,
                          page - 1
                        )
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaChevronLeft size={11} />
                </button>

                {Array.from({
                  length: totalPages,
                })
                  .slice(0, 5)
                  .map((_, index) => {
                    const page =
                      index + 1;

                    return (
                      <button
                        key={page}
                        onClick={() =>
                          setCurrentPage(
                            page
                          )
                        }
                        className={`h-9 min-w-9 rounded-lg px-2 text-xs font-bold transition ${
                          currentPage ===
                          page
                            ? "bg-slate-900 text-white"
                            : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                <button
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          totalPages,
                          page + 1
                        )
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaChevronRight size={11} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ======================================================
          ADD / EDIT MODAL
      ======================================================= */}

      {(modal === "add" ||
        modal === "edit") && (
        <ModalOverlay
          onClose={closeModal}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {modal === "add"
                    ? "Add New Driver"
                    : "Update Driver"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {modal === "add"
                    ? "Create a new driver profile."
                    : "Update driver information and operational status."}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <FaTimes />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  label="Full Name"
                  required
                >
                  <input
                    name="fullName"
                    value={
                      formData.fullName
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Enter full name"
                    className="form-input"
                  />
                </FormField>

                <FormField
                  label="Email"
                  required
                >
                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="driver@example.com"
                    className="form-input"
                  />
                </FormField>

                <FormField
                  label="Phone Number"
                  required
                >
                  <input
                    name="phoneNumber"
                    value={
                      formData.phoneNumber
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="+91 XXXXX XXXXX"
                    className="form-input"
                  />
                </FormField>

                <FormField
                  label="License Number"
                  required
                >
                  <input
                    name="licenseNumber"
                    value={
                      formData.licenseNumber
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="DL-XXXXXXXX"
                    className="form-input"
                  />
                </FormField>

                <FormField label="Experience">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      name="experience"
                      value={
                        formData.experience
                      }
                      onChange={
                        handleInputChange
                      }
                      className="form-input pr-16"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                      Years
                    </span>
                  </div>
                </FormField>

                <FormField label="Status">
                  <select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={
                      handleInputChange
                    }
                    className="form-input"
                  >
                    <option value="Available">
                      Available
                    </option>

                    <option value="On Trip">
                      On Trip
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </FormField>

                <div className="sm:col-span-2">
                  <FormField label="Address">
                    <textarea
                      name="address"
                      value={
                        formData.address
                      }
                      onChange={
                        handleInputChange
                      }
                      rows={4}
                      placeholder="Enter driver address..."
                      className="form-input resize-none"
                    />
                  </FormField>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:justify-end">
              <button
                onClick={closeModal}
                disabled={submitting}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={
                  modal === "add"
                    ? handleAddDriver
                    : handleUpdateDriver
                }
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:from-slate-800 hover:to-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && (
                  <FaSyncAlt className="animate-spin" />
                )}

                {modal === "add"
                  ? "Create Driver"
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* ======================================================
          VIEW MODAL
      ======================================================= */}

      {modal === "view" &&
        selectedDriver && (
          <ModalOverlay
            onClose={closeModal}
          >
            <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 to-indigo-950 px-6 py-7 text-white">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl" />

                <button
                  onClick={closeModal}
                  className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
                >
                  <FaTimes />
                </button>

                <div className="relative flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold backdrop-blur">
                    {getInitials(
                      selectedDriver.fullName
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      {
                        selectedDriver.fullName
                      }
                    </h2>

                    <p className="mt-1 text-sm text-slate-300">
                      Driver Profile
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard
                    label="Status"
                    value={
                      selectedDriver.status
                    }
                  />

                  <InfoCard
                    label="Experience"
                    value={`${selectedDriver.experience} Years`}
                  />

                  <InfoCard
                    label="Total Trips"
                    value={String(
                      selectedDriver.totalTrips ??
                        0
                    )}
                  />

                  <InfoCard
                    label="License"
                    value={getLicenseStatus(
                      selectedDriver
                    )}
                  />
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <DetailRow
                    icon={<FaEnvelope />}
                    label="Email"
                    value={
                      selectedDriver.email
                    }
                  />

                  <DetailRow
                    icon={<FaPhone />}
                    label="Phone"
                    value={
                      selectedDriver.phoneNumber
                    }
                  />

                  <DetailRow
                    icon={
                      <FaIdCard />
                    }
                    label="License"
                    value={
                      selectedDriver.licenseNumber
                    }
                  />

                  <DetailRow
                    icon={
                      <FaMapMarkerAlt />
                    }
                    label="Address"
                    value={
                      selectedDriver.address ||
                      "Not provided"
                    }
                  />
                </div>

                <button
                  onClick={closeModal}
                  className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </ModalOverlay>
        )}

      {/* ======================================================
          DELETE MODAL
      ======================================================= */}

      {modal === "delete" &&
        selectedDriver && (
          <ModalOverlay
            onClose={closeModal}
          >
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <FaTrash />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                Delete Driver?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to
                permanently remove{" "}
                <strong className="text-slate-800">
                  {
                    selectedDriver.fullName
                  }
                </strong>{" "}
                from your fleet?
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={closeModal}
                  disabled={submitting}
                  className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    handleDeleteDriver
                  }
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {submitting && (
                    <FaSyncAlt className="animate-spin" />
                  )}

                  Delete
                </button>
              </div>
            </div>
          </ModalOverlay>
        )}
    </div>
  );
};

// ============================================================
// STAT CARD
// ============================================================

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  iconClass: string;
  accent: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  iconClass,
}: StatCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass} transition group-hover:scale-110`}
        >
          {icon}
        </div>
      </div>

      <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-slate-100/50 blur-2xl transition group-hover:scale-150" />
    </div>
  );
};

// ============================================================
// ACTION BUTTON
// ============================================================

interface ActionButtonProps {
  title: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

const ActionButton = ({
  title,
  onClick,
  className = "",
  children,
}: ActionButtonProps) => {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${className}`}
    >
      {children}
    </button>
  );
};

// ============================================================
// MODAL OVERLAY
// ============================================================

interface ModalOverlayProps {
  children: React.ReactNode;
  onClose: () => void;
}

const ModalOverlay = ({
  children,
  onClose,
}: ModalOverlayProps) => {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      {children}
    </div>
  );
};

// ============================================================
// FORM FIELD
// ============================================================

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

const FormField = ({
  label,
  required,
  children,
}: FormFieldProps) => {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
};

// ============================================================
// INFO CARD
// ============================================================

interface InfoCardProps {
  label: string;
  value: string;
}

const InfoCard = ({
  label,
  value,
}: InfoCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
};

// ============================================================
// DETAIL ROW
// ============================================================

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DetailRow = ({
  icon,
  label,
  value,
}: DetailRowProps) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-xs text-slate-500 shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 break-words text-sm font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
};

export default Drivers;

