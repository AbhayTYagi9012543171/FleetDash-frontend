import React, { useEffect, useState } from "react";
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
      console.error("Trip Error:", error);
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

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">

      {/* Header */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">

        <h2 className="text-xl font-semibold">
          Recent Trips
        </h2>

        <button
          onClick={fetchTrips}
          className="
            w-full
            sm:w-auto
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-4
            py-2
            rounded-lg
            transition
          "
        >
          Refresh
        </button>

      </div>

      {/* Loading */}

      {loading && (
        <p className="text-center py-8 text-gray-500">
          Loading trips...
        </p>
      )}

      {/* Empty */}

      {!loading && trips.length === 0 && (
        <p className="text-center py-8 text-gray-500">
          No recent trips available
        </p>
      )}

      {/* Desktop Table */}

      {!loading && trips.length > 0 && (
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
                </tr>

              </thead>

              <tbody>

                {trips.slice(0, 5).map((trip) => (

                  <tr
                    key={trip._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-4 py-4">
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
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          trip.status
                        )}`}
                      >
                        {trip.status}
                      </span>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Mobile Cards */}

          <div className="lg:hidden space-y-4">

            {trips.slice(0, 5).map((trip) => (

              <div
                key={trip._id}
                className="border rounded-xl p-4 shadow-sm"
              >

                <div className="flex justify-between items-start">

                  <div>

                    <h3 className="font-semibold">
                      {trip.tripId}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {trip.vehicle?.vehicleNumber || "N/A"}
                    </p>

                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      trip.status
                    )}`}
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

              </div>

            ))}

          </div>
        </>
      )}
    </div>
  );
};

export default RecentTrips;