import React, { useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaSyncAlt,
  FaFileExport,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { api } from "../../services/api";

interface Trip {
  _id: string;
  tripId: string;

  vehicle?: {
    vehicleNumber: string;
  };

  driver?: {
    fullName: string;
  };

  startLocation: string;
  endLocation: string;
  distance: number;
  status: string;
}

const RecentTrips: React.FC = () => {

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {

    try {

      setLoading(true);

      const response = await api.get("/trips");

      if (response.data.success) {

        setTrips(response.data.trips || []);

      } else {

        setTrips([]);

      }

    } catch (error) {

      console.error(error);

      setTrips([]);

    } finally {

      setLoading(false);

    }

  };

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

    return trips.filter((trip) => {

      const vehicle =
        trip.vehicle?.vehicleNumber.toLowerCase() || "";

      const driver =
        trip.driver?.fullName.toLowerCase() || "";

      const tripId =
        trip.tripId.toLowerCase();

      const route =
        `${trip.startLocation} ${trip.endLocation}`.toLowerCase();

      const matchesSearch =

        vehicle.includes(searchTerm.toLowerCase()) ||

        driver.includes(searchTerm.toLowerCase()) ||

        tripId.includes(searchTerm.toLowerCase()) ||

        route.includes(searchTerm.toLowerCase());

      const matchesStatus =

        statusFilter === "All" ||

        trip.status === statusFilter;

      return matchesSearch && matchesStatus;

    });

  }, [trips, searchTerm, statusFilter]);

  const totalPages = Math.ceil(
    filteredTrips.length / itemsPerPage
  );

  const paginatedTrips = filteredTrips.slice(

    (currentPage - 1) * itemsPerPage,

    currentPage * itemsPerPage

  );
    return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            Recent Trips
          </h2>

          <p className="text-gray-500 mt-1">
            Showing {filteredTrips.length} trip(s)
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

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
              placeholder="Search trip..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="
                pl-10
                pr-4
                py-2
                border
                rounded-lg
                focus:ring-2
                focus:ring-blue-500
                outline-none
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
              border
              rounded-lg
              px-4
              py-2
              focus:ring-2
              focus:ring-blue-500
              outline-none
            "
          >

            <option>All</option>
            <option>Completed</option>
            <option>Ongoing</option>
            <option>Pending</option>

          </select>

          {/* Export */}

          <button
            className="
              flex
              items-center
              gap-2
              bg-green-600
              hover:bg-green-700
              text-white
              px-4
              py-2
              rounded-lg
              transition
            "
          >

            <FaFileExport />

            Export

          </button>

          {/* Refresh */}

          <button
            onClick={fetchTrips}
            className="
              flex
              items-center
              gap-2
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-4
              py-2
              rounded-lg
              transition
            "
          >

            <FaSyncAlt />

            Refresh

          </button>

        </div>

      </div>

      {/* Loading */}

      {loading && (

        <div className="py-12 text-center text-gray-500">

          Loading trips...

        </div>

      )}

      {/* Empty */}

      {!loading && filteredTrips.length === 0 && (

        <div className="py-12 text-center text-gray-500">

          No trips found.

        </div>

      )}

      {/* Desktop Table */}

      {!loading && filteredTrips.length > 0 && (

        <>

          <div className="hidden lg:block overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="px-4 py-3 text-left">Trip ID</th>

                  <th className="px-4 py-3 text-left">Vehicle</th>

                  <th className="px-4 py-3 text-left">Driver</th>

                  <th className="px-4 py-3 text-left">Route</th>

                  <th className="px-4 py-3 text-left">Distance</th>

                  <th className="px-4 py-3 text-left">Status</th>

                  <th className="px-4 py-3 text-center">Actions</th>

                </tr>

              </thead>

              <tbody>

                {paginatedTrips.map((trip) => (

                  <tr
                    key={trip._id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="px-4 py-4 font-semibold">

                      {trip.tripId}

                    </td>

                    <td className="px-4 py-4">

                      {trip.vehicle?.vehicleNumber || "N/A"}

                    </td>

                    <td className="px-4 py-4">

                      {trip.driver?.fullName || "N/A"}

                    </td>

                    <td className="px-4 py-4">

                      {trip.startLocation} → {trip.endLocation}

                    </td>

                    <td className="px-4 py-4">

                      {trip.distance} km

                    </td>

                    <td className="px-4 py-4">

                      <span
                        className={`
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          font-medium
                          ${getStatusColor(trip.status)}
                        `}
                      >

                        {trip.status}

                      </span>

                    </td>

                    <td className="px-4 py-4">

                      <div className="flex justify-center gap-2">

                        <button className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200">

                          <FaEye />

                        </button>

                        <button className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200">

                          <FaEdit />

                        </button>

                        <button className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200">

                          <FaTrash />

                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
                    {/* Mobile Cards */}

          <div className="lg:hidden space-y-4 mt-4">

            {paginatedTrips.map((trip) => (

              <div
                key={trip._id}
                className="
                  border
                  border-gray-200
                  rounded-xl
                  p-4
                  shadow-sm
                  hover:shadow-md
                  transition
                "
              >

                <div className="flex justify-between items-start">

                  <div>

                    <h3 className="font-bold text-lg">
                      {trip.tripId}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      {trip.vehicle?.vehicleNumber || "N/A"}
                    </p>

                  </div>

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-semibold
                      ${getStatusColor(trip.status)}
                    `}
                  >
                    {trip.status}
                  </span>

                </div>

                <div className="mt-4 space-y-2 text-sm">

                  <p>
                    <strong>Driver:</strong>{" "}
                    {trip.driver?.fullName || "N/A"}
                  </p>

                  <p>
                    <strong>Route:</strong>{" "}
                    {trip.startLocation} → {trip.endLocation}
                  </p>

                  <p>
                    <strong>Distance:</strong>{" "}
                    {trip.distance} km
                  </p>

                </div>

                <div className="flex justify-end gap-2 mt-5">

                  <button
                    className="
                      p-2
                      rounded-lg
                      bg-blue-100
                      text-blue-600
                      hover:bg-blue-200
                    "
                  >
                    <FaEye />
                  </button>

                  <button
                    className="
                      p-2
                      rounded-lg
                      bg-yellow-100
                      text-yellow-600
                      hover:bg-yellow-200
                    "
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="
                      p-2
                      rounded-lg
                      bg-red-100
                      text-red-600
                      hover:bg-red-200
                    "
                  >
                    <FaTrash />
                  </button>

                </div>

              </div>

            ))}

          </div>

          {/* Pagination */}

          <div
            className="
              mt-6
              flex
              items-center
              justify-between
              flex-wrap
              gap-4
            "
          >

            <p className="text-sm text-gray-500">

              Page {currentPage} of {totalPages || 1}

            </p>

            <div className="flex gap-3">

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => prev - 1)
                }
                className="
                  px-4
                  py-2
                  rounded-lg
                  border
                  disabled:opacity-50
                  hover:bg-gray-100
                "
              >
                Previous
              </button>

              <button
                disabled={
                  currentPage === totalPages ||
                  totalPages === 0
                }
                onClick={() =>
                  setCurrentPage((prev) => prev + 1)
                }
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-blue-600
                  text-white
                  disabled:opacity-50
                  hover:bg-blue-700
                "
              >
                Next
              </button>

            </div>

          </div>

        </>

      )}

    </div>

  );

};

export default RecentTrips;