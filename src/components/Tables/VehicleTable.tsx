import { useEffect, useState } from "react";
import { FaSearch, FaSyncAlt } from "react-icons/fa";
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
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredVehicles = vehicles.filter((vehicle) => {
    const search = searchTerm.toLowerCase();

    const driverName =
      typeof vehicle.driver === "object"
        ? vehicle.driver?.fullName || ""
        : vehicle.driver || "";

    return (
      vehicle.vehicleNumber.toLowerCase().includes(search) ||
      driverName.toLowerCase().includes(search) ||
      vehicle.status.toLowerCase().includes(search)
    );
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 mb-6">

        <div>

          <h2 className="text-2xl font-bold text-gray-800">
            🚚 Vehicle List
          </h2>

          <p className="text-gray-500 mt-1">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </p>

        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

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
              placeholder="Search vehicle, driver, status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full
                sm:w-80
                pl-10
                pr-4
                py-2.5
                border
                rounded-xl
                focus:ring-2
                focus:ring-blue-500
                outline-none
              "
            />

          </div>

          <button
            onClick={fetchVehicles}
            className="
              flex
              items-center
              justify-center
              gap-2
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5
              py-2.5
              rounded-xl
              transition
            "
          >
            <FaSyncAlt />
            Refresh
          </button>

        </div>

      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-100 text-red-700 p-3">
          {error}
        </div>
      )}

      {/* Desktop Table */}

      <div className="hidden md:block overflow-x-auto rounded-xl border">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-5 py-4 text-left font-semibold">
                Vehicle
              </th>

              <th className="px-5 py-4 text-left font-semibold">
                Driver
              </th>

              <th className="px-5 py-4 text-left font-semibold">
                Speed
              </th>

              <th className="px-5 py-4 text-left font-semibold">
                Fuel
              </th>

              <th className="px-5 py-4 text-left font-semibold">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan={5}
                  className="text-center py-10 text-gray-500"
                >
                  Loading Vehicles...
                </td>

              </tr>

            ) : filteredVehicles.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="text-center py-10 text-gray-500"
                >
                  🚚 No Vehicles Found
                </td>

              </tr>

            ) : (

              filteredVehicles.map((vehicle) => (

                <tr
                  key={vehicle._id}
                  className="border-t hover:bg-blue-50 transition"
                >

                  <td className="px-5 py-4 font-semibold">
                    {vehicle.vehicleNumber}
                  </td>

                  <td className="px-5 py-4">

                    {typeof vehicle.driver === "object"
                      ? vehicle.driver?.fullName || "N/A"
                      : vehicle.driver || "N/A"}

                  </td>

                  <td className="px-5 py-4">
                    {vehicle.speed} km/h
                  </td>

                  <td className="px-5 py-4">
                    {vehicle.fuel}%
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-medium
                        ${statusColor(vehicle.status)}
                      `}
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

      <div className="md:hidden space-y-4 mt-6">

  {loading ? (

    <div className="text-center py-8 text-gray-500">
      Loading Vehicles...
    </div>

  ) : filteredVehicles.length === 0 ? (

    <div className="bg-gray-50 border rounded-xl p-8 text-center">

      <div className="text-5xl mb-3">
        🚚
      </div>

      <h3 className="text-lg font-semibold text-gray-700">
        No Vehicles Found
      </h3>

      <p className="text-gray-500 mt-2">
        Try a different search or refresh the list.
      </p>

    </div>

  ) : (

    filteredVehicles.map((vehicle) => (

      <div
        key={vehicle._id}
        className="
          bg-white
          border
          rounded-2xl
          shadow-sm
          hover:shadow-md
          transition
          p-5
        "
      >

        <div className="flex justify-between items-start">

          <div>

            <h3 className="text-lg font-bold text-gray-800">
              {vehicle.vehicleNumber}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Driver:{" "}
              {typeof vehicle.driver === "object"
                ? vehicle.driver?.fullName || "N/A"
                : vehicle.driver || "N/A"}
            </p>

          </div>

          <span
            className={`
              px-3
              py-1
              rounded-full
              text-xs
              font-semibold
              ${statusColor(vehicle.status)}
            `}
          >
            {vehicle.status}
          </span>

        </div>

        <div className="grid grid-cols-2 gap-4 mt-5">

          <div className="bg-gray-50 rounded-lg p-3">

            <p className="text-xs text-gray-500 uppercase">
              Speed
            </p>

            <p className="text-lg font-semibold mt-1">
              {vehicle.speed} km/h
            </p>

          </div>

          <div className="bg-gray-50 rounded-lg p-3">

            <p className="text-xs text-gray-500 uppercase">
              Fuel
            </p>

            <p className="text-lg font-semibold mt-1">
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