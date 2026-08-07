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
} from "react-icons/fi";

import { vehicleService } from "../../services/vehicleService";
import type { Vehicle } from "../../types/vehicle";

const initialForm = {
  vehicleNumber: "",
  status: "Idle" as
    | "Active"
    | "Idle"
    | "Maintenance"
    | "Offline",
  speed: 0,
  fuel: 100,
  latitude: 28.6139,
  longitude: 77.209,
};

const statusStyles = {
  Active: "bg-green-100 text-green-700",
  Idle: "bg-yellow-100 text-yellow-700",
  Maintenance: "bg-orange-100 text-orange-700",
  Offline: "bg-red-100 text-red-700",
};

const Vehicles = () => {
// ======================================================
// State
// ======================================================

const [vehicles, setVehicles] = useState<Vehicle[]>([]);
const [loading, setLoading] = useState(true);
const [submitting, setSubmitting] = useState(false);

const [search, setSearch] = useState("");

const [showAdd, setShowAdd] = useState(false);
const [showView, setShowView] = useState(false);
const [showEdit, setShowEdit] = useState(false);
const [showDelete, setShowDelete] = useState(false);

const [selectedVehicle, setSelectedVehicle] =
  useState<Vehicle | null>(null);

const [formData, setFormData] =
  useState(initialForm);


  // ======================================================
  // Load Vehicles
  // ======================================================

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);

      const data =
        await vehicleService.getVehicles();

      setVehicles(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load vehicles.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // Validation
  // ======================================================

  const validateForm = () => {
    if (!formData.vehicleNumber.trim()) {
      alert("Vehicle number is required.");
      return false;
    }

    if (formData.speed < 0) {
      alert("Speed cannot be negative.");
      return false;
    }

    if (
      formData.fuel < 0 ||
      formData.fuel > 100
    ) {
      alert(
        "Fuel must be between 0 and 100."
      );
      return false;
    }

    if (
      formData.latitude < -90 ||
      formData.latitude > 90
    ) {
      alert("Invalid latitude.");
      return false;
    }

    if (
      formData.longitude < -180 ||
      formData.longitude > 180
    ) {
      alert("Invalid longitude.");
      return false;
    }

    return true;
  };

  // ======================================================
  // Add Vehicle
  // ======================================================

  const handleAddVehicle = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const response = await vehicleService.createVehicle(formData);

      if (response.success) {
        await loadVehicles();
        setShowAdd(false);
        setFormData(initialForm);
      }
    } catch (error: any) {
      alert(
        error.response?.data?.message ??
        "Unable to create vehicle."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // Update Vehicle
  // ======================================================

  const handleUpdateVehicle = async () => {
    if (!selectedVehicle?._id) return;
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      await vehicleService.updateVehicle(
        selectedVehicle._id,
        formData
      );

      await loadVehicles();

      setShowEdit(false);
      setSelectedVehicle(null);
      setFormData(initialForm);
    } catch (error: any) {
      alert(
        error.response?.data?.message ??
        "Unable to update vehicle."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // Delete Vehicle
  // ======================================================

  const handleDeleteVehicle = async () => {
    if (!selectedVehicle?._id) return;

    try {
      setSubmitting(true);

      await vehicleService.deleteVehicle(
        selectedVehicle._id
      );

      await loadVehicles();

      setShowDelete(false);
      setSelectedVehicle(null);
      setFormData(initialForm);
    } catch (error: any) {
      alert(
        error.response?.data?.message ??
        "Unable to delete vehicle."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // Search
  // ======================================================

  const filteredVehicles = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    return vehicles.filter((vehicle) =>
      vehicle.vehicleNumber
        .toLowerCase()
        .includes(keyword)
    );
  }, [vehicles, search]);

  // ======================================================
  // Dashboard Statistics
  // ======================================================

  const stats = useMemo(() => {
    return vehicles.reduce(
      (acc, vehicle) => {
        acc.total++;

        switch (vehicle.status) {
          case "Active":
            acc.active++;
            break;

          case "Maintenance":
            acc.maintenance++;
            break;

          case "Offline":
            acc.offline++;
            break;

          default:
            acc.idle++;
        }

        return acc;
      },
      {
        total: 0,
        active: 0,
        idle: 0,
        maintenance: 0,
        offline: 0,
      }
    );
  }, [vehicles]);

  // ======================================================
  // JSX
  // ======================================================

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">

        {/* =======================================
            Header
        ======================================= */}

        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">

          <div>

            <h1 className="text-4xl font-bold text-slate-800">
              Fleet Management
            </h1>

            <p className="mt-2 text-slate-500">
              Monitor, manage and track your
              fleet vehicles.
            </p>

          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
          >
            <FiPlus size={20} />
            Add Vehicle
          </button>

        </div>

        {/* =======================================
            Dashboard
        ======================================= */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

          {/* Total */}

          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white shadow-xl">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-blue-100">
                  Total Vehicles
                </p>

                <h2 className="mt-2 text-4xl font-bold">
                  {stats.total}
                </h2>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">

                <FiTruck size={28} />

              </div>

            </div>

          </div>

          {/* Active */}

          <div className="rounded-2xl bg-gradient-to-r from-green-600 to-green-500 p-6 text-white shadow-xl">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-green-100">
                  Active
                </p>

                <h2 className="mt-2 text-4xl font-bold">
                  {stats.active}
                </h2>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">

                <FiActivity size={28} />

              </div>

            </div>

          </div>

          {/* Maintenance */}

          <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white shadow-xl">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-orange-100">
                  Maintenance
                </p>

                <h2 className="mt-2 text-4xl font-bold">
                  {stats.maintenance}
                </h2>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">

                <FiMapPin size={28} />

              </div>

            </div>

          </div>

          {/* Offline */}

          <div className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 p-6 text-white shadow-xl">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-red-100">
                  Offline
                </p>

                <h2 className="mt-2 text-4xl font-bold">
                  {stats.offline}
                </h2>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">

                <FiBatteryCharging size={28} />

              </div>

            </div>

          </div>

        </div>

        {/* =======================================
            Search
        ======================================= */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">

              <FiSearch className="text-xl text-blue-600" />

            </div>

            <input
              type="text"
              placeholder="Search vehicle..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="flex-1 text-lg outline-none placeholder:text-gray-400"
            />

          </div>

        </div>

        {/* =======================================
            PART 2 STARTS HERE
            Vehicle Table
        ======================================= */}

        {/* ==========================
            Vehicle Table
        ========================== */}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full">
              <thead className="bg-slate-50 border-b">
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-5">Vehicle</th>
                  <th className="px-6 py-5">Speed</th>
                  <th className="px-6 py-5">Fuel</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Location</th>
                  <th className="px-6 py-5 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {/* Loading */}

                {loading && (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>

                        <p className="mt-4 text-gray-500">
                          Loading vehicles...
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Vehicle Rows */}

                {!loading &&
                  filteredVehicles.map((vehicle) => (
                    <tr
                      key={vehicle._id}
                      className="border-b last:border-none hover:bg-slate-50 transition"
                    >
                      {/* Vehicle */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <FiTruck
                              size={22}
                              className="text-blue-600"
                            />
                          </div>

                          <div>
                            <h3 className="font-semibold text-slate-800">
                              {vehicle.vehicleNumber}
                            </h3>

                            <p className="text-sm text-gray-400">
                              Fleet Vehicle
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Speed */}

                      <td className="px-6 py-5">
                        <span className="font-semibold">
                          {vehicle.speed}
                        </span>

                        <span className="ml-1 text-gray-400">
                          km/h
                        </span>
                      </td>

                      {/* Fuel */}

                      <td className="px-6 py-5">
                        <div className="w-40">
                          <div className="flex justify-between text-sm mb-2">
                            <span>{vehicle.fuel}%</span>
                          </div>

                          <div className="w-full h-2.5 rounded-full bg-gray-200">
                            <div
                              className={`h-2.5 rounded-full transition-all duration-500 ${vehicle.fuel > 70
                                ? "bg-green-500"
                                : vehicle.fuel > 30
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                                }`}
                              style={{
                                width: `${vehicle.fuel}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${statusStyles[vehicle.status]}`}
                        >
                          {vehicle.status}
                        </span>
                      </td>

                      {/* Location */}

                      <td className="px-6 py-5">
                        <div className="text-sm">
                          <p className="font-medium">
                            {vehicle.latitude}
                          </p>

                          <p className="text-gray-400">
                            {vehicle.longitude}
                          </p>
                        </div>
                      </td>

                      {/* Actions */}

                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-3">

                          {/* View */}

                          <button
                            onClick={() => {
                              setSelectedVehicle(vehicle);
                              setShowView(true);
                            }}
                            className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                          >
                            <FiEye className="mx-auto" />
                          </button>

                          {/* Edit */}

                          <button
                            onClick={() => {
                              setSelectedVehicle(vehicle);

                              setFormData({
                                vehicleNumber:
                                  vehicle.vehicleNumber,
                                status: vehicle.status,
                                speed: vehicle.speed,
                                fuel: vehicle.fuel,
                                latitude: vehicle.latitude,
                                longitude: vehicle.longitude,
                              });

                              setShowEdit(true);
                            }}
                            className="w-10 h-10 rounded-xl bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition"
                          >
                            <FiEdit className="mx-auto" />
                          </button>

                          {/* Delete */}

                          <button
                            onClick={() => {
                              setSelectedVehicle(vehicle);
                              setShowDelete(true);
                            }}
                            className="w-10 h-10 rounded-xl bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                          >
                            <FiTrash2 className="mx-auto" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {/* Empty State */}

                {!loading &&
                  filteredVehicles.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-20 text-center"
                      >
                        <FiTruck
                          size={60}
                          className="mx-auto mb-5 text-gray-300"
                        />

                        <h3 className="text-xl font-semibold text-gray-700">
                          No Vehicles Found
                        </h3>

                        <p className="mt-2 text-gray-500">
                          Try another search or add a new
                          vehicle.
                        </p>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>
        {/* ==========================
    Add Vehicle Modal
========================== */}

        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">

              {/* Header */}

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
                <h2 className="text-3xl font-bold">
                  Add New Vehicle
                </h2>

                <p className="mt-2 text-blue-100">
                  Enter vehicle information below.
                </p>
              </div>

              {/* Body */}

              <div className="p-8">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  {/* Vehicle Number */}

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold">
                      Vehicle Number
                    </label>

                    <input
                      type="text"
                      placeholder="DL01AB1234"
                      value={formData.vehicleNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicleNumber: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  {/* Status */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Status
                    </label>

                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as
                            | "Active"
                            | "Idle"
                            | "Maintenance"
                            | "Offline",
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
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
                    <label className="mb-2 block text-sm font-semibold">
                      Speed (km/h)
                    </label>

                    <input
                      type="number"
                      value={formData.speed}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          speed: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  {/* Fuel */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Fuel (%)
                    </label>

                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.fuel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fuel: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  {/* Latitude */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Latitude
                    </label>

                    <input
                      type="number"
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          latitude: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  {/* Longitude */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Longitude
                    </label>

                    <input
                      type="number"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          longitude: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                </div>

                {/* Footer */}

                <div className="mt-8 flex flex-col-reverse justify-end gap-4 sm:flex-row">

                  <button
                    onClick={() => {
                      setShowAdd(false);
                      setFormData(initialForm);
                    }}
                    className="rounded-xl border border-gray-300 px-6 py-3 transition hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleAddVehicle}
                    disabled={submitting}
                    className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : "Save Vehicle"}
                  </button>

                </div>
              </div>
            </div>
          </div>
        )}
        {/* ==========================
    View Vehicle Modal
========================== */}

        {showView && selectedVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">

              {/* Header */}

              <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-8 py-6 text-white">
                <div className="flex items-center gap-4">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                    <FiTruck size={32} />
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold">
                      {selectedVehicle.vehicleNumber}
                    </h2>

                    <p className="text-blue-100">
                      Vehicle Details
                    </p>
                  </div>

                </div>
              </div>

              {/* Body */}

              <div className="p-8">

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                  {/* Status */}

                  <div className="rounded-2xl border p-5">
                    <p className="mb-2 text-sm text-gray-500">
                      Status
                    </p>

                    <span
                      className={`inline-flex rounded-full px-4 py-2 font-semibold ${selectedVehicle.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : selectedVehicle.status === "Idle"
                          ? "bg-yellow-100 text-yellow-700"
                          : selectedVehicle.status === "Maintenance"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {selectedVehicle.status}
                    </span>
                  </div>

                  {/* Speed */}

                  <div className="rounded-2xl border p-5">
                    <p className="mb-2 text-sm text-gray-500">
                      Current Speed
                    </p>

                    <h3 className="text-3xl font-bold text-slate-800">
                      {selectedVehicle.speed}

                      <span className="ml-2 text-lg text-gray-500">
                        km/h
                      </span>
                    </h3>
                  </div>

                  {/* Fuel */}

                  <div className="rounded-2xl border p-5">

                    <div className="mb-3 flex justify-between">
                      <p className="text-sm text-gray-500">
                        Fuel Level
                      </p>

                      <span className="font-semibold">
                        {selectedVehicle.fuel}%
                      </span>
                    </div>

                    <div className="h-3 w-full rounded-full bg-gray-200">
                      <div
                        className={`h-3 rounded-full ${selectedVehicle.fuel > 70
                          ? "bg-green-500"
                          : selectedVehicle.fuel > 30
                            ? "bg-yellow-500"
                            : "bg-red-500"
                          }`}
                        style={{
                          width: `${selectedVehicle.fuel}%`,
                        }}
                      />
                    </div>

                  </div>

                  {/* GPS Coordinates */}

                  <div className="rounded-2xl border p-5">

                    <p className="mb-3 text-sm text-gray-500">
                      GPS Coordinates
                    </p>

                    <div className="space-y-2">

                      <div className="flex justify-between">
                        <span className="font-medium">
                          Latitude
                        </span>

                        <span>{selectedVehicle.latitude}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium">
                          Longitude
                        </span>

                        <span>{selectedVehicle.longitude}</span>
                      </div>

                    </div>

                  </div>

                  {/* Created At */}

                  {selectedVehicle.createdAt && (
                    <div className="rounded-2xl border p-5">

                      <p className="mb-2 text-sm text-gray-500">
                        Created
                      </p>

                      <p className="font-semibold text-slate-700">
                        {new Date(
                          selectedVehicle.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>
                  )}

                  {/* Updated At */}

                  {selectedVehicle.updatedAt && (
                    <div className="rounded-2xl border p-5">

                      <p className="mb-2 text-sm text-gray-500">
                        Last Updated
                      </p>

                      <p className="font-semibold text-slate-700">
                        {new Date(
                          selectedVehicle.updatedAt
                        ).toLocaleString()}
                      </p>

                    </div>
                  )}

                </div>

                {/* Footer */}

                <div className="mt-8 flex justify-end">

                  <button
                    onClick={() => {
                      setShowView(false);
                      setSelectedVehicle(null);
                      setFormData(initialForm);
                    }}
                    className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                  >
                    Close
                  </button>

                </div>

              </div>

            </div>
          </div>
        )}

        {/* ==========================
    Edit Vehicle Modal
========================== */}

        {showEdit && selectedVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">

              {/* Header */}

              <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-6 text-white">
                <div className="flex items-center gap-4">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                    <FiEdit size={30} />
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold">
                      Edit Vehicle
                    </h2>

                    <p className="text-green-100">
                      Update vehicle information
                    </p>
                  </div>

                </div>
              </div>

              {/* Body */}

              <div className="p-8">

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  {/* Vehicle Number */}

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Vehicle Number
                    </label>

                    <input
                      type="text"
                      value={formData.vehicleNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicleNumber: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    />
                  </div>

                  {/* Status */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Status
                    </label>

                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as
                            | "Active"
                            | "Idle"
                            | "Maintenance"
                            | "Offline",
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    >
                      <option value="Active">Active</option>
                      <option value="Idle">Idle</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>

                  {/* Speed */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Speed (km/h)
                    </label>

                    <input
                      type="number"
                      value={formData.speed}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          speed: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    />
                  </div>

                  {/* Fuel */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Fuel (%)
                    </label>

                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.fuel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fuel: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    />
                  </div>

                  {/* Latitude */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Latitude
                    </label>

                    <input
                      type="number"
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          latitude: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    />
                  </div>

                  {/* Longitude */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Longitude
                    </label>

                    <input
                      type="number"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          longitude: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    />
                  </div>

                </div>

                {/* Footer */}

                <div className="mt-8 flex flex-col-reverse justify-end gap-4 sm:flex-row">

                  <button
                    onClick={() => {
                      setShowEdit(false);
                      setSelectedVehicle(null);
                      setFormData(initialForm);
                    }}
                    className="rounded-xl border border-gray-300 px-6 py-3 transition hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleUpdateVehicle}
                    disabled={submitting}
                    className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Updating..." : "Update Vehicle"}
                  </button>

                </div>

              </div>

            </div>
          </div>
        )}
        {/* ==========================
    Delete Vehicle Modal
========================== */}

        {showDelete && selectedVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">

              {/* Header */}

              <div className="bg-gradient-to-r from-red-600 to-rose-600 px-8 py-6 text-white">
                <div className="flex items-center gap-4">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                    <FiTrash2 size={30} />
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold">
                      Delete Vehicle
                    </h2>

                    <p className="text-red-100">
                      This action cannot be undone.
                    </p>
                  </div>

                </div>
              </div>

              {/* Body */}

              <div className="p-8">

                <div className="flex justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                    <FiTrash2
                      size={42}
                      className="text-red-600"
                    />
                  </div>
                </div>

                <h3 className="mt-6 text-center text-2xl font-bold text-gray-800">
                  Delete this vehicle?
                </h3>

                <p className="mt-3 text-center leading-7 text-gray-500">
                  You're about to permanently remove
                  <span className="font-semibold text-red-600">
                    {" "}
                    {selectedVehicle.vehicleNumber}
                  </span>{" "}
                  from your fleet.
                </p>

                {/* Vehicle Summary */}

                <div className="mt-8 rounded-2xl border bg-gray-50 p-5">

                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">
                      Vehicle
                    </span>

                    <span className="font-semibold">
                      {selectedVehicle.vehicleNumber}
                    </span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">
                      Status
                    </span>

                    <span className="font-semibold">
                      {selectedVehicle.status}
                    </span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">
                      Fuel
                    </span>

                    <span className="font-semibold">
                      {selectedVehicle.fuel}%
                    </span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">
                      Speed
                    </span>

                    <span className="font-semibold">
                      {selectedVehicle.speed} km/h
                    </span>
                  </div>

                </div>

                {/* Footer */}

                <div className="mt-8 flex flex-col-reverse justify-end gap-4 sm:flex-row">

                  <button
                    onClick={() => {
                      setShowDelete(false);
                      setSelectedVehicle(null);
                    }}
                    className="rounded-xl border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleDeleteVehicle}
                    disabled={submitting}
                    className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Deleting..." : "Delete Vehicle"}
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