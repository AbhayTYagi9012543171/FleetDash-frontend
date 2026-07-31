import { useEffect, useState } from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { api } from "../../services/api";

interface Alert {
  _id: string;
  alertType: string;
  severity: string;
  message: string;
  location: string;
  status: string;
  createdAt: string;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/alerts");

      console.log("Alerts API:", response.data);

      if (response.data.success) {
        setAlerts(response.data.alerts);
      } else if (Array.isArray(response.data)) {
        setAlerts(response.data);
      } else {
        setAlerts([]);
      }
    } catch (error) {
      console.error("Alerts API Error:", error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Alerts
          </h1>
          <p className="text-gray-500">
            Fleet alerts and notifications
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiRefreshCw />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FiAlertTriangle />
            Alert List
          </h2>
        </div>

        {loading ? (
          <p className="p-4">Loading...</p>
        ) : alerts.length === 0 ? (
          <p className="p-4 text-gray-500">
            No alerts found.
          </p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Severity</th>
                <th className="text-left p-3">Message</th>
                <th className="text-left p-3">Location</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Time</th>
              </tr>
            </thead>

            <tbody>
              {alerts.map((alert) => (
                <tr key={alert._id} className="border-t">
                  <td className="p-3">{alert.alertType}</td>
                  <td className="p-3">{alert.severity}</td>
                  <td className="p-3">{alert.message}</td>
                  <td className="p-3">{alert.location}</td>
                  <td className="p-3">{alert.status}</td>
                  <td className="p-3">
                    {new Date(alert.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Alerts;