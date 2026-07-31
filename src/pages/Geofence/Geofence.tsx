import { useEffect, useState } from "react";
import { FiMapPin, FiPlus, FiRefreshCw } from "react-icons/fi";

import { api } from "../../services/api";
import AddGeofenceModal from "../../components/geofence/AddGeofenceModal";

interface Geofence {
  _id: string;
  name: string;
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number;
}

const Geofence = () => {
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const fetchGeofences = async () => {
    try {
      setLoading(true);

      const response = await api.get("/geofences");

      console.log("========== GEOFENCE RESPONSE ==========");
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.log("======================================");

      let data: Geofence[] = [];

      if (response.data?.geofences) {
        data = response.data.geofences;
      } else if (response.data?.data) {
        data = response.data.data;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }

      console.log("Geofence Array:", data);

      setGeofences(data);
    } catch (error: any) {
      console.error("========== API ERROR ==========");
      console.error(error);
      console.error(error.response?.status);
      console.error(error.response?.data);
      console.error("===============================");

      setGeofences([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeofences();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Geofence Management
          </h1>

          <p className="text-gray-500">
            Manage your geofences
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchGeofences}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiRefreshCw />
            Refresh
          </button>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiPlus />
            Add Geofence
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FiMapPin />
            Geofence List ({geofences.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            Loading geofences...
          </div>
        ) : geofences.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No geofences found.
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Latitude</th>
                <th className="p-3 text-left">Longitude</th>
                <th className="p-3 text-left">Radius (m)</th>
              </tr>
            </thead>

            <tbody>
              {geofences.map((geofence) => (
                <tr
                  key={geofence._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3 font-medium">
                    {geofence.name}
                  </td>

                  <td className="p-3">
                    {geofence.center?.latitude}
                  </td>

                  <td className="p-3">
                    {geofence.center?.longitude}
                  </td>

                  <td className="p-3">
                    {geofence.radius}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AddGeofenceModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          fetchGeofences();
        }}
      />
    </div>
  );
};

export default Geofence;