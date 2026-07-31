import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layout
import MainLayout from "../layouts/MainLayout";

// Protection
import ProtectedRoute from "./ProtectedRoute";

// Auth Pages
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

// Main Pages
import Dashboard from "../pages/Dashboard/Dashboard";
import Vehicles from "../pages/Vehicles/Vehicles";
import Drivers from "../pages/Drivers/Drivers";
import LiveTracking from "../pages/LiveTracking/LiveTracking";
import Geofence from "../pages/Geofence/Geofence";
import Reports from "../pages/Reports/Reports";
import Analytics from "../pages/Analytics/Analytics";
import Alerts from "../pages/Alerts/Alerts";
import Users from "../pages/Users/Users";
import Settings from "../pages/Settings/Settings";

const AppRoutes = () => {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Root */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public Routes */}
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/register"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/tracking" element={<LiveTracking />} />
            <Route path="/geofence" element={<Geofence />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen bg-gray-100">
              <div className="text-center">
                <h1 className="text-7xl font-bold text-red-600">404</h1>
                <p className="mt-4 text-xl text-gray-600">
                  Page Not Found
                </p>

                <button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;