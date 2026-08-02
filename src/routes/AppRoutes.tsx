import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  lazy,
  Suspense,
} from "react";


import {
  useSelector,
} from "react-redux";


import type {
  RootState,
} from "../store/store";


import MainLayout from "../layouts/MainLayout";

import ProtectedRoute from "./ProtectedRoute";



// ================= AUTH =================


const Login =
lazy(
  () => import("../pages/Login/Login")
);


const Register =
lazy(
  () => import("../pages/Register/Register")
);



// ================= PAGES =================


const Dashboard =
lazy(
  () => import("../pages/Dashboard/Dashboard")
);


const Vehicles =
lazy(
  () => import("../pages/Vehicles/Vehicles")
);


const Drivers =
lazy(
  () => import("../pages/Drivers/Drivers")
);


const LiveTracking =
lazy(
  () => import("../pages/LiveTracking/LiveTracking")
);


const Geofence =
lazy(
  () => import("../pages/Geofence/Geofence")
);


const Reports =
lazy(
  () => import("../pages/Reports/Reports")
);


const Analytics =
lazy(
  () => import("../pages/Analytics/Analytics")
);


const Alerts =
lazy(
  () => import("../pages/Alerts/Alerts")
);


const Users =
lazy(
  () => import("../pages/Users/Users")
);


const Settings =
lazy(
  () => import("../pages/Settings/Settings")
);






const AppRoutes = () => {



  const {
    token
  } =
  useSelector(
    (state: RootState) =>
      state.auth
  );



  const authenticated =
    Boolean(
      token ||
      localStorage.getItem("token")
    );





  return (


    <BrowserRouter>


      <Suspense


        fallback={


          <div
            className="
            h-screen
            flex
            items-center
            justify-center
            bg-gray-100
            "
          >


            <h2
              className="
              text-xl
              font-semibold
              animate-pulse
              "
            >

              Loading FleetDash...

            </h2>


          </div>


        }


      >



        <Routes>



          {/* ================= ROOT ================= */}


          <Route

            path="/"

            element={

              authenticated

              ?

              <Navigate
                to="/dashboard"
                replace
              />

              :

              <Navigate
                to="/login"
                replace
              />

            }

          />






          {/* ================= PUBLIC ================= */}



          <Route

            path="/login"

            element={

              authenticated

              ?

              <Navigate
                to="/dashboard"
                replace
              />

              :

              <Login />

            }

          />





          <Route

            path="/register"

            element={

              authenticated

              ?

              <Navigate
                to="/dashboard"
                replace
              />

              :

              <Register />

            }

          />







          {/* ================= PROTECTED ================= */}



          <Route

            element={
              <ProtectedRoute />
            }

          >


            <Route

              element={
                <MainLayout />
              }

            >




              <Route

                path="/dashboard"

                element={
                  <Dashboard />
                }

              />





              <Route

                path="/vehicles"

                element={
                  <Vehicles />
                }

              />





              <Route

                path="/drivers"

                element={
                  <Drivers />
                }

              />





              <Route

                path="/tracking"

                element={
                  <LiveTracking />
                }

              />





              <Route

                path="/geofence"

                element={
                  <Geofence />
                }

              />





              <Route

                path="/reports"

                element={
                  <Reports />
                }

              />





              <Route

                path="/analytics"

                element={
                  <Analytics />
                }

              />





              <Route

                path="/alerts"

                element={
                  <Alerts />
                }

              />





              <Route

                path="/users"

                element={
                  <Users />
                }

              />





              <Route

                path="/settings"

                element={
                  <Settings />
                }

              />





            </Route>


          </Route>







          {/* ================= 404 ================= */}



          <Route

            path="*"

            element={



              <div

                className="
                h-screen
                flex
                items-center
                justify-center
                bg-gray-100
                "

              >


                <div

                  className="
                  text-center
                  "

                >



                  <h1

                    className="
                    text-7xl
                    font-bold
                    text-red-600
                    "

                  >

                    404

                  </h1>




                  <p

                    className="
                    text-gray-600
                    text-xl
                    mt-4
                    "

                  >

                    Page Not Found

                  </p>





                  <button


                    onClick={() =>
                      window.location.href =
                      "/dashboard"
                    }


                    className="
                    mt-6
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    px-5
                    py-2
                    rounded-lg
                    "

                  >

                    Dashboard


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