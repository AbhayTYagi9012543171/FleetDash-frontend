import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    FiSearch,
    FiRefreshCw,
    FiMapPin,
    FiTruck,
} from "react-icons/fi";


import { api } from "../../services/api";

import { socket } from "../../services/socket";

import LiveMap from "../../components/Map/LiveMap";



interface Vehicle {

    _id?: string;

    id?: number;

    vehicleNumber: string;

    driver: string;

    speed: number;

    fuel: number;

    status:
    "Active" |
    "Idle" |
    "Offline";

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



const LiveTracking = () => {


    // ================= STATES =================


    const [vehicles, setVehicles] = useState<Vehicle[]>([]);


    const [geofences, setGeofences] = useState<Geofence[]>([]);


    const [loading, setLoading] = useState(false);


    const [search, setSearch] = useState("");


    const [status, setStatus] = useState("All");





    // ================= GET VEHICLES =================


    const fetchVehicles = async () => {


        try {


            setLoading(true);


            const response = await api.get("/vehicles");


            console.log(
                "Vehicle API Response:",
                response.data
            );



            if (Array.isArray(response.data.vehicles)) {


                setVehicles(
                    response.data.vehicles
                );


            }
            else if (Array.isArray(response.data)) {


                setVehicles(
                    response.data
                );


            }
            else {


                setVehicles([]);


            }



        }
        catch (error) {


            console.log(
                "Vehicle API Error:",
                error
            );


            setVehicles([]);


        }
        finally {


            setLoading(false);


        }


    };





    // ================= GET GEOFENCES =================


    const fetchGeofences = async () => {


        try {


            const response = await api.get("/geofences");


            console.log(
                "Geofence API Response:",
                response.data
            );



            if (response.data.success) {


                setGeofences(
                    response.data.geofences
                );


            }
            else if (Array.isArray(response.data)) {


                setGeofences(
                    response.data
                );


            }
            else {


                setGeofences([]);


            }



        }
        catch (error) {


            console.log(
                "Geofence API Error:",
                error
            );


            setGeofences([]);


        }


    };
    // ================= SOCKET CONNECTION =================


    useEffect(() => {


        // Load initial data

        fetchVehicles();

        fetchGeofences();



        // Connect Socket.IO

        socket.connect();




        // Listen for live vehicle updates


        socket.on(
            "vehicleUpdate",
            (updatedVehicle: Vehicle) => {


                console.log(
                    "Live Update:",
                    updatedVehicle
                );



                setVehicles(
                    (oldVehicles) =>

                        oldVehicles.map(
                            (vehicle) =>


                                vehicle._id === updatedVehicle._id ||
                                    vehicle.id === updatedVehicle.id


                                    ? {

                                        ...vehicle,

                                        ...updatedVehicle

                                    }


                                    : vehicle

                        )

                );


            }

        );




        // Cleanup


        return () => {


            socket.off(
                "vehicleUpdate"
            );


            socket.disconnect();


        };



    }, []);






    // ================= FILTER =================


    const filteredVehicles = useMemo(() => {


        return vehicles.filter(
            (vehicle) => {


                const searchMatch =

                    vehicle.vehicleNumber

                        .toLowerCase()

                        .includes(
                            search.toLowerCase()
                        );




                const statusMatch =

                    status === "All" ||

                    vehicle.status === status;




                return (

                    searchMatch &&

                    statusMatch

                );


            }

        );


    }, [

        vehicles,

        search,

        status

    ]);






    // ================= STATS =================



    const total = vehicles.length;



    const active =

        vehicles.filter(

            (v) => v.status === "Active"

        ).length;




    const idle =

        vehicles.filter(

            (v) => v.status === "Idle"

        ).length;




    const offline =

        vehicles.filter(

            (v) => v.status === "Offline"

        ).length;

    return (

        <div className="space-y-6">


            {/* HEADER */}

            <div className="flex justify-between items-center">


                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Live Tracking
                    </h1>


                    <p className="text-gray-500">
                        Monitor your fleet in real time
                    </p>

                </div>



                <button

                    onClick={fetchVehicles}

                    className="
                    bg-blue-600
                    text-white
                    px-5
                    py-3
                    rounded-lg
                    flex
                    gap-2
                    items-center
                    "

                >

                    <FiRefreshCw />

                    Refresh

                </button>


            </div>





            {/* STATS */}

            <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-5
            ">


                <StatCard
                    title="Total Vehicles"
                    value={total}
                />


                <StatCard
                    title="Active"
                    value={active}
                    color="text-green-600"
                />


                <StatCard
                    title="Idle"
                    value={idle}
                    color="text-yellow-600"
                />


                <StatCard
                    title="Offline"
                    value={offline}
                    color="text-red-600"
                />


            </div>






            {/* SEARCH */}


            <div className="
            bg-white
            shadow
            rounded-xl
            p-5
            flex
            gap-4
            ">


                <div className="
                border
                rounded-lg
                flex
                items-center
                px-3
                flex-1
                ">


                    <FiSearch />


                    <input

                        className="
                        w-full
                        p-3
                        outline-none
                        "

                        placeholder="Search vehicle..."

                        value={search}

                        onChange={
                            e => setSearch(e.target.value)
                        }

                    />

                </div>




                <select

                    className="
                    border
                    rounded-lg
                    px-4
                    "

                    value={status}

                    onChange={
                        e => setStatus(e.target.value)
                    }

                >

                    <option>All</option>

                    <option>Active</option>

                    <option>Idle</option>

                    <option>Offline</option>


                </select>


            </div>







            {/* MAP + LIST */}


            <div className="
            grid
            xl:grid-cols-3
            gap-6
            ">



                {/* MAP */}


                <div className="
                xl:col-span-2
                bg-white
                shadow
                rounded-xl
                p-4
                ">


                    <div className="
                    flex
                    gap-2
                    mb-4
                    ">

                        <FiMapPin className="text-blue-600" />


                        <h2 className="text-xl font-bold">
                            Live Vehicle Map
                        </h2>


                    </div>



                    <LiveMap

                        vehicles={vehicles}

                    />


                </div>






                {/* VEHICLE LIST */}


                <div className="
                bg-white
                shadow
                rounded-xl
                ">


                    <h2 className="
                    text-xl
                    font-bold
                    p-4
                    border-b
                    ">

                        Vehicles

                    </h2>




                    {
                        loading &&

                        <p className="p-4">
                            Loading...
                        </p>

                    }




                    {
                        filteredVehicles.map(

                            (vehicle) => (


                                <div

                                    key={
                                        vehicle._id ||
                                        vehicle.id
                                    }

                                    className="
                                    p-4
                                    border-b
                                    "

                                >


                                    <div className="flex justify-between">


                                        <div>


                                            <h3 className="font-bold">

                                                {vehicle.vehicleNumber}

                                            </h3>



                                            <p className="text-gray-500">

                                                {vehicle.driver}

                                            </p>


                                        </div>



                                        <FiTruck className="text-blue-600" />


                                    </div>




                                    <p>
                                        Speed: {vehicle.speed} km/h
                                    </p>


                                    <p>
                                        Fuel: {vehicle.fuel}%
                                    </p>


                                    <p>
                                        Status:
                                        <b> {vehicle.status}</b>
                                    </p>



                                </div>


                            )

                        )
                    }



                </div>



            </div>



        </div>

    );

};





const StatCard = ({

    title,

    value,

    color = "text-gray-800"


}: {

    title: string;

    value: number;

    color?: string;

}) => {


    return (

        <div className="
        bg-white
        shadow
        rounded-xl
        p-5
        ">


            <p className="text-gray-500">

                {title}

            </p>



            <h2 className={`

            text-3xl

            font-bold

            ${color}

            `}>

                {value}

            </h2>


        </div>

    );


};




export default LiveTracking;