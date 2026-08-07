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

const Vehicles = () => {
  // ==============================
  // States
  // ==============================

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedVehicle, setSelectedVehicle] =
    useState<Vehicle | null>(null);

  const [formData, setFormData] = useState(initialForm);

  // ==============================
  // Load Vehicles
  // ==============================

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);

      const data = await vehicleService.getVehicles();

      setVehicles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Add Vehicle
  // ==============================

  const handleAddVehicle = async () => {
    try {
      const response =
        await vehicleService.createVehicle(formData);

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
    }
  };

  // ==============================
  // Update Vehicle
  // ==============================

  const handleUpdateVehicle = async () => {
    if (!selectedVehicle?._id) return;

    try {
      await vehicleService.updateVehicle(
        selectedVehicle._id,
        formData
      );

      await loadVehicles();

      setShowEdit(false);

      setSelectedVehicle(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ==============================
  // Delete Vehicle
  // ==============================

  const handleDeleteVehicle = async () => {
    if (!selectedVehicle?._id) return;

    try {
      await vehicleService.deleteVehicle(
        selectedVehicle._id
      );

      await loadVehicles();

      setShowDelete(false);

      setSelectedVehicle(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ==============================
  // Search Filter
  // ==============================

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) =>
      vehicle.vehicleNumber
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [vehicles, search]);

  // ==============================
  // Dashboard Stats
  // ==============================

  const totalVehicles = vehicles.length;

  const activeVehicles = vehicles.filter(
    (v) => v.status === "Active"
  ).length;

  // idleVehicles not used elsewhere; remove to avoid unused variable warning

  const maintenanceVehicles = vehicles.filter(
    (v) => v.status === "Maintenance"
  ).length;

  const offlineVehicles = vehicles.filter(
    (v) => v.status === "Offline"
  ).length;

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* ==============================
            Header
        ============================== */}

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

          <div>

            <h1 className="text-4xl font-bold text-slate-800">
              Fleet Management
            </h1>

            <p className="mt-2 text-slate-500">
              Monitor, manage and track your fleet vehicles.
            </p>

          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
          >
            <FiPlus size={20} />
            Add Vehicle
          </button>

        </div>

        {/* ==============================
            Dashboard Cards
        ============================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 shadow-xl">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-blue-100">
                  Total Vehicles
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {totalVehicles}
                </h2>

              </div>

              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">

                <FiTruck size={28} />

              </div>

            </div>

          </div>

          <div className="rounded-2xl bg-gradient-to-r from-green-600 to-green-500 text-white p-6 shadow-xl">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-green-100">
                  Active
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {activeVehicles}
                </h2>

              </div>

              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">

                <FiActivity size={28} />

              </div>

            </div>

          </div>

          <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-6 shadow-xl">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-orange-100">
                  Maintenance
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {maintenanceVehicles}
                </h2>

              </div>

              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">

                <FiMapPin size={28} />

              </div>

            </div>

          </div>

          <div className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 text-white p-6 shadow-xl">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-red-100">
                  Offline
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {offlineVehicles}
                </h2>

              </div>

              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">

                <FiBatteryCharging size={28} />

              </div>

            </div>

          </div>

        </div>

        {/* ==============================
            Search Bar
        ============================== */}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">

              <FiSearch className="text-blue-600 text-xl" />

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

        {/* Part 2 starts here */}

                {/* ==============================
            Vehicle Table
        ============================== */}

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

                  <th className="px-6 py-5 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {/* Loading */}

                {loading && (

                  <tr>

                    <td
                      colSpan={6}
                      className="py-20 text-center"
                    >

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

                        <span className="text-gray-400 ml-1">

                          km/h

                        </span>

                      </td>

                      {/* Fuel */}

                      <td className="px-6 py-5">

                        <div className="w-40">

                          <div className="flex justify-between text-sm mb-2">

                            <span>

                              {vehicle.fuel}%

                            </span>

                          </div>

                          <div className="w-full h-2.5 rounded-full bg-gray-200">

                            <div
                              className={`h-2.5 rounded-full transition-all duration-500 ${
                                vehicle.fuel > 70
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
                          className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                            vehicle.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : vehicle.status === "Idle"
                              ? "bg-yellow-100 text-yellow-700"
                              : vehicle.status === "Maintenance"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                          }`}
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
                          className="mx-auto text-gray-300 mb-5"
                        />

                        <h3 className="text-xl font-semibold text-gray-700">

                          No Vehicles Found

                        </h3>

                        <p className="text-gray-500 mt-2">

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

        {/* ==============================
            Part 3 Starts Here
            Add Vehicle Modal
        ============================== */}

                {/* ==============================
            Add Vehicle Modal
        ============================== */}

        {showAdd && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">

              {/* Header */}

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">

                <h2 className="text-3xl font-bold">
                  Add New Vehicle
                </h2>

                <p className="text-blue-100 mt-2">
                  Enter vehicle information below.
                </p>

              </div>

              {/* Body */}

              <div className="p-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Vehicle Number */}

                  <div className="md:col-span-2">

                    <label className="block text-sm font-semibold mb-2">
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
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition"
                    />

                  </div>

                  {/* Status */}

                  <div>

                    <label className="block text-sm font-semibold mb-2">
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
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
                    >
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

                  {/* Speed */}

                  <div>

                    <label className="block text-sm font-semibold mb-2">
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
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
                    />

                  </div>

                  {/* Fuel */}

                  <div>

                    <label className="block text-sm font-semibold mb-2">
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
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
                    />

                  </div>

                  {/* Latitude */}

                  <div>

                    <label className="block text-sm font-semibold mb-2">
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
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
                    />

                  </div>

                  {/* Longitude */}

                  <div>

                    <label className="block text-sm font-semibold mb-2">
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
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
                    />

                  </div>

                </div>

                {/* Live Preview */}

                <div className="mt-8 rounded-2xl border bg-slate-50 p-5">

                  <h3 className="font-semibold text-slate-700 mb-5">
                    Vehicle Preview
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                    <div>

                      <p className="text-xs text-gray-500">
                        Vehicle
                      </p>

                      <p className="font-semibold mt-1">
                        {formData.vehicleNumber || "--"}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Speed
                      </p>

                      <p className="font-semibold mt-1">
                        {formData.speed} km/h
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Fuel
                      </p>

                      <p className="font-semibold mt-1">
                        {formData.fuel}%
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Status
                      </p>

                      <p className="font-semibold mt-1">
                        {formData.status}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Footer */}

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 mt-8">

                  <button
                    onClick={() => {
                      setShowAdd(false);
                      setFormData(initialForm);
                    }}
                    className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleAddVehicle}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition"
                  >
                    Save Vehicle
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==============================
            Part 4 Starts Here
            View Vehicle Modal
        ============================== */}

        {/* ==========================
    Vehicle Table
========================== */}

<div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
  <div className="overflow-x-auto">
    <table className="min-w-[1100px] w-full">
      <thead className="bg-slate-50 border-b">
        <tr className="text-left text-gray-500 uppercase text-sm">
          <th className="px-6 py-5">Vehicle</th>
          <th className="px-6 py-5">Speed</th>
          <th className="px-6 py-5">Fuel</th>
          <th className="px-6 py-5">Status</th>
          <th className="px-6 py-5">Location</th>
          <th className="px-6 py-5 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {filteredVehicles.map((vehicle) => (
          <tr
            key={vehicle._id}
            className="border-b last:border-none hover:bg-slate-50 transition-all"
          >
            {/* Vehicle */}
            <td className="px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FiTruck className="text-blue-600" size={22} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
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
              <span className="font-semibold text-slate-700">
                {vehicle.speed}
              </span>
              <span className="text-gray-400 ml-1">
                km/h
              </span>
            </td>

            {/* Fuel */}
            <td className="px-6 py-5">
              <div className="w-40">
                <div className="flex justify-between text-sm mb-2">
                  <span>{vehicle.fuel}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      vehicle.fuel > 70
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
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  vehicle.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : vehicle.status === "Idle"
                    ? "bg-yellow-100 text-yellow-700"
                    : vehicle.status === "Maintenance"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-red-100 text-red-700"
                }`}
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
                      vehicleNumber: vehicle.vehicleNumber,
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

        {filteredVehicles.length === 0 && (
          <tr>
            <td
              colSpan={6}
              className="py-14 text-center text-gray-500"
            >
              <FiTruck
                size={50}
                className="mx-auto mb-4 text-gray-300"
              />

              <p className="text-lg">
                No vehicles found
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
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">

        <h2 className="text-3xl font-bold">
          Add New Vehicle
        </h2>

        <p className="text-blue-100 mt-1">
          Enter vehicle information below.
        </p>

      </div>

      {/* Body */}

      <div className="p-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Vehicle Number */}

          <div className="md:col-span-2">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
            />

          </div>

          {/* Status */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
            >
              <option value="Active">Active</option>
              <option value="Idle">Idle</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Offline">Offline</option>
            </select>

          </div>

          {/* Speed */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
            />

          </div>

          {/* Fuel */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fuel (%)
            </label>

            <input
              type="number"
              value={formData.fuel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fuel: Number(e.target.value),
                })
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
            />

          </div>

          {/* Latitude */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
            />

          </div>

          {/* Longitude */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
            />

          </div>

        </div>

        {/* Footer */}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 mt-8">

          <button
            onClick={() => setShowAdd(false)}
            className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleAddVehicle}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Save Vehicle
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
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

    <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

      {/* Header */}

      <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-8 py-6 text-white">

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Status */}

          <div className="rounded-2xl border p-5">

            <p className="text-sm text-gray-500 mb-2">
              Status
            </p>

            <span
              className={`inline-flex px-4 py-2 rounded-full font-semibold ${
                selectedVehicle.status === "Active"
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

            <p className="text-sm text-gray-500 mb-2">
              Current Speed
            </p>

            <h3 className="text-3xl font-bold text-slate-800">
              {selectedVehicle.speed}

              <span className="text-lg ml-2 text-gray-500">
                km/h
              </span>

            </h3>

          </div>

          {/* Fuel */}

          <div className="rounded-2xl border p-5">

            <div className="flex justify-between mb-3">

              <p className="text-sm text-gray-500">
                Fuel Level
              </p>

              <span className="font-semibold">
                {selectedVehicle.fuel}%
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">

              <div
                className={`h-3 rounded-full ${
                  selectedVehicle.fuel > 70
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

            <p className="text-sm text-gray-500 mb-3">
              GPS Coordinates
            </p>

            <div className="space-y-2">

              <div className="flex justify-between">

                <span className="font-medium">
                  Latitude
                </span>

                <span>
                  {selectedVehicle.latitude}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="font-medium">
                  Longitude
                </span>

                <span>
                  {selectedVehicle.longitude}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end mt-8">

          <button
            onClick={() => {
              setShowView(false);
              setSelectedVehicle(null);
            }}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold transition"
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
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

      {/* Header */}

      <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-6 text-white">

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Vehicle Number */}

          <div className="md:col-span-2">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
            />

          </div>

          {/* Status */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
            >
              <option value="Active">Active</option>
              <option value="Idle">Idle</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Offline">Offline</option>
            </select>

          </div>

          {/* Speed */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
            />

          </div>

          {/* Fuel */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fuel (%)
            </label>

            <input
              type="number"
              value={formData.fuel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fuel: Number(e.target.value),
                })
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
            />

          </div>

          {/* Latitude */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
            />

          </div>

          {/* Longitude */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
            />

          </div>

        </div>

        {/* Preview Card */}

        <div className="mt-8 rounded-2xl bg-slate-50 border p-5">

          <h3 className="font-semibold text-slate-700 mb-4">
            Live Preview
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div>
              <p className="text-xs text-gray-500">
                Vehicle
              </p>

              <p className="font-semibold">
                {formData.vehicleNumber}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Speed
              </p>

              <p className="font-semibold">
                {formData.speed} km/h
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Fuel
              </p>

              <p className="font-semibold">
                {formData.fuel}%
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Status
              </p>

              <p className="font-semibold">
                {formData.status}
              </p>
            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 mt-8">

          <button
            onClick={() => {
              setShowEdit(false);
              setSelectedVehicle(null);
            }}
            className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdateVehicle}
            className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg transition"
          >
            Update Vehicle
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
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

    <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

      {/* Header */}

      <div className="bg-gradient-to-r from-red-600 to-rose-600 px-8 py-6 text-white">

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
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

          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">

            <FiTrash2
              size={42}
              className="text-red-600"
            />

          </div>

        </div>

        <h3 className="text-center text-2xl font-bold text-gray-800 mt-6">
          Delete this vehicle?
        </h3>

        <p className="text-center text-gray-500 mt-3 leading-7">

          You're about to permanently remove

          <span className="font-semibold text-red-600">
            {" "}
            {selectedVehicle.vehicleNumber}
          </span>

          {" "}from your fleet.

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

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 mt-8">

          <button
            onClick={() => {
              setShowDelete(false);
              setSelectedVehicle(null);
            }}
            className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleDeleteVehicle}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg transition"
          >
            Delete Vehicle
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