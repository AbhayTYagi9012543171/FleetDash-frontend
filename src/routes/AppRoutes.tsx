import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { lazy, Suspense } from "react";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";


// Auth
const Login = lazy(() => import("../pages/Login/Login"));
const Register = lazy(() => import("../pages/Register/Register"));


// Pages
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Vehicles = lazy(() => import("../pages/Vehicles/Vehicles"));
const Drivers = lazy(() => import("../pages/Drivers/Drivers"));
const LiveTracking = lazy(() => import("../pages/LiveTracking/LiveTracking"));
const Geofence = lazy(() => import("../pages/Geofence/Geofence"));
const Reports = lazy(() => import("../pages/Reports/Reports"));
const Analytics = lazy(() => import("../pages/Analytics/Analytics"));
const Alerts = lazy(() => import("../pages/Alerts/Alerts"));
const Users = lazy(() => import("../pages/Users/Users"));
const Settings = lazy(() => import("../pages/Settings/Settings"));



const AppRoutes = () => {

  const token = localStorage.getItem("token");


  return (

    <BrowserRouter>

      <Suspense
        fallback={
          <div className="
          flex
          items-center
          justify-center
          h-screen
          bg-gray-100
          ">
            <h2 className="
            text-xl
            font-semibold
            animate-pulse
            ">
              Loading FleetDash...
            </h2>
          </div>
        }
      >


        <Routes>


          {/* Root */}

          <Route
            path="/"
            element={
              token
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
            }
          />



          {/* Public Routes */}


          <Route
            path="/login"
            element={
              token
              ? <Navigate to="/dashboard" replace />
              : <Login />
            }
          />


          <Route
            path="/register"
            element={
              token
              ? <Navigate to="/dashboard" replace />
              : <Register />
            }
          />



          {/* Protected Routes */}


          <Route element={<ProtectedRoute />}>

            <Route element={<MainLayout />}>

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/vehicles"
                element={<Vehicles />}
              />

              <Route
                path="/drivers"
                element={<Drivers />}
              />

              <Route
                path="/tracking"
                element={<LiveTracking />}
              />

              <Route
                path="/geofence"
                element={<Geofence />}
              />

              <Route
                path="/reports"
                element={<Reports />}
              />

              <Route
                path="/analytics"
                element={<Analytics />}
              />

              <Route
                path="/alerts"
                element={<Alerts />}
              />

              <Route
                path="/users"
                element={<Users />}
              />

              <Route
                path="/settings"
                element={<Settings />}
              />

            </Route>

          </Route>



          {/* 404 */}

          <Route
            path="*"
            element={
              <div className="
              flex
              items-center
              justify-center
              h-screen
              bg-gray-100
              ">

                <div className="text-center">

                  <h1 className="
                  text-7xl
                  font-bold
                  text-red-600
                  ">
                    404
                  </h1>

                  <p className="
                  mt-4
                  text-xl
                  text-gray-600
                  ">
                    Page Not Found
                  </p>


                  <button
                    onClick={() =>
                      window.location.href="/dashboard"
                    }
                    className="
                    mt-6
                    px-5
                    py-2
                    bg-blue-600
                    text-white
                    rounded-lg
                    hover:bg-blue-700
                    "
                  >
                    Go to Dashboard
                  </button>

                </div>

              </div>
            }
          />


        </Routes>


      </Suspense>


    </BrowserRouter>

  );

};


export default AppRoutes;