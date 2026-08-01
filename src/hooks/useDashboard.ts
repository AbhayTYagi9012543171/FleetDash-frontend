import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

export interface DashboardData {
  totalVehicles: number;
  activeVehicles: number;
  totalDrivers: number;
  totalAlerts: number;
  totalReports: number;
}

const useDashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/dashboard");

      if (response.data.success) {
        setDashboard(response.data.dashboard);
        setError("");
      } else {
        setError("Failed to load dashboard data.");
      }
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(() => {
      fetchDashboard();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchDashboard]);

  return {
    dashboard,
    loading,
    error,
    refreshDashboard: fetchDashboard,
  };
};

export default useDashboard;