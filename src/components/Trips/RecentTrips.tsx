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
      const response = await api.get("/trips");

      console.log("Trips:", response.data);

      if (response.data.success) {
        setTrips(response.data.trips);
      }
    } catch (error) {
      console.error("Trip Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        Loading trips...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">Recent Trips</h2>

        <span className="text-sm text-gray-500">
          Latest 5 Trips
        </span>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No recent trips available
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Trip ID</th>
                <th className="p-3 text-left">Vehicle</th>
                <th className="p-3 text-left">Driver</th>
                <th className="p-3 text-left">Route</th>
                <th className="p-3 text-left">Distance</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {trips.slice(0, 5).map((trip) => (
                <tr
                  key={trip._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">{trip.tripId}</td>

                  <td className="p-3">
                    {trip.vehicle?.vehicleNumber || "N/A"}
                  </td>

                  <td className="p-3">
                    {trip.driver?.fullName || "N/A"}
                  </td>

                  <td className="p-3">
                    {trip.startLocation} → {trip.endLocation}
                  </td>

                  <td className="p-3">
                    {trip.distance} km
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        trip.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : trip.status === "Ongoing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentTrips;