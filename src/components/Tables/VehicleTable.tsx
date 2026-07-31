import { useEffect, useState } from "react";
import { api } from "../../services/api";

interface Driver {
  fullName?: string;
}

interface Vehicle {
  _id: string;
  vehicleNumber: string;
  driver?: Driver | string;
  speed: number;
  fuel: number;
  status: string;
}

const VehicleTable = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVehicles = async () => {
    try {
      setLoading(true);

      const response = await api.get("/vehicles");

      if (response.data.success) {
        setVehicles(response.data.vehicles || []);
      } else {
        setVehicles([]);
      }

      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";

      case "Idle":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">

      {/* Header */}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">

        <h2 className="text-xl font-semibold">
          Vehicle List
        </h2>

        <button
          onClick={fetchVehicles}
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

      {error && (
        <p className="text-red-500 mb-4">
          {error}
        </p>
      )}

      {/* Desktop Table */}

      <div className="hidden md:block overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="px-4 py-3 text-left">Vehicle</th>
              <th className="px-4 py-3 text-left">Driver</th>
              <th className="px-4 py-3 text-left">Speed</th>
              <th className="px-4 py-3 text-left">Fuel</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8"
                >
                  Loading Vehicles...
                </td>
              </tr>

            ) : vehicles.length === 0 ? (

              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  No Vehicles Found
                </td>
              </tr>

            ) : (

              vehicles.map((vehicle) => (

                <tr
                  key={vehicle._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-4 font-semibold">
                    {vehicle.vehicleNumber}
                  </td>

                  <td className="px-4 py-4">
                    {typeof vehicle.driver === "object"
                      ? vehicle.driver?.fullName || "N/A"
                      : vehicle.driver || "N/A"}
                  </td>

                  <td className="px-4 py-4">
                    {vehicle.speed} km/h
                  </td>

                  <td className="px-4 py-4">
                    {vehicle.fuel}%
                  </td>

                  <td className="px-4 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(
                        vehicle.status
                      )}`}
                    >
                      {vehicle.status}
                    </span>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Mobile Cards */}

      <div className="md:hidden space-y-4">

        {loading ? (

          <p className="text-center py-6">
            Loading Vehicles...
          </p>

        ) : vehicles.length === 0 ? (

          <p className="text-center py-6 text-gray-500">
            No Vehicles Found
          </p>

        ) : (

          vehicles.map((vehicle) => (

            <div
              key={vehicle._id}
              className="border rounded-xl p-4 shadow-sm"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h3 className="font-semibold text-lg">
                    {vehicle.vehicleNumber}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Driver:{" "}
                    {typeof vehicle.driver === "object"
                      ? vehicle.driver?.fullName || "N/A"
                      : vehicle.driver || "N/A"}
                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                    vehicle.status
                  )}`}
                >
                  {vehicle.status}
                </span>

              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-sm">

                <div>
                  <p className="text-gray-500">Speed</p>
                  <p className="font-medium">
                    {vehicle.speed} km/h
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Fuel</p>
                  <p className="font-medium">
                    {vehicle.fuel}%
                  </p>
                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
};

export default VehicleTable;