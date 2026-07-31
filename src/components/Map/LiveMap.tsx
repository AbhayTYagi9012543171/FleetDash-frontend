import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Vehicle {
  _id?: string;
  id?: number;
  vehicleNumber: string;
  driver: string;
  speed: number;
  fuel: number;
  status: "Active" | "Idle" | "Offline";
  latitude: number;
  longitude: number;
}

interface Geofence {
  _id: string;
  name: string;
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number;
}

interface Props {
  vehicles: Vehicle[];
  geofences?: Geofence[];
}

const LiveMap = ({
  vehicles,
  geofences = [],
}: Props) => {
  return (
    <div
      className="
        w-full
        h-[300px]
        sm:h-[400px]
        md:h-[500px]
        lg:h-[600px]
        rounded-xl
        overflow-hidden
        border
        border-gray-200
      "
    >
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={12}
        scrollWheelZoom
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap Contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Vehicles */}
        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle._id || vehicle.id}
            position={[
              vehicle.latitude,
              vehicle.longitude,
            ]}
          >
            <Popup>

              <div className="min-w-[180px]">

                <h3 className="font-bold text-blue-600 mb-2">
                  {vehicle.vehicleNumber}
                </h3>

                <div className="space-y-1 text-sm">

                  <p>
                    <strong>Driver:</strong>{" "}
                    {vehicle.driver}
                  </p>

                  <p>
                    <strong>Speed:</strong>{" "}
                    {vehicle.speed} km/h
                  </p>

                  <p>
                    <strong>Fuel:</strong>{" "}
                    {vehicle.fuel}%
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        vehicle.status === "Active"
                          ? "text-green-600 font-semibold"
                          : vehicle.status === "Idle"
                          ? "text-yellow-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {vehicle.status}
                    </span>
                  </p>

                </div>

              </div>

            </Popup>
          </Marker>
        ))}

        {/* Geofences */}
        {geofences.map((zone) => (
          <Circle
            key={zone._id}
            center={[
              zone.center.latitude,
              zone.center.longitude,
            ]}
            radius={zone.radius}
            pathOptions={{
              color: "#2563eb",
              fillColor: "#3b82f6",
              fillOpacity: 0.15,
            }}
          >
            <Popup>

              <div className="min-w-[170px]">

                <h3 className="font-bold text-blue-600">
                  {zone.name}
                </h3>

                <p className="mt-2 text-sm">
                  Radius: {zone.radius} meters
                </p>

              </div>

            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveMap;