import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";

import type { Vehicle } from "../../types/vehicle";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";


// ==========================
// Leaflet Icon Fix
// ==========================

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",

});



// ==========================
// Geofence Interface
// ==========================

interface Geofence {

  _id: string;

  name: string;

  center: {

    latitude: number;

    longitude: number;

  };

  radius: number;

}



// ==========================
// Props
// ==========================

interface Props {

  vehicles: Vehicle[];

  geofences?: Geofence[];

}



// ==========================
// Auto Center Map
// ==========================

const AutoCenter = ({
  vehicles,
}: {
  vehicles: Vehicle[];
}) => {


  const map = useMap();


  useEffect(() => {


    if (vehicles.length === 0)
      return;


    const firstVehicle = vehicles[0];


    if (
      firstVehicle.latitude &&
      firstVehicle.longitude
    ) {


      map.setView(
        [
          firstVehicle.latitude,
          firstVehicle.longitude,
        ],
        12
      );


    }


  }, [vehicles, map]);



  return null;

};





// ==========================
// Live Map Component
// ==========================

const LiveMap = ({

  vehicles,

  geofences = [],

}: Props) => {



  return (


    <div
      className="
      relative
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



      {/* Vehicle Counter */}

      <div
        className="
        absolute
        z-[999]
        top-3
        left-3
        bg-white
        shadow
        px-4
        py-2
        rounded-lg
        text-sm
        "
      >

        Vehicles:

        <strong>
          {" "}
          {vehicles.length}
        </strong>


      </div>





      <MapContainer


        center={[

          28.6139,

          77.2090,

        ]}


        zoom={12}


        scrollWheelZoom={true}


        className="w-full h-full"


      >



        <AutoCenter
          vehicles={vehicles}
        />



        <TileLayer


          attribution="&copy; OpenStreetMap Contributors"


          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"


        />





        {/* ==========================
            Vehicle Markers
        ========================== */}



        {

          vehicles.map((vehicle)=>(


            <Marker


              key={String(

                vehicle._id ??

                vehicle.id ??

                vehicle.vehicleNumber

              )}



              position={[

                Number(vehicle.latitude),

                Number(vehicle.longitude),

              ]}


            >



              <Popup>


                <div
                  className="min-w-[220px]"
                >



                  <h3
                    className="
                    font-bold
                    text-blue-600
                    text-lg
                    mb-3
                    "
                  >

                    {vehicle.vehicleNumber}

                  </h3>




                  <div
                    className="
                    space-y-2
                    text-sm
                    "
                  >



                    <p>

                      <strong>
                        Driver:
                      </strong>

                      {" "}

                      {
                        vehicle.driver ??
                        "Not Assigned"
                      }

                    </p>





                    <p>

                      <strong>
                        Speed:
                      </strong>

                      {" "}

                      {vehicle.speed}

                      {" km/h"}

                    </p>





                    <p>

                      <strong>
                        Fuel:
                      </strong>

                      {" "}

                      {vehicle.fuel}

                      %

                    </p>





                    <p>


                      <strong>
                        Status:
                      </strong>


                      {" "}



                      <span

                        className={

                          vehicle.status === "Active"

                          ? "text-green-600 font-bold"


                          : vehicle.status === "Idle"

                          ? "text-yellow-600 font-bold"


                          : vehicle.status === "Maintenance"

                          ? "text-orange-600 font-bold"


                          : "text-red-600 font-bold"

                        }

                      >


                        {vehicle.status}


                      </span>



                    </p>





                    <p>

                      <strong>
                        Location:
                      </strong>

                      <br/>


                      {vehicle.latitude},

                      {" "}

                      {vehicle.longitude}


                    </p>




                  </div>




                </div>


              </Popup>




            </Marker>



          ))

        }





        {/* ==========================
            Geofence Circle
        ========================== */}



        {

          geofences.map((zone)=>(


            <Circle


              key={zone._id}


              center={[

                zone.center.latitude,

                zone.center.longitude,

              ]}



              radius={zone.radius}



              pathOptions={{

                color:"#2563eb",

                fillColor:"#3b82f6",

                fillOpacity:0.15,

              }}



            >


              <Popup>


                <div>


                  <h3
                    className="
                    font-bold
                    text-blue-600
                    "
                  >

                    {zone.name}

                  </h3>



                  <p>

                    Radius:

                    {" "}

                    {zone.radius}

                    {" meters"}

                  </p>



                </div>


              </Popup>


            </Circle>



          ))

        }





      </MapContainer>



    </div>


  );


};



export default LiveMap;