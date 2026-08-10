
import { useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiEye,
  FiEdit,
  FiTrash2,
  FiTruck,
  FiActivity,
  FiMapPin,
  FiBatteryCharging,
  FiX,
  FiSave,
  FiRefreshCw,
} from "react-icons/fi";

import { vehicleService } from "../../services/vehicleService";
import type { Vehicle } from "../../types/vehicle";

type VehicleStatus =
  | "Active"
  | "Idle"
  | "Maintenance"
  | "Offline";

type VehicleFormData = {
  vehicleNumber: string;
  status: VehicleStatus;
  speed: number;
  fuel: number;
  latitude: number;
  longitude: number;
};

const DEFAULT_FORM: VehicleFormData = {
  vehicleNumber: "",
  status: "Idle",
  speed: 0,
  fuel: 100,
  latitude: 28.6139,
  longitude: 77.209,
};

const Vehicles = () => {
  // =========================================================
  // State
  // =========================================================

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedVehicle, setSelectedVehicle] =
    useState<Vehicle | null>(null);

  const [formData, setFormData] =
    useState<VehicleFormData>(DEFAULT_FORM);

  const [loading, setLoading] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  const [error, setError] = useState("");

  // =========================================================
  // Load Vehicles
  // =========================================================

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoadingVehicles(true);

      const response = await vehicleService.getVehicles();

      setVehicles(response);
    } catch (err) {
      console.error(err);
      setError("Unable to load vehicles.");
    } finally {
      setLoadingVehicles(false);
    }
  };

  // =========================================================
  // Helpers
  // =========================================================

  const resetForm = () => {
    setFormData(DEFAULT_FORM);
    setError("");
  };



  const updateForm = <K extends keyof VehicleFormData>(
    field: K,
    value: VehicleFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.vehicleNumber.trim()) {
      return "Vehicle number is required.";
    }

    if (formData.speed < 0) {
      return "Speed cannot be negative.";
    }

    if (formData.fuel < 0 || formData.fuel > 100) {
      return "Fuel must be between 0 and 100.";
    }

    if (
      formData.latitude < -90 ||
      formData.latitude > 90
    ) {
      return "Latitude must be between -90 and 90.";
    }

    if (
      formData.longitude < -180 ||
      formData.longitude > 180
    ) {
      return "Longitude must be between -180 and 180.";
    }

    return "";
  };

  // =========================================================
  // Add Vehicle
  // =========================================================

  const handleAddVehicle = async () => {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await vehicleService.createVehicle({
        vehicleNumber: formData.vehicleNumber.trim(),
        speed: formData.speed,
        fuel: formData.fuel,
        status: formData.status,
        latitude: formData.latitude,
        longitude: formData.longitude,
      });

      if (response.success) {
        await loadVehicles();

        setShowAdd(false);
        resetForm();
      }
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Vehicle creation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // Open Edit
  // =========================================================

  const openEditModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);

    setFormData({
      vehicleNumber: vehicle.vehicleNumber,
      status: vehicle.status,
      speed: vehicle.speed,
      fuel: vehicle.fuel,
      latitude: vehicle.latitude,
      longitude: vehicle.longitude,
    });

    setError("");
    setShowEdit(true);
  };

  // =========================================================
  // Update Vehicle
  // =========================================================

  const handleUpdateVehicle = async () => {
    if (!selectedVehicle?._id) return;

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await vehicleService.updateVehicle(
        selectedVehicle._id,
        formData
      );

      await loadVehicles();

      setShowEdit(false);
      setSelectedVehicle(null);
      resetForm();
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Vehicle update failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // Delete Vehicle
  // =========================================================

  const handleDeleteVehicle = async () => {
    if (!selectedVehicle?._id) return;

    try {
      setLoading(true);
      setError("");

      await vehicleService.deleteVehicle(
        selectedVehicle._id
      );

      await loadVehicles();

      setShowDelete(false);
      setSelectedVehicle(null);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Vehicle deletion failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // Search
  // =========================================================

  const filteredVehicles = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return vehicles;
    }

    return vehicles.filter((vehicle) =>
      vehicle.vehicleNumber
        .toLowerCase()
        .includes(searchValue)
    );
  }, [vehicles, search]);

  // =========================================================
  // Statistics
  // =========================================================

  const totalVehicles = vehicles.length;

  const activeVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "Active"
  ).length;

  const idleVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "Idle"
  ).length;

  const offlineVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "Offline"
  ).length;

  // =========================================================
  // Status Styling
  // =========================================================

  const getStatusClass = (status: VehicleStatus) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";

      case "Idle":
        return "bg-yellow-100 text-yellow-700";

      case "Maintenance":
        return "bg-orange-100 text-orange-700";

      case "Offline":
      default:
        return "bg-red-100 text-red-700";
    }
  };

  const getFuelColor = (fuel: number) => {
    if (fuel > 70) return "bg-green-500";
    if (fuel > 30) return "bg-yellow-500";

    return "bg-red-500";
  };

  // =========================================================
  // Vehicle Form
  // =========================================================

  const VehicleForm = ({
    mode,
  }: {
    mode: "add" | "edit";
  }) => {
    const isEdit = mode === "edit";

    return (
      <div
        className="
          fixed inset-0 z-50
          bg-slate-950/60
          backdrop-blur-sm
          flex items-center justify-center
          p-3 sm:p-5
        "
      >
        <div
          className="
            w-full
            max-w-3xl
            max-h-[95vh]
            overflow-y-auto
            rounded-2xl sm:rounded-3xl
            bg-white
            shadow-2xl
          "
        >
          {/* Header */}

          <div
            className={`
              sticky top-0 z-10
              px-5 sm:px-8
              py-5 sm:py-6
              text-white
              ${
                isEdit
                  ? "bg-gradient-to-r from-emerald-600 to-green-600"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600"
              }
            `}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="hidden sm:flex h-14 w-14 rounded-2xl bg-white/20 items-center justify-center">
                  {isEdit ? (
                    <FiEdit size={28} />
                  ) : (
                    <FiTruck size={28} />
                  )}
                </div>

                <div>
                  <h2 className="text-xl sm:text-3xl font-bold">
                    {isEdit
                      ? "Edit Vehicle"
                      : "Add New Vehicle"}
                  </h2>

                  <p className="text-sm sm:text-base text-white/80 mt-1">
                    {isEdit
                      ? "Update your vehicle information."
                      : "Enter vehicle information below."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isEdit) {
                    setShowEdit(false);
                    setSelectedVehicle(null);
                  } else {
                    setShowAdd(false);
                  }

                  setError("");
                }}
                className="
                  h-10 w-10
                  shrink-0
                  rounded-xl
                  bg-white/10
                  hover:bg-white/20
                  flex items-center justify-center
                  transition
                "
              >
                <FiX size={22} />
              </button>
            </div>
          </div>

          {/* Form */}

          <div className="p-5 sm:p-8">
            {/* Error */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Vehicle Number */}

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Vehicle Number
                </label>

                <input
                  type="text"
                  placeholder="DL01AB1234"
                  value={formData.vehicleNumber}
                  onChange={(event) =>
                    updateForm(
                      "vehicleNumber",
                      event.target.value.toUpperCase()
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border border-slate-300
                    bg-white
                    px-4 py-3
                    text-slate-800
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />
              </div>

              {/* Status */}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Status
                </label>

                <select
                  value={formData.status}
                  onChange={(event) =>
                    updateForm(
                      "status",
                      event.target.value as VehicleStatus
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border border-slate-300
                    bg-white
                    px-4 py-3
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                >
                  <option value="Active">Active</option>
                  <option value="Idle">Idle</option>
                  <option value="Maintenance">
                    Maintenance
                  </option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              {/* Speed */}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Speed
                  <span className="font-normal text-slate-400">
                    {" "}
                    (km/h)
                  </span>
                </label>

                <input
                  type="number"
                  min="0"
                  value={formData.speed}
                  onChange={(event) =>
                    updateForm(
                      "speed",
                      Number(event.target.value)
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border border-slate-300
                    px-4 py-3
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />
              </div>

              {/* Fuel */}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Fuel
                  <span className="font-normal text-slate-400">
                    {" "}
                    (%)
                  </span>
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.fuel}
                  onChange={(event) =>
                    updateForm(
                      "fuel",
                      Number(event.target.value)
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border border-slate-300
                    px-4 py-3
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />

                {/* Fuel Preview */}

                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Fuel level</span>
                    <span>{formData.fuel}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getFuelColor(
                        formData.fuel
                      )}`}
                      style={{
                        width: `${Math.min(
                          Math.max(formData.fuel, 0),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Latitude */}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Latitude
                </label>

                <input
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  value={formData.latitude}
                  onChange={(event) =>
                    updateForm(
                      "latitude",
                      Number(event.target.value)
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border border-slate-300
                    px-4 py-3
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />
              </div>

              {/* Longitude */}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Longitude
                </label>

                <input
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  value={formData.longitude}
                  onChange={(event) =>
                    updateForm(
                      "longitude",
                      Number(event.target.value)
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border border-slate-300
                    px-4 py-3
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />
              </div>
            </div>

            {/* Preview */}

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiActivity className="text-blue-600" />

                <h3 className="font-semibold text-slate-700">
                  Vehicle Preview
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-400">
                    Vehicle
                  </p>

                  <p className="mt-1 font-semibold text-slate-800 break-words">
                    {formData.vehicleNumber || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Speed
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {formData.speed} km/h
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Fuel
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {formData.fuel}%
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Status
                  </p>

                  <span
                    className={`inline-flex mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                      formData.status
                    )}`}
                  >
                    {formData.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-7">
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  if (isEdit) {
                    setShowEdit(false);
                    setSelectedVehicle(null);
                  } else {
                    setShowAdd(false);
                  }

                  setError("");
                }}
                className="
                  w-full sm:w-auto
                  px-6 py-3
                  rounded-xl
                  border border-slate-300
                  text-slate-700
                  font-medium
                  hover:bg-slate-100
                  transition
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={
                  isEdit
                    ? handleUpdateVehicle
                    : handleAddVehicle
                }
                className={`
                  w-full sm:w-auto
                  px-6 py-3
                  rounded-xl
                  text-white
                  font-semibold
                  shadow-lg
                  transition
                  flex items-center justify-center gap-2
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  ${
                    isEdit
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }
                `}
              >
                {loading ? (
                  <>
                    <FiRefreshCw className="animate-spin" />

                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave />

                    {isEdit
                      ? "Update Vehicle"
                      : "Save Vehicle"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================
  // Render
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-6 py-5 sm:py-8 space-y-6 sm:space-y-8">
        {/* =====================================================
            Header
        ===================================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
              Fleet Management
            </h1>

            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Monitor, manage and track your fleet vehicles.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowAdd(true);
            }}
            className="
              w-full sm:w-auto
              flex items-center justify-center gap-2
              rounded-xl
              bg-blue-600
              px-5 sm:px-6
              py-3
              text-white
              font-medium
              shadow-lg
              hover:bg-blue-700
              transition
            "
          >
            <FiPlus size={20} />

            Add Vehicle
          </button>
        </div>

        {/* =====================================================
            Dashboard Cards
        ===================================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {/* Total */}

          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs sm:text-sm text-blue-100">
                  Total Vehicles
                </p>

                <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
                  {totalVehicles}
                </h2>
              </div>

              <div className="hidden sm:flex h-12 w-12 lg:h-14 lg:w-14 rounded-xl bg-white/20 items-center justify-center">
                <FiTruck size={26} />
              </div>
            </div>
          </div>

          {/* Active */}

          <div className="rounded-2xl bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs sm:text-sm text-green-100">
                  Active
                </p>

                <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
                  {activeVehicles}
                </h2>
              </div>

              <div className="hidden sm:flex h-12 w-12 lg:h-14 lg:w-14 rounded-xl bg-white/20 items-center justify-center">
                <FiActivity size={26} />
              </div>
            </div>
          </div>

          {/* Idle */}

          <div className="rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs sm:text-sm text-yellow-100">
                  Idle
                </p>

                <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
                  {idleVehicles}
                </h2>
              </div>

              <div className="hidden sm:flex h-12 w-12 lg:h-14 lg:w-14 rounded-xl bg-white/20 items-center justify-center">
                <FiMapPin size={26} />
              </div>
            </div>
          </div>

          {/* Offline */}

          <div className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs sm:text-sm text-red-100">
                  Offline
                </p>

                <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
                  {offlineVehicles}
                </h2>
              </div>

              <div className="hidden sm:flex h-12 w-12 lg:h-14 lg:w-14 rounded-xl bg-white/20 items-center justify-center">
                <FiBatteryCharging size={26} />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            Search
        ===================================================== */}

        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-3 sm:p-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-xl bg-blue-100 flex items-center justify-center">
              <FiSearch className="text-blue-600 text-lg sm:text-xl" />
            </div>

            <input
              type="text"
              placeholder="Search vehicle number..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="
                min-w-0
                flex-1
                text-sm sm:text-lg
                text-slate-700
                outline-none
                placeholder:text-slate-400
              "
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-slate-400 hover:text-slate-700"
              >
                <FiX size={20} />
              </button>
            )}
          </div>
        </div>

        {/* =====================================================
            Desktop Table
        ===================================================== */}

        <div className="hidden md:block bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-slate-50 border-b">
                <tr className="text-left text-slate-500 uppercase text-xs lg:text-sm">
                  <th className="px-5 lg:px-6 py-5">
                    Vehicle
                  </th>

                  <th className="px-5 lg:px-6 py-5">
                    Speed
                  </th>

                  <th className="px-5 lg:px-6 py-5">
                    Fuel
                  </th>

                  <th className="px-5 lg:px-6 py-5">
                    Status
                  </th>

                  <th className="px-5 lg:px-6 py-5">
                    Location
                  </th>

                  <th className="px-5 lg:px-6 py-5 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loadingVehicles ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-16 text-center"
                    >
                      <FiRefreshCw
                        size={28}
                        className="mx-auto animate-spin text-blue-500"
                      />

                      <p className="mt-3 text-slate-500">
                        Loading vehicles...
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <tr
                      key={vehicle._id}
                      className="border-b last:border-none hover:bg-slate-50 transition"
                    >
                      {/* Vehicle */}

                      <td className="px-5 lg:px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                            <FiTruck
                              className="text-blue-600"
                              size={21}
                            />
                          </div>

                          <div>
                            <h3 className="font-semibold text-slate-800">
                              {vehicle.vehicleNumber}
                            </h3>

                            <p className="text-xs text-slate-400">
                              Fleet Vehicle
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Speed */}

                      <td className="px-5 lg:px-6 py-5">
                        <span className="font-semibold text-slate-700">
                          {vehicle.speed}
                        </span>

                        <span className="text-slate-400 ml-1">
                          km/h
                        </span>
                      </td>

                      {/* Fuel */}

                      <td className="px-5 lg:px-6 py-5">
                        <div className="w-36">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="font-medium">
                              {vehicle.fuel}%
                            </span>
                          </div>

                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${getFuelColor(
                                vehicle.fuel
                              )}`}
                              style={{
                                width: `${Math.min(
                                  Math.max(
                                    vehicle.fuel,
                                    0
                                  ),
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}

                      <td className="px-5 lg:px-6 py-5">
                        <span
                          className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusClass(
                            vehicle.status
                          )}`}
                        >
                          {vehicle.status}
                        </span>
                      </td>

                      {/* Location */}

                      <td className="px-5 lg:px-6 py-5">
                        <div className="text-sm">
                          <p className="font-medium text-slate-700">
                            {vehicle.latitude}
                          </p>

                          <p className="text-slate-400">
                            {vehicle.longitude}
                          </p>
                        </div>
                      </td>

                      {/* Actions */}

                      <td className="px-5 lg:px-6 py-5">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedVehicle(vehicle);
                              setShowView(true);
                            }}
                            title="View"
                            className="h-9 w-9 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                          >
                            <FiEye className="mx-auto" />
                          </button>

                          <button
                            onClick={() =>
                              openEditModal(vehicle)
                            }
                            title="Edit"
                            className="h-9 w-9 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition"
                          >
                            <FiEdit className="mx-auto" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedVehicle(vehicle);
                              setShowDelete(true);
                              setError("");
                            }}
                            title="Delete"
                            className="h-9 w-9 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                          >
                            <FiTrash2 className="mx-auto" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}

                {!loadingVehicles &&
                  filteredVehicles.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-16 text-center text-slate-500"
                      >
                        <FiTruck
                          size={45}
                          className="mx-auto mb-4 text-slate-300"
                        />

                        <p className="text-lg font-medium">
                          No vehicles found
                        </p>

                        <p className="text-sm mt-1">
                          Try changing your search.
                        </p>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>

        {/* =====================================================
            Mobile Vehicle Cards
        ===================================================== */}

        <div className="md:hidden space-y-4">
          {loadingVehicles ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow">
              <FiRefreshCw
                size={28}
                className="mx-auto animate-spin text-blue-500"
              />

              <p className="mt-3 text-slate-500">
                Loading vehicles...
              </p>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow">
              <FiTruck
                size={45}
                className="mx-auto mb-4 text-slate-300"
              />

              <p className="text-lg font-medium text-slate-700">
                No vehicles found
              </p>
            </div>
          ) : (
            filteredVehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="bg-white rounded-2xl shadow-md border border-slate-200 p-4"
              >
                {/* Card Header */}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-blue-100 flex items-center justify-center">
                      <FiTruck
                        className="text-blue-600"
                        size={21}
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 truncate">
                        {vehicle.vehicleNumber}
                      </h3>

                      <p className="text-xs text-slate-400">
                        Fleet Vehicle
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusClass(
                      vehicle.status
                    )}`}
                  >
                    {vehicle.status}
                  </span>
                </div>

                {/* Stats */}

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">
                      Speed
                    </p>

                    <p className="font-bold text-slate-700 mt-1">
                      {vehicle.speed}{" "}
                      <span className="text-xs font-normal text-slate-400">
                        km/h
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">
                      Fuel
                    </p>

                    <p className="font-bold text-slate-700 mt-1">
                      {vehicle.fuel}%
                    </p>

                    <div className="h-1.5 bg-slate-200 rounded-full mt-2">
                      <div
                        className={`h-full rounded-full ${getFuelColor(
                          vehicle.fuel
                        )}`}
                        style={{
                          width: `${Math.min(
                            Math.max(vehicle.fuel, 0),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}

                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <FiMapPin />

                    <span className="text-xs font-medium">
                      GPS Location
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 mt-2 text-sm">
                    <span>
                      Lat:{" "}
                      <strong>
                        {vehicle.latitude}
                      </strong>
                    </span>

                    <span>
                      Lng:{" "}
                      <strong>
                        {vehicle.longitude}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Actions */}

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <button
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setShowView(true);
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 text-blue-600 py-2.5 text-sm font-medium hover:bg-blue-600 hover:text-white transition"
                  >
                    <FiEye />
                    View
                  </button>

                  <button
                    onClick={() =>
                      openEditModal(vehicle)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-50 text-green-600 py-2.5 text-sm font-medium hover:bg-green-600 hover:text-white transition"
                  >
                    <FiEdit />
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setShowDelete(true);
                      setError("");
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-50 text-red-600 py-2.5 text-sm font-medium hover:bg-red-600 hover:text-white transition"
                  >
                    <FiTrash2 />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* =====================================================
            Add Modal
        ===================================================== */}

        {showAdd && <VehicleForm mode="add" />}

        {/* =====================================================
            Edit Modal
        ===================================================== */}

        {showEdit && selectedVehicle && (
          <VehicleForm mode="edit" />
        )}

        {/* =====================================================
            View Modal
        ===================================================== */}

        {showView && selectedVehicle && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
            <div className="w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white shadow-2xl">
              {/* Header */}

              <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-5 sm:px-8 py-5 sm:py-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="hidden sm:flex h-14 w-14 rounded-2xl bg-white/20 items-center justify-center">
                      <FiTruck size={30} />
                    </div>

                    <div>
                      <h2 className="text-xl sm:text-3xl font-bold break-all">
                        {selectedVehicle.vehicleNumber}
                      </h2>

                      <p className="text-blue-100 mt-1">
                        Vehicle Details
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowView(false);
                      setSelectedVehicle(null);
                    }}
                    className="h-10 w-10 shrink-0 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"
                  >
                    <FiX size={22} />
                  </button>
                </div>
              </div>

              {/* Body */}

              <div className="p-5 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Status */}

                  <div className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                    <p className="text-sm text-slate-500 mb-2">
                      Status
                    </p>

                    <span
                      className={`inline-flex px-4 py-2 rounded-full font-semibold ${getStatusClass(
                        selectedVehicle.status
                      )}`}
                    >
                      {selectedVehicle.status}
                    </span>
                  </div>

                  {/* Speed */}

                  <div className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                    <p className="text-sm text-slate-500 mb-2">
                      Current Speed
                    </p>

                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-800">
                      {selectedVehicle.speed}

                      <span className="text-sm sm:text-lg ml-2 text-slate-400">
                        km/h
                      </span>
                    </h3>
                  </div>

                  {/* Fuel */}

                  <div className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                    <div className="flex justify-between mb-3">
                      <p className="text-sm text-slate-500">
                        Fuel Level
                      </p>

                      <span className="font-semibold">
                        {selectedVehicle.fuel}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${getFuelColor(
                          selectedVehicle.fuel
                        )}`}
                        style={{
                          width: `${Math.min(
                            Math.max(
                              selectedVehicle.fuel,
                              0
                            ),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Coordinates */}

                  <div className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                    <p className="text-sm text-slate-500 mb-3">
                      GPS Coordinates
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="font-medium">
                          Latitude
                        </span>

                        <span className="text-right break-all">
                          {selectedVehicle.latitude}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="font-medium">
                          Longitude
                        </span>

                        <span className="text-right break-all">
                          {selectedVehicle.longitude}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6 sm:mt-8">
                  <button
                    onClick={() => {
                      setShowView(false);
                      setSelectedVehicle(null);
                    }}
                    className="w-full sm:w-auto rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            Delete Modal
        ===================================================== */}

        {showDelete && selectedVehicle && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
            <div className="w-full max-w-md max-h-[95vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white shadow-2xl">
              {/* Header */}

              <div className="bg-gradient-to-r from-red-600 to-rose-600 px-5 sm:px-8 py-5 sm:py-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <FiTrash2 size={25} />
                    </div>

                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold">
                        Delete Vehicle
                      </h2>

                      <p className="text-sm text-red-100">
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowDelete(false);
                      setSelectedVehicle(null);
                    }}
                    className="h-9 w-9 shrink-0 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
                  >
                    <FiX />
                  </button>
                </div>
              </div>

              {/* Body */}

              <div className="p-5 sm:p-8">
                {error && (
                  <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-100 flex items-center justify-center">
                    <FiTrash2
                      size={38}
                      className="text-red-600"
                    />
                  </div>
                </div>

                <h3 className="text-center text-xl sm:text-2xl font-bold text-slate-800 mt-5">
                  Delete this vehicle?
                </h3>

                <p className="text-center text-sm sm:text-base text-slate-500 mt-3 leading-6">
                  You're about to permanently remove{" "}
                  <span className="font-semibold text-red-600">
                    {selectedVehicle.vehicleNumber}
                  </span>{" "}
                  from your fleet.
                </p>

                {/* Summary */}

                <div className="mt-6 rounded-2xl border bg-slate-50 p-4">
                  <div className="flex justify-between gap-4 py-2 text-sm">
                    <span className="text-slate-500">
                      Vehicle
                    </span>

                    <span className="font-semibold text-right">
                      {selectedVehicle.vehicleNumber}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 py-2 text-sm">
                    <span className="text-slate-500">
                      Status
                    </span>

                    <span className="font-semibold text-right">
                      {selectedVehicle.status}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 py-2 text-sm">
                    <span className="text-slate-500">
                      Fuel
                    </span>

                    <span className="font-semibold text-right">
                      {selectedVehicle.fuel}%
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 py-2 text-sm">
                    <span className="text-slate-500">
                      Speed
                    </span>

                    <span className="font-semibold text-right">
                      {selectedVehicle.speed} km/h
                    </span>
                  </div>
                </div>

                {/* Footer */}

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
                  <button
                    disabled={loading}
                    onClick={() => {
                      setShowDelete(false);
                      setSelectedVehicle(null);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 transition font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={loading}
                    onClick={handleDeleteVehicle}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <FiRefreshCw className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FiTrash2 />
                        Delete Vehicle
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;
