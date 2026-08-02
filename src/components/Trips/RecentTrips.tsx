import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaSearch,
  FaSyncAlt,
  FaFileExport,
  FaEye,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaTruck,
  FaUser,
} from "react-icons/fa";

import { api } from "../../services/api";

interface Trip {
  _id: string;
  tripId: string;

  vehicle?: {
    _id?: string;
    vehicleNumber: string;
  };

  driver?: {
    _id?: string;
    fullName: string;
  };

  startLocation: string;
  endLocation: string;
  distance: number;
  status: "Completed" | "Ongoing" | "Pending";
}

const ITEMS_PER_PAGE = 5;

const RecentTrips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedTrip, setSelectedTrip] =
    useState<Trip | null>(null);

  const [showViewModal, setShowViewModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const fetchTrips = useCallback(async () => {
    try {
      if (trips.length === 0) {
        setLoading(true);
      }

      setRefreshing(true);

      const response = await api.get<{
        success: boolean;
        trips: Trip[];
      }>("/trips");

      if (response.data.success) {
        setTrips(response.data.trips ?? []);
      } else {
        setTrips([]);
      }
    } catch (error) {
      console.error(error);
      setTrips([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [trips.length]);

  useEffect(() => {
    void fetchTrips();
  }, [fetchTrips]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "Ongoing":
        return "bg-blue-100 text-blue-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-red-100 text-red-700";
    }
  };

  const filteredTrips = useMemo(() => {
    return trips
      .filter((trip) => {
        const keyword =
          searchTerm.toLowerCase();

        const vehicle =
          trip.vehicle?.vehicleNumber?.toLowerCase() ??
          "";

        const driver =
          trip.driver?.fullName?.toLowerCase() ??
          "";

        const route =
          `${trip.startLocation} ${trip.endLocation}`.toLowerCase();

        const tripId =
          trip.tripId.toLowerCase();

        const matchesSearch =
          vehicle.includes(keyword) ||
          driver.includes(keyword) ||
          route.includes(keyword) ||
          tripId.includes(keyword);

        const matchesStatus =
          statusFilter === "All" ||
          trip.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) =>
        b.tripId.localeCompare(
          a.tripId,
          undefined,
          {
            numeric: true,
            sensitivity: "base",
          }
        )
      );
  }, [trips, searchTerm, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTrips.length /
        ITEMS_PER_PAGE
    )
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedTrips =
    filteredTrips.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,
      currentPage *
        ITEMS_PER_PAGE
    );

  const exportCSV = () => {
    if (!filteredTrips.length) return;

    const rows = filteredTrips.map((trip) => ({
      TripID: trip.tripId,
      Vehicle:
        trip.vehicle?.vehicleNumber ?? "N/A",
      Driver:
        trip.driver?.fullName ?? "N/A",
      Start: trip.startLocation,
      End: trip.endLocation,
      Distance: `${trip.distance} km`,
      Status: trip.status,
    }));

    const csv = [
      Object.keys(rows[0]).join(","),
      ...rows.map((row) =>
        Object.values(row)
          .map(
            (value) =>
              `"${String(value).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = "Trips.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-lg
        border
        border-gray-200
        p-6
      "
    >
            {/* ================= Header ================= */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-5
          mb-8
        "
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Recent Trips
          </h2>

          <p className="text-gray-500 mt-1">
            Showing{" "}
            <span className="font-semibold text-blue-600">
              {filteredTrips.length}
            </span>{" "}
            trip(s)
          </p>
        </div>

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
          "
        >
          {/* Search */}

          <div className="relative">

            <FaSearch
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="
                w-full
                sm:w-64
                pl-10
                pr-4
                py-2.5
                border
                border-gray-300
                rounded-lg
                outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-blue-500
                transition
              "
            />

          </div>

          {/* Status Filter */}

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="
              px-4
              py-2.5
              border
              border-gray-300
              rounded-lg
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >
            <option value="All">
              All
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Ongoing">
              Ongoing
            </option>

            <option value="Pending">
              Pending
            </option>
          </select>

          {/* Export */}

          <button
            onClick={exportCSV}
            disabled={!filteredTrips.length}
            className="
              flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-lg
              bg-green-600
              hover:bg-green-700
              text-white
              disabled:bg-green-300
              disabled:cursor-not-allowed
              transition-all
              duration-200
              hover:scale-105
              active:scale-95
            "
          >
            <FaFileExport />
            Export
          </button>

          {/* Refresh */}

          <button
            onClick={() => void fetchTrips()}
            disabled={refreshing}
            className="
              flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-lg
              bg-blue-600
              hover:bg-blue-700
              text-white
              disabled:bg-blue-300
              disabled:cursor-not-allowed
              transition-all
              duration-200
              hover:scale-105
              active:scale-95
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
      </div>

      {/* ================= Loading ================= */}

      {loading && (
        <div className="space-y-4">

          {Array.from({
            length: 5,
          }).map((_, index) => (

            <div
              key={index}
              className="
                h-20
                rounded-xl
                bg-gray-100
                animate-pulse
              "
            />

          ))}

        </div>
      )}

      {/* ================= Empty State ================= */}

      {!loading &&
        filteredTrips.length === 0 && (

          <div
            className="
              py-20
              flex
              flex-col
              items-center
              justify-center
              text-center
            "
          >

            <div className="text-6xl mb-5">
              🚚
            </div>

            <h3
              className="
                text-2xl
                font-bold
                text-slate-700
              "
            >
              No Trips Found
            </h3>

            <p
              className="
                mt-3
                text-gray-500
              "
            >
              Try changing your search,
              filter or add a new trip.
            </p>

          </div>

      )}

      {/* ================= Trips ================= */}

      {!loading &&
        filteredTrips.length > 0 && (
        <>{/* ================= Desktop Table ================= */}

<div
  className="
    hidden
    lg:block
    overflow-x-auto
    rounded-2xl
    border
    border-gray-200
    shadow-sm
  "
>
  <table className="min-w-full">

    <thead className="bg-slate-100">

      <tr>

        <th className="px-4 py-4 text-left font-semibold">
          #
        </th>

        <th className="px-4 py-4 text-left font-semibold">
          Trip ID
        </th>

        <th className="px-4 py-4 text-left font-semibold">
          Vehicle
        </th>

        <th className="px-4 py-4 text-left font-semibold">
          Driver
        </th>

        <th className="px-4 py-4 text-left font-semibold">
          Route
        </th>

        <th className="px-4 py-4 text-left font-semibold">
          Distance
        </th>

        <th className="px-4 py-4 text-left font-semibold">
          Status
        </th>

        <th className="px-4 py-4 text-center font-semibold">
          Actions
        </th>

      </tr>

    </thead>

    <tbody>

      {paginatedTrips.map((trip, index) => (

        <tr
          key={trip._id}
          className="
            border-t
            hover:bg-blue-50
            hover:shadow-sm
            transition-all
            duration-200
          "
        >

          <td className="px-4 py-4 font-semibold">
            {(currentPage - 1) *
              ITEMS_PER_PAGE +
              index +
              1}
          </td>

          <td className="px-4 py-4 font-semibold text-blue-700">
            {trip.tripId}
          </td>

          <td className="px-4 py-4">

            <div className="flex items-center gap-2">

              <FaTruck className="text-blue-600" />

              <span>
                {trip.vehicle?.vehicleNumber ??
                  "N/A"}
              </span>

            </div>

          </td>

          <td className="px-4 py-4">

            <div className="flex items-center gap-2">

              <FaUser className="text-green-600" />

              <span>
                {trip.driver?.fullName ??
                  "N/A"}
              </span>

            </div>

          </td>

          <td className="px-4 py-4">

            <div className="flex items-center gap-2">

              <FaMapMarkerAlt className="text-red-500" />

              <span>
                {trip.startLocation}
                {" → "}
                {trip.endLocation}
              </span>

            </div>

          </td>

          <td className="px-4 py-4 font-semibold">
            {trip.distance} km
          </td>

          <td className="px-4 py-4">

            <span
              className={`
                inline-flex
                items-center
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
                whitespace-nowrap
                ${getStatusColor(trip.status)}
              `}
            >
              ● {trip.status}
            </span>

          </td>

          <td className="px-4 py-4">

            <div className="flex justify-center gap-2">

              {/* View */}

              <button
                title="View Trip"
                onClick={() => {
                  setSelectedTrip(trip);
                  setShowViewModal(true);
                }}
                className="
                  p-2
                  rounded-lg
                  bg-blue-100
                  text-blue-600
                  hover:bg-blue-200
                  transition-all
                  duration-200
                  hover:scale-110
                  active:scale-95
                "
              >
                <FaEye />
              </button>

              {/* Edit */}

              <button
                title="Edit Trip"
                onClick={() => {
                  setSelectedTrip(trip);
                  setShowEditModal(true);
                }}
                className="
                  p-2
                  rounded-lg
                  bg-yellow-100
                  text-yellow-600
                  hover:bg-yellow-200
                  transition-all
                  duration-200
                  hover:scale-110
                  active:scale-95
                "
              >
                <FaEdit />
              </button>

              {/* Delete */}

              <button
                title="Delete Trip"
                onClick={() => {
                  setSelectedTrip(trip);
                  setShowDeleteModal(true);
                }}
                className="
                  p-2
                  rounded-lg
                  bg-red-100
                  text-red-600
                  hover:bg-red-200
                  transition-all
                  duration-200
                  hover:scale-110
                  active:scale-95
                "
              >
                <FaTrash />
              </button>

            </div>

          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

{/* ================= End Desktop Table ================= */}
            {/* ================= Mobile Cards ================= */}

            <div className="lg:hidden space-y-4 mt-5">
              {paginatedTrips.map((trip) => (
                <div
                  key={trip._id}
                  className="border rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">
                        {trip.tripId}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {trip.vehicle?.vehicleNumber ?? "N/A"}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        trip.status
                      )}`}
                    >
                      {trip.status}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        Driver
                      </span>

                      <span>
                        {trip.driver?.fullName ?? "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium">
                        Distance
                      </span>

                      <span>{trip.distance} km</span>
                    </div>

                    <div>
                      <p className="font-medium mb-1">
                        Route
                      </p>

                      <p>
                        {trip.startLocation} →{" "}
                        {trip.endLocation}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-5">
                    <button
                      onClick={() => {
                        setSelectedTrip(trip);
                        setShowViewModal(true);
                      }}
                      className="p-2 rounded bg-blue-100 text-blue-600"
                    >
                      <FaEye />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTrip(trip);
                        setShowEditModal(true);
                      }}
                      className="p-2 rounded bg-yellow-100 text-yellow-600"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTrip(trip);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 rounded bg-red-100 text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= Pagination ================= */}

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">

              <div className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold">
                  {paginatedTrips.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold">
                  {filteredTrips.length}
                </span>{" "}
                trips
              </div>

              <div className="flex items-center gap-3">

                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.max(prev - 1, 1)
                    )
                  }
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="px-4 py-2 rounded bg-blue-600 text-white">
                  {currentPage}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>

              </div>

            </div>

          </>
           )}

      {/* ================= View Modal ================= */}

      {showViewModal && selectedTrip && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">

            <h2 className="text-xl font-bold mb-5">
              Trip Details
            </h2>

            <div className="space-y-3">
              <p><strong>Trip ID:</strong> {selectedTrip.tripId}</p>

              <p>
                <strong>Vehicle:</strong>{" "}
                {selectedTrip.vehicle?.vehicleNumber ?? "N/A"}
              </p>

              <p>
                <strong>Driver:</strong>{" "}
                {selectedTrip.driver?.fullName ?? "N/A"}
              </p>

              <p>
                <strong>Route:</strong>{" "}
                {selectedTrip.startLocation} → {selectedTrip.endLocation}
              </p>

              <p>
                <strong>Distance:</strong>{" "}
                {selectedTrip.distance} km
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedTrip.status}
              </p>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowViewModal(false)}
                className="bg-blue-600 text-white px-5 py-2 rounded"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= Edit Modal ================= */}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">

            <h2 className="text-xl font-bold">
              Edit Feature
            </h2>

            <p className="mt-4 text-gray-600">
              Edit Trip functionality will be added in the next step.
            </p>

            <button
              onClick={() => setShowEditModal(false)}
              className="mt-6 bg-blue-600 text-white px-5 py-2 rounded"
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* ================= Delete Modal ================= */}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">

            <h2 className="text-xl font-bold text-red-600">
              Delete Trip
            </h2>

            <p className="mt-4">
              Are you sure you want to delete this trip?
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  // Delete API will be added later
                  setShowDeleteModal(false);
                }}
                className="px-5 py-2 bg-red-600 text-white rounded"
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

export default RecentTrips;