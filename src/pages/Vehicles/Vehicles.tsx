import { useEffect, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiEye,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

import { vehicleService } from "../../services/vehicleService";

interface Vehicle {
  _id?: string;
  vehicleNumber: string;
  driver?: string;
  speed: number;
  fuel: number;
  status: "Active" | "Idle" | "Offline";
  latitude: number;
  longitude: number;
  createdAt?: string;
  updatedAt?: string;
}

const Vehicles = () => {
  // ==========================
  // State
  // ==========================

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedVehicle, setSelectedVehicle] =
    useState<Vehicle | null>(null);

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    status: "Idle" as "Active" | "Idle" | "Offline",
    speed: 0,
    fuel: 100,
    latitude: 28.6139,
    longitude: 77.2090,
  });

  // ==========================
  // Load Vehicles
  // ==========================

  useEffect(() => {
    console.log("Vehicles Page Loaded");
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const vehicles = await vehicleService.getVehicles();

      console.log("Vehicles:", vehicles);

      setVehicles(vehicles);
    } catch (error) {
      console.error("Load Vehicles Error:", error);
    }
  };

  // ==========================
  // Add Vehicle
  // ==========================
  const handleAddVehicle = async () => {
    console.log("SAVE BUTTON CLICKED");

    try {
      console.log("Sending Data:", formData);

      const response = await vehicleService.createVehicle({
        vehicleNumber: formData.vehicleNumber,
        speed: formData.speed,
        fuel: formData.fuel,
        status: formData.status,
        latitude: formData.latitude,
        longitude: formData.longitude,
      });

      console.log("Backend Response:", response);

      if (response.success) {
        alert("Vehicle Added Successfully");

        await loadVehicles();

        setShowAdd(false);

        setFormData({
          vehicleNumber: "",
          status: "Idle",
          speed: 0,
          fuel: 100,
          latitude: 28.6139,
          longitude: 77.2090,
        });
      }

    } catch (error: any) {
      console.error(
        "ADD VEHICLE ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Vehicle creation failed"
      );
    }
  };

  // ==========================
  // Update Vehicle
  // ==========================

  const handleUpdateVehicle = async () => {
    if (!selectedVehicle?._id) {
      console.error("Vehicle ID missing");
      return;
    }

    try {
      await vehicleService.updateVehicle(
        selectedVehicle._id,
        formData
      );

      await loadVehicles();

      setShowEdit(false);
      setSelectedVehicle(null);

    } catch (error) {
      console.error(
        "Update Vehicle Error:",
        error
      );
    }
  };

  // ==========================
  // Delete Vehicle
  // ==========================

  const handleDeleteVehicle = async () => {
    if (!selectedVehicle?._id) {
      console.error("Vehicle ID missing");
      return;
    }

    try {
      await vehicleService.deleteVehicle(
        selectedVehicle._id
      );

      await loadVehicles();

      setShowDelete(false);

      setSelectedVehicle(null);

    } catch (error) {
      console.error(
        "Delete Vehicle Error:",
        error
      );
    }
  };
  // ==========================
  // Search
  // ==========================

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.vehicleNumber
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ==========================
  // Statistics
  // ==========================

  const totalVehicles = vehicles.length;

  const activeVehicles = vehicles.filter(
    (v) => v.status === "Active"
  ).length;

  const idleVehicles = vehicles.filter(
    (v) => v.status === "Idle"
  ).length;

  const offlineVehicles = vehicles.filter(
    (v) => v.status === "Offline"
  ).length;

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Vehicle Management
          </h1>

          <p className="text-gray-500">
            Manage your fleet vehicles
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2"
        >
          <FiPlus />
          Add Vehicle
        </button>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500">
            Total Vehicles
          </h3>

          <p className="text-3xl font-bold">
            {totalVehicles}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500">
            Active
          </h3>

          <p className="text-3xl font-bold text-green-600">
            {activeVehicles}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500">
            Idle
          </h3>

          <p className="text-3xl font-bold text-yellow-600">
            {idleVehicles}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500">
            Offline
          </h3>

          <p className="text-3xl font-bold text-red-600">
            {offlineVehicles}
          </p>
        </div>

      </div>

      {/* Search */}

      <div className="bg-white rounded-xl shadow p-5 flex items-center gap-3">

        <FiSearch className="text-gray-400 text-xl" />

        <input
          type="text"
          placeholder="Search vehicle number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none"
        />

      </div>

      {/* Vehicle Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Vehicle Number
              </th>

              <th className="p-4 text-left">
                Speed
              </th>

              <th className="p-4 text-left">
                Fuel
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Latitude
              </th>

              <th className="p-4 text-left">
                Longitude
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredVehicles.map((vehicle) => (

              <tr
                key={vehicle._id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4">
                  {vehicle.vehicleNumber}
                </td>

                <td className="p-4">
                  {vehicle.speed} km/h
                </td>

                <td className="p-4">
                  {vehicle.fuel}%
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${vehicle.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : vehicle.status === "Idle"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {vehicle.status}
                  </span>

                </td>

                <td className="p-4">
                  {vehicle.latitude}
                </td>

                <td className="p-4">
                  {vehicle.longitude}
                </td>

                <td className="p-4">

                  <div className="flex gap-3">

                    <button
                      className="text-blue-600"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowView(true);
                      }}
                    >
                      <FiEye />
                    </button>

                    <button
                      className="text-green-600"
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
                    >
                      <FiEdit />
                    </button>

                    <button
                      className="text-red-600"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowDelete(true);
                      }}
                    >
                      <FiTrash2 />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Add Vehicle Modal */}

      {showAdd && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-full max-w-lg">

            <h2 className="text-2xl font-bold mb-5">
              Add Vehicle
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                className="w-full border rounded-lg p-3"
                placeholder="Vehicle Number"
                value={formData.vehicleNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vehicleNumber: e.target.value,
                  })
                }
              />


              <select
                className="w-full border rounded-lg p-3"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as
                      | "Active"
                      | "Idle"
                      | "Offline",
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Idle">Idle</option>
                <option value="Offline">Offline</option>
              </select>


              <input
                type="number"
                className="w-full border rounded-lg p-3"
                placeholder="Speed"
                value={formData.speed}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    speed: Number(e.target.value),
                  })
                }
              />


              <input
                type="number"
                className="w-full border rounded-lg p-3"
                placeholder="Fuel"
                value={formData.fuel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fuel: Number(e.target.value),
                  })
                }
              />


              <input
                type="number"
                className="w-full border rounded-lg p-3"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    latitude: Number(e.target.value),
                  })
                }
              />


              <input
                type="number"
                className="w-full border rounded-lg p-3"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    longitude: Number(e.target.value),
                  })
                }
              />


              <button
                onClick={handleAddVehicle}
                className="w-full bg-blue-600 text-white rounded-lg p-3"
              >
                Save Vehicle
              </button>

            </div>

          </div>

        </div>

      )}

      {/* View Vehicle */}

      {showView && selectedVehicle && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white rounded-xl p-6 w-full max-w-md">

            <h2 className="text-2xl font-bold mb-5">
              Vehicle Details
            </h2>

            <div className="space-y-3">

              <p>
                <strong>Vehicle:</strong>{" "}
                {selectedVehicle.vehicleNumber}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedVehicle.status}
              </p>

              <p>
                <strong>Speed:</strong>{" "}
                {selectedVehicle.speed} km/h
              </p>

              <p>
                <strong>Fuel:</strong>{" "}
                {selectedVehicle.fuel}%
              </p>

              <p>
                <strong>Latitude:</strong>{" "}
                {selectedVehicle.latitude}
              </p>

              <p>
                <strong>Longitude:</strong>{" "}
                {selectedVehicle.longitude}
              </p>

            </div>

            <button
              onClick={() => setShowView(false)}
              className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Close
            </button>

          </div>

        </div>

      )}

      {/* ==========================
          Edit Vehicle Modal
      ========================== */}

      {showEdit && selectedVehicle && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">

            <h2 className="text-2xl font-bold mb-5">
              Edit Vehicle
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                className="w-full border rounded-lg p-3"
                placeholder="Vehicle Number"
                value={formData.vehicleNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vehicleNumber: e.target.value,
                  })
                }
              />

              <select
                className="w-full border rounded-lg p-3"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as
                      | "Active"
                      | "Idle"
                      | "Offline",
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Idle">Idle</option>
                <option value="Offline">Offline</option>
              </select>

              <input
                type="number"
                className="w-full border rounded-lg p-3"
                placeholder="Speed"
                value={formData.speed}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    speed: Number(e.target.value),
                  })
                }
              />

              <input
                type="number"
                className="w-full border rounded-lg p-3"
                placeholder="Fuel"
                value={formData.fuel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fuel: Number(e.target.value),
                  })
                }
              />

              <input
                type="number"
                className="w-full border rounded-lg p-3"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    latitude: Number(e.target.value),
                  })
                }
              />

              <input
                type="number"
                className="w-full border rounded-lg p-3"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    longitude: Number(e.target.value),
                  })
                }
              />

              <div className="flex justify-end gap-3 pt-4">

                <button
                  onClick={() => {
                    setShowEdit(false);
                    setSelectedVehicle(null);
                  }}
                  className="px-5 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdateVehicle}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg"
                >
                  Update
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-full max-w-md">

            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Delete Vehicle
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete
              <strong> {selectedVehicle.vehicleNumber}</strong>?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => {
                  setShowDelete(false);
                  setSelectedVehicle(null);
                }}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteVehicle}
                className="px-5 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Vehicles;