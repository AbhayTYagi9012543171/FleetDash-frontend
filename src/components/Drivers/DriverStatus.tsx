import { useEffect, useState } from "react";
import { api } from "../../services/api";

interface Driver {
  _id: string;
  fullName?: string;
  name?: string;
  phoneNumber?: string;
  status?: string;
}

const DriverStatus = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDrivers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/drivers");

      if (response.data.success) {
        setDrivers(
          response.data.drivers ||
            response.data.data ||
            []
        );

        setError("");
      } else {
        setDrivers([]);
      }
    } catch (error) {
      console.error(error);
      setDrivers([]);
      setError("Unable to load drivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const getStatusColor = (status = "") => {
    switch (status) {
      case "Driving":
      case "Active":
        return "bg-green-100 text-green-700";

      case "Idle":
        return "bg-yellow-100 text-yellow-700";

      case "Offline":
      case "Inactive":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">

        <h2 className="text-lg sm:text-xl font-semibold">
          Driver Status
        </h2>

        <button
          onClick={fetchDrivers}
          className="
            w-full
            sm:w-auto
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-4
            py-2
            rounded-lg
            text-sm
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

      <div className="space-y-4">

        {loading ? (
          <p className="text-gray-500">
            Loading drivers...
          </p>
        ) : drivers.length === 0 ? (
          <p className="text-gray-500">
            No drivers found
          </p>
        ) : (
          drivers.slice(0, 5).map((driver) => (
            <div
              key={driver._id}
              className="
                border-b
                pb-4
                flex
                flex-col
                sm:flex-row
                justify-between
                items-start
                sm:items-center
                gap-3
              "
            >
              <div className="min-w-0 flex-1">

                <p className="font-semibold text-gray-800 break-words">
                  {driver.fullName ||
                    driver.name ||
                    "Unknown Driver"}
                </p>

                <p className="text-sm text-gray-500 break-all">
                  {driver.phoneNumber ||
                    "No phone"}
                </p>

              </div>

              <span
                className={`
                  self-start
                  sm:self-center
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  sm:text-sm
                  font-medium
                  whitespace-nowrap
                  ${getStatusColor(driver.status)}
                `}
              >
                {driver.status || "Unknown"}
              </span>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default DriverStatus;