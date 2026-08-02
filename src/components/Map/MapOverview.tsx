import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import {
  FaTruck,
  FaMapMarkerAlt,
} from "react-icons/fa";

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface VehicleLocation {
  id: number;
  vehicle: string;
  driver: string;
  lat: number;
  lng: number;
  speed: number;
  status: string;
}

const MapOverview = () => {

  const vehicles: VehicleLocation[] = [

    {
      id: 1,
      vehicle: "UP14 AB 1234",
      driver: "Rahul Kumar",
      lat: 28.6692,
      lng: 77.4538,
      speed: 64,
      status: "Running",
    },

    {
      id: 2,
      vehicle: "UP16 CD 5678",
      driver: "Amit Sharma",
      lat: 28.6755,
      lng: 77.4452,
      speed: 52,
      status: "Running",
    },

    {
      id: 3,
      vehicle: "DL01 EF 8899",
      driver: "Mohit Singh",
      lat: 28.6585,
      lng: 77.4621,
      speed: 0,
      status: "Idle",
    },

  ];
    return (
    <div className="w-full h-[450px] rounded-xl overflow-hidden shadow-md">

      <MapContainer
        center={[28.6692, 77.4538]}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {
          vehicles.map((vehicle) => (

            <Marker
              key={vehicle.id}
              position={[
                vehicle.lat,
                vehicle.lng
              ]}
            >

              <Popup>

                <div className="space-y-2">

                  <h3 className="font-bold flex items-center gap-2">
                    <FaTruck />
                    {vehicle.vehicle}
                  </h3>


                  <p>
                    Driver: {vehicle.driver}
                  </p>


                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt />
                    Status: {vehicle.status}
                  </p>


                  <p>
                    Speed: {vehicle.speed} km/h
                  </p>


                </div>

              </Popup>

            </Marker>

          ))
        }


      </MapContainer>

    </div>
  );

};


export default MapOverview;
