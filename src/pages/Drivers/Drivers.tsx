import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
} from "react-icons/fa";

import {
  fetchDrivers,
  addDriver,
} from "../../store/slice/driverSlice";

import type {
  RootState,
  AppDispatch,
} from "../../store/store";

interface DriverForm {
  id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  address: string;
  experience: number;
  status: string;
}

const Drivers = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    drivers = [],
    loading,
  } = useSelector(
    (state: RootState) => state.drivers
  );

  // ==========================
  // States
  // ==========================

  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [showViewModal, setShowViewModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedDriver, setSelectedDriver] =
    useState<DriverForm | null>(null);

  const [formData, setFormData] =
    useState<DriverForm>({
      fullName: "",
      email: "",
      phoneNumber: "",
      licenseNumber: "",
      address: "",
      experience: 0,
      status: "Available",
    });

  // ==========================
  // Load Drivers
  // ==========================

  useEffect(() => {
    dispatch(fetchDrivers());
  }, [dispatch]);

  // ==========================
  // Search
  // ==========================

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver: any) =>
      driver.fullName
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [drivers, search]);

  // ==========================
  // Statistics
  // ==========================

  const stats = [
    {
      title: "Total Drivers",
      value: drivers.length,
      icon: <FaUsers size={28} />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Available",
      value: drivers.filter(
        (d: any) => d.status === "Available"
      ).length,
      icon: <FaUserCheck size={28} />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "On Trip",
      value: drivers.filter(
        (d: any) => d.status === "On Trip"
      ).length,
      icon: <FaUserClock size={28} />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
    {
      title: "Licensed",
      value: drivers.filter(
        (d: any) =>
          d.licenseStatus === "Licensed"
      ).length,
      icon: <FaIdCard size={28} />,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
  ];

  // ==========================
  // Form Handlers
  // ==========================

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "experience"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleAddDriver = async () => {
    console.log("========== ADD DRIVER START ==========");
    console.log("Form Data:", formData);

    // Basic frontend validation
    if (!formData.fullName.trim()) {
      alert("Full Name is required");
      return;
    }

    if (!formData.email.trim()) {
      alert("Email is required");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      alert("Phone Number is required");
      return;
    }

    if (!formData.licenseNumber.trim()) {
      alert("License Number is required");
      return;
    }

    if (!formData.address.trim()) {
      alert("Address is required");
      return;
    }

    try {
      const result = await dispatch(addDriver(formData)).unwrap();

      console.log("========== ADD DRIVER SUCCESS ==========");
      console.log("Backend Result:", result);

      alert("Driver Added Successfully");

      // Refresh list from backend
      await dispatch(fetchDrivers());

      // Close modal
      setShowAddModal(false);

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        licenseNumber: "",
        address: "",
        experience: 0,
        status: "Available",
      });

    } catch (error: any) {
      console.error("========== ADD DRIVER FAILED ==========");
      console.error("Actual Error:", error);

      alert(
        typeof error === "string"
          ? error
          : error?.message || "Failed to add driver"
      );
    }
  };

  const handleViewDriver = (driver: DriverForm) => {
    setSelectedDriver(driver);
    setShowViewModal(true);
  };

  const handleEditDriver = (driver: DriverForm) => {
    setSelectedDriver(driver);
    setFormData(driver);
    setShowEditModal(true);
  };

  const handleDeleteDriver = (
    driver: DriverForm
  ) => {
    setSelectedDriver(driver);
    setShowDeleteModal(true);
  };
  return (
    <div className="space-y-8">

      {/* ================= Header ================= */}

      <div className="flex flex-col lg:flex-row justify-between items-center gap-5">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Driver Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all fleet drivers from one place.
          </p>
        </div>

        <div className="flex gap-3">

          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />

            <input
              type="text"
              placeholder="Search Driver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-72"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <FaPlus />
            Add Driver
          </button>

        </div>

      </div>

      {/* ================= Statistics ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map((item, index) => (

          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center"
          >

            <div>

              <p className="text-gray-500 text-sm">
                {item.title}
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {item.value}
              </h2>

            </div>

            <div
              className={`${item.bg} ${item.color} p-4 rounded-full`}
            >
              {item.icon}
            </div>

          </div>

        ))}

      </div>


      {/* ================= Driver Table ================= */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-6 py-3 text-left">
                  Driver
                </th>

                <th className="px-6 py-3 text-left">
                  Phone
                </th>

                <th className="px-6 py-3 text-left">
                  License
                </th>

                <th className="px-6 py-3 text-left">
                  Experience
                </th>

                <th className="px-6 py-3 text-left">
                  Status
                </th>

                <th className="px-6 py-3 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8"
                  >
                    Loading drivers...
                  </td>
                </tr>
              )}

              {!loading &&
                filteredDrivers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No drivers found.
                    </td>
                  </tr>
                )}

              {!loading &&
                filteredDrivers.map(
                  (driver: any, index: number) => (

                    <tr
                      key={driver._id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="px-6 py-4">

                        <div>

                          <p className="font-semibold">
                            {driver.fullName}
                          </p>

                          <p className="text-gray-500 text-sm">
                            {driver.email}
                          </p>

                        </div>

                      </td>

                      <td className="px-6 py-4">
                        {driver.phoneNumber}
                      </td>

                      <td className="px-6 py-4">
                        {driver.licenseNumber}
                      </td>

                      <td className="px-6 py-4">
                        {driver.experience} Years
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium
                          ${driver.status === "Available"
                              ? "bg-green-100 text-green-700"
                              : driver.status === "On Trip"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                        >
                          {driver.status}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex justify-center gap-3">

                          <button
                            onClick={() =>
                              handleViewDriver(driver)
                            }
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEye />
                          </button>

                          <button
                            onClick={() =>
                              handleEditDriver(driver)
                            }
                            className="text-green-600 hover:text-green-800"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteDriver(driver)
                            }
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

            </tbody>

          </table>

        </div>

      </div>
      {/* ================= Add Driver Modal ================= */}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">

            <h2 className="text-2xl font-bold mb-6">
              Add Driver
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="border p-3 rounded-lg"
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="border p-3 rounded-lg"
              />

              <input
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="border p-3 rounded-lg"
              />

              <input
                name="licenseNumber"
                placeholder="License Number"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className="border p-3 rounded-lg"
              />

              <input
                type="number"
                name="experience"
                placeholder="Experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="border p-3 rounded-lg"
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="border p-3 rounded-lg"
              >
                <option value="Available">
                  Available
                </option>

                <option value="Driving">
                  Driving
                </option>

                <option value="On Leave">
                  On Leave
                </option>

              </select>

              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
                className="border p-3 rounded-lg col-span-2"
                rows={3}
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={handleAddDriver}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Save Driver
              </button>

            </div>

          </div>

        </div>
      )}
      {/* ================= View Driver Modal ================= */}

      {showViewModal && selectedDriver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">

            <h2 className="text-2xl font-bold mb-5">
              Driver Details
            </h2>

            <div className="space-y-3">

              <p>
                <strong>Name:</strong> {selectedDriver.fullName}
              </p>

              <p>
                <strong>Email:</strong> {selectedDriver.email}
              </p>

              <p>
                <strong>Phone:</strong> {selectedDriver.phoneNumber}
              </p>

              <p>
                <strong>License:</strong> {selectedDriver.licenseNumber}
              </p>

              <p>
                <strong>Experience:</strong> {selectedDriver.experience} Years
              </p>

              <p>
                <strong>Status:</strong> {selectedDriver.status}
              </p>

              <p>
                <strong>Address:</strong> {selectedDriver.address}
              </p>

            </div>

            <div className="flex justify-end mt-6">

              <button
                onClick={() => setShowViewModal(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ================= Edit Driver Modal ================= */}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl w-full max-w-2xl p-6">

            <h2 className="text-2xl font-bold mb-6">
              Edit Driver
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="border p-3 rounded-lg"
              />

              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border p-3 rounded-lg"
              />

              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="border p-3 rounded-lg"
              />

              <input
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className="border p-3 rounded-lg"
              />

              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="border p-3 rounded-lg"
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="border p-3 rounded-lg"
              >
                <option>Available</option>
                <option>On Trip</option>
                <option>Inactive</option>
              </select>

              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
                className="border rounded-lg p-3 col-span-2"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setShowEditModal(false)}
                className="border px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                className="bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                Update Driver
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================= Delete Modal ================= */}

      {showDeleteModal && selectedDriver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">
              Delete Driver
            </h2>

            <p className="text-gray-600">
              Are you sure you want to delete
              <span className="font-semibold">
                {" "}
                {selectedDriver.fullName}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="border px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                className="bg-red-600 text-white px-6 py-2 rounded-lg"
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

export default Drivers;