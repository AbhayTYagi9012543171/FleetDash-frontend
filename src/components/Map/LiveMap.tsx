import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap,
} from "react-leaflet";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  LatLngExpression,
} from "leaflet";

import type {
  Vehicle,
} from "../../types/vehicle";

import "leaflet/dist/leaflet.css";

import L from "leaflet";


// ======================================================
// LEAFLET ICON FIX
// ======================================================

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});


// ======================================================
// VEHICLE ICONS
// ======================================================

const createVehicleIcon = (
  status?: string
) => {

  const normalized =
    status?.toLowerCase();

  let iconUrl =
    "https://cdn-icons-png.flaticon.com/512/744/744465.png";

  if (normalized === "idle") {
    iconUrl =
      "https://cdn-icons-png.flaticon.com/512/744/744465.png";
  }

  if (
    normalized === "offline" ||
    normalized === "inactive"
  ) {
    iconUrl =
      "https://cdn-icons-png.flaticon.com/512/744/744465.png";
  }

  return new L.Icon({
    iconUrl,

    iconSize: [38, 38],

    iconAnchor: [19, 19],

    popupAnchor: [0, -20],

    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",

    shadowSize: [41, 41],
  });
};


// ======================================================
// TYPES
// ======================================================

interface Geofence {
  _id: string;

  name: string;

  center: {
    latitude: number;

    longitude: number;
  };

  radius: number;
}


interface RoutePoint {
  latitude: number;

  longitude: number;

  timestamp?: string;

  speed?: number;
}


interface VehicleRoute {
  vehicleId: string;

  points: RoutePoint[];
}


interface Props {
  vehicles: Vehicle[];

  geofences?: Geofence[];

  routeHistory?: VehicleRoute[];

  autoRefreshMinutes?: number;

  onVehicleSelect?: (
    vehicle: Vehicle
  ) => void;
}


// ======================================================
// MAP AUTO CENTER
// ======================================================

const AutoCenter = ({
  vehicles,
  selectedVehicle,
}: {
  vehicles: Vehicle[];

  selectedVehicle: Vehicle | null;
}) => {

  const map = useMap();


  useEffect(() => {

    if (selectedVehicle) {

      if (
        Number.isFinite(
          Number(
            selectedVehicle.latitude
          )
        ) &&
        Number.isFinite(
          Number(
            selectedVehicle.longitude
          )
        )
      ) {

        map.flyTo(
          [
            Number(
              selectedVehicle.latitude
            ),

            Number(
              selectedVehicle.longitude
            ),
          ],

          14,

          {
            duration: 1,
          }
        );

        return;
      }
    }


    const validVehicle =
      vehicles.find(
        (vehicle) =>
          Number.isFinite(
            Number(vehicle.latitude)
          ) &&
          Number.isFinite(
            Number(vehicle.longitude)
          )
      );


    if (validVehicle) {

      map.flyTo(
        [
          Number(
            validVehicle.latitude
          ),

          Number(
            validVehicle.longitude
          ),
        ],

        11,

        {
          duration: 1,
        }
      );
    }

  }, [
    vehicles,
    selectedVehicle,
    map,
  ]);


  return null;
};


// ======================================================
// FIT ALL VEHICLES
// ======================================================

const FitVehicles = ({
  vehicles,
  routeHistory,
}: {
  vehicles: Vehicle[];

  routeHistory: VehicleRoute[];
}) => {

  const map = useMap();


  const fitAll = () => {

    const points: LatLngExpression[] = [];


    vehicles.forEach(
      (vehicle) => {

        if (
          Number.isFinite(
            Number(vehicle.latitude)
          ) &&
          Number.isFinite(
            Number(vehicle.longitude)
          )
        ) {

          points.push([
            Number(
              vehicle.latitude
            ),

            Number(
              vehicle.longitude
            ),
          ]);
        }
      }
    );


    routeHistory.forEach(
      (route) => {

        route.points.forEach(
          (point) => {

            if (
              Number.isFinite(
                Number(point.latitude)
              ) &&
              Number.isFinite(
                Number(point.longitude)
              )
            ) {

              points.push([
                Number(
                  point.latitude
                ),

                Number(
                  point.longitude
                ),
              ]);
            }

          }
        );

      }
    );


    if (points.length > 0) {

      map.fitBounds(
        L.latLngBounds(
          points as [number, number][]
        ),
        {
          padding: [40, 40],
          maxZoom: 13,
        }
      );
    }

  };


  useEffect(() => {

    fitAll();

  }, []);


  return null;
};


// ======================================================
// STATUS HELPERS
// ======================================================

const getStatusClass = (
  status?: string
) => {

  switch (
    status?.toLowerCase()
  ) {

    case "active":
      return "bg-green-100 text-green-700";

    case "idle":
      return "bg-yellow-100 text-yellow-700";

    case "offline":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
};


// ======================================================
// COMPONENT
// ======================================================

const LiveMap = ({
  vehicles,
  geofences = [],
  routeHistory = [],
  autoRefreshMinutes = 2,
  onVehicleSelect,
}: Props) => {

  const [
    selectedVehicle,
    setSelectedVehicle,
  ] = useState<Vehicle | null>(
    null
  );


  const [
    showRoutes,
    setShowRoutes,
  ] = useState(true);


  const [
    showGeofences,
    setShowGeofences,
  ] = useState(true);


  const [
    lastUpdated,
    setLastUpdated,
  ] = useState(
    new Date()
  );


  // ====================================================
  // VALID VEHICLES
  // ====================================================

  const validVehicles =
    useMemo(() => {

      return vehicles.filter(
        (vehicle) =>
          Number.isFinite(
            Number(vehicle.latitude)
          ) &&
          Number.isFinite(
            Number(vehicle.longitude)
          )
      );

    }, [vehicles]);


  // ====================================================
  // ROUTES
  // ====================================================

  const validRoutes =
    useMemo(() => {

      return routeHistory.filter(
        (route) =>
          route.points.length > 1
      );

    }, [routeHistory]);


  // ====================================================
  // AUTO REFRESH TIMER
  // ====================================================

  useEffect(() => {

    const interval =
      window.setInterval(
        () => {

          setLastUpdated(
            new Date()
          );

        },

        autoRefreshMinutes *
          60 *
          1000
      );


    return () => {

      window.clearInterval(
        interval
      );

    };

  }, [
    autoRefreshMinutes,
  ]);


  // ====================================================
  // STATUS COUNTS
  // ====================================================

  const activeCount =
    vehicles.filter(
      (vehicle) =>
        vehicle.status ===
        "Active"
    ).length;


  const idleCount =
    vehicles.filter(
      (vehicle) =>
        vehicle.status ===
        "Idle"
    ).length;


const offlineCount =
  vehicles.filter(
    (vehicle) =>
      String(vehicle.status).toLowerCase() ===
      "offline"
  ).length;


  // ====================================================
  // ROUTE COORDINATES
  // ====================================================

  const getRouteCoordinates = (
    route: VehicleRoute
  ): [number, number][] => {

    return route.points

      .filter(
        (point) =>
          Number.isFinite(
            Number(
              point.latitude
            )
          ) &&
          Number.isFinite(
            Number(
              point.longitude
            )
          )
      )

      .map(
        (point) => [
          Number(
            point.latitude
          ),

          Number(
            point.longitude
          ),
        ]
      );
  };


  // ====================================================
  // VEHICLE ROUTE LOOKUP
  // ====================================================

  const getVehicleRoute =
    (vehicle: Vehicle) => {

      const id =
        String(
          vehicle._id ||
          vehicle.vehicleNumber
        );


      return validRoutes.find(
        (route) =>
          String(
            route.vehicleId
          ) === id
      );
    };


  // ====================================================
  // EMPTY STATE
  // ====================================================

  if (validVehicles.length === 0) {

    return (
      <div className="relative h-[450px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">

        <MapContainer
          center={[
            28.6139,
            77.209,
          ]}
          zoom={11}
          className="h-full w-full"
        >

          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

        </MapContainer>


        <div className="absolute inset-0 z-[1000] flex items-center justify-center">

          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-xl">

            <div className="text-3xl">
              🚚
            </div>

            <h3 className="mt-2 font-bold text-slate-900">
              No Vehicle Location
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Vehicle GPS coordinates are
              currently unavailable.
            </p>

          </div>

        </div>

      </div>
    );
  }


  return (

    <div className="relative h-[450px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-[520px] lg:h-[620px]">


      {/* ==================================================
          MAP
      ================================================== */}

      <MapContainer
        center={[
          28.6139,
          77.209,
        ]}
        zoom={11}
        className="h-full w-full"
      >

        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        <AutoCenter
          vehicles={validVehicles}
          selectedVehicle={
            selectedVehicle
          }
        />


        <FitVehicles
          vehicles={validVehicles}
          routeHistory={
            validRoutes
          }
        />


        {/* ==================================================
            ROUTES
        ================================================== */}

        {showRoutes &&
          validRoutes.map(
            (route) => {

              const coordinates =
                getRouteCoordinates(
                  route
                );


              if (
                coordinates.length <
                2
              ) {
                return null;
              }


              return (

                <Polyline
                  key={
                    route.vehicleId
                  }
                  positions={
                    coordinates
                  }
                  pathOptions={{
                    color:
                      "#2563eb",

                    weight: 5,

                    opacity: 0.65,
                  }}
                />

              );

            }
          )}


        {/* ==================================================
            GEOFENCES
        ================================================== */}

        {showGeofences &&
          geofences.map(
            (zone) => (

              <Circle
                key={zone._id}
                center={[
                  zone.center
                    .latitude,

                  zone.center
                    .longitude,
                ]}
                radius={
                  zone.radius
                }
                pathOptions={{
                  color:
                    "#2563eb",

                  fillColor:
                    "#3b82f6",

                  fillOpacity:
                    0.12,

                  weight: 2,
                }}
              >

                <Popup>

                  <div className="text-sm">

                    <strong>
                      {zone.name}
                    </strong>

                    <br />

                    Radius:{" "}
                    {zone.radius}{" "}
                    meters

                  </div>

                </Popup>

              </Circle>

            )
          )}


        {/* ==================================================
            VEHICLES
        ================================================== */}

        {validVehicles.map(
          (vehicle) => {

            const route =
              getVehicleRoute(
                vehicle
              );


            return (

              <Marker
                key={
                  String(
                    vehicle._id ||
                    vehicle.vehicleNumber
                  )
                }
                position={[
                  Number(
                    vehicle.latitude
                  ),

                  Number(
                    vehicle.longitude
                  ),
                ]}
                icon={
                  createVehicleIcon(
                    String(
                      vehicle.status
                    )
                  )
                }
                eventHandlers={{
                  click: () => {

                    setSelectedVehicle(
                      vehicle
                    );

                    onVehicleSelect?.(
                      vehicle
                    );

                  },
                }}
              >

                <Popup>

                  <div className="min-w-[220px]">

                    {/* HEADER */}

                    <div className="flex items-center justify-between gap-3">

                      <div>

                        <h3 className="font-bold text-slate-900">
                          🚚{" "}
                          {
                            vehicle.vehicleNumber
                          }
                        </h3>

                        <p className="text-xs text-slate-500">
                          Fleet Vehicle
                        </p>

                      </div>

                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold ${getStatusClass(
                          String(
                            vehicle.status
                          )
                        )}`}
                      >
                        {
                          vehicle.status
                        }
                      </span>

                    </div>


                    {/* DRIVER */}

                    <div className="mt-4 border-t pt-3 text-sm">

                      <div className="flex justify-between py-1">

                        <span className="text-slate-500">
                          Driver
                        </span>

                        <span className="font-semibold">

                          {typeof vehicle.driver ===
                          "object"
                            ? (
                                vehicle.driver as any
                              )?.fullName ||
                              "Not Assigned"
                            : vehicle.driver ||
                              "Not Assigned"}

                        </span>

                      </div>


                      <div className="flex justify-between py-1">

                        <span className="text-slate-500">
                          Speed
                        </span>

                        <span className="font-semibold">

                          {vehicle.speed ??
                            0}{" "}
                          km/h

                        </span>

                      </div>


                      <div className="flex justify-between py-1">

                        <span className="text-slate-500">
                          Fuel
                        </span>

                        <span className="font-semibold">

                          {vehicle.fuel ??
                            0}
                          %

                        </span>

                      </div>


                      <div className="flex justify-between py-1">

                        <span className="text-slate-500">
                          Location
                        </span>

                        <span className="font-semibold text-right">

                          {Number(
                            vehicle.latitude
                          ).toFixed(4)}

                          ,

                          {" "}

                          {Number(
                            vehicle.longitude
                          ).toFixed(4)}

                        </span>

                      </div>

                    </div>


                    {/* ROUTE */}

                    <div className="mt-3 rounded-lg bg-blue-50 p-2 text-xs text-blue-700">

                      {route
                        ? `${route.points.length} route points available`
                        : "No route history available"}

                    </div>

                  </div>

                </Popup>

              </Marker>

            );

          }
        )}

      </MapContainer>


      {/* ==================================================
          TOP LEFT SUMMARY
      ================================================== */}

      <div className="absolute left-4 top-4 z-[1000] w-[260px] rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs font-medium text-slate-500">
              Live Tracking
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-900">
              {validVehicles.length} Vehicles
            </h3>

          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <span className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
          </div>

        </div>


        <div className="mt-4 grid grid-cols-3 gap-2">

          <div className="rounded-lg bg-green-50 p-2 text-center">

            <p className="text-xs text-green-600">
              Active
            </p>

            <p className="font-bold text-green-700">
              {activeCount}
            </p>

          </div>


          <div className="rounded-lg bg-yellow-50 p-2 text-center">

            <p className="text-xs text-yellow-600">
              Idle
            </p>

            <p className="font-bold text-yellow-700">
              {idleCount}
            </p>

          </div>


          <div className="rounded-lg bg-red-50 p-2 text-center">

            <p className="text-xs text-red-600">
              Offline
            </p>

            <p className="font-bold text-red-700">
              {offlineCount}
            </p>

          </div>

        </div>

      </div>


      {/* ==================================================
          MAP CONTROLS
      ================================================== */}

      <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">

        <button
          onClick={() =>
            setShowRoutes(
              !showRoutes
            )
          }
          className={`rounded-xl border px-4 py-2 text-xs font-semibold shadow-lg backdrop-blur transition ${
            showRoutes
              ? "border-blue-200 bg-blue-600 text-white"
              : "border-slate-200 bg-white text-slate-700"
          }`}
        >
          {showRoutes
            ? "Hide Routes"
            : "Show Routes"}
        </button>


        <button
          onClick={() =>
            setShowGeofences(
              !showGeofences
            )
          }
          className={`rounded-xl border px-4 py-2 text-xs font-semibold shadow-lg backdrop-blur transition ${
            showGeofences
              ? "border-indigo-200 bg-indigo-600 text-white"
              : "border-slate-200 bg-white text-slate-700"
          }`}
        >
          {showGeofences
            ? "Hide Zones"
            : "Show Zones"}
        </button>

      </div>


      {/* ==================================================
          SELECTED VEHICLE
      ================================================== */}

      {selectedVehicle && (
        <div className="absolute bottom-4 left-4 z-[1000] w-[280px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-xs font-medium text-slate-500">
                Selected Vehicle
              </p>

              <h3 className="mt-1 font-bold text-slate-900">
                {selectedVehicle.vehicleNumber}
              </h3>

            </div>

            <button
              onClick={() =>
                setSelectedVehicle(
                  null
                )
              }
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
            >
              ×
            </button>

          </div>


          <div className="mt-3 grid grid-cols-2 gap-2">

            <div className="rounded-lg bg-slate-50 p-2">

              <p className="text-[10px] text-slate-400">
                Speed
              </p>

              <p className="font-bold">
                {selectedVehicle.speed ??
                  0}{" "}
                km/h
              </p>

            </div>


            <div className="rounded-lg bg-slate-50 p-2">

              <p className="text-[10px] text-slate-400">
                Fuel
              </p>

              <p className="font-bold">
                {selectedVehicle.fuel ??
                  0}%
              </p>

            </div>

          </div>

        </div>
      )}


      {/* ==================================================
          LAST UPDATED
      ================================================== */}

      <div className="absolute bottom-4 right-4 z-[1000] rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-[11px] text-slate-500 shadow-lg backdrop-blur">

        Updated{" "}
        {lastUpdated.toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }
        )}

      </div>

    </div>
  );
};


export default LiveMap;