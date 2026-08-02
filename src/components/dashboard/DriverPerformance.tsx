import {
  FaUserTie,
  FaStar,
  FaRoute,
  FaGasPump,
  FaShieldAlt,
} from "react-icons/fa";


import useDrivers from "../../hooks/useDrivers";

import type { Driver } from "../../services/driverService";



const DriverPerformance = () => {



  const {
    drivers,
    loading
  } = useDrivers();





  if (loading) {


    return (

      <div
        className="
        bg-white
        rounded-xl
        shadow-md
        p-6
        "
      >

        Loading Drivers...

      </div>

    );

  }







  return (


    <div

      className="
      bg-white
      rounded-2xl
      shadow-lg
      border
      border-gray-200
      p-6
      "

    >




      <div className="mb-6">


        <h2

          className="
          text-2xl
          font-bold
          text-slate-800
          "

        >

          Driver Performance

        </h2>



        <p

          className="
          text-sm
          text-gray-500
          mt-1
          "

        >

          Driver safety, trips and efficiency analytics

        </p>



      </div>








      <div
        className="
        space-y-5
        "
      >



        {
          drivers.slice(0,5).map(

            (driver: Driver,index:number)=>(


              <div

                key={driver._id}

                className="
                flex
                flex-col
                md:flex-row
                md:items-center
                justify-between
                gap-4
                border-b
                pb-4
                "

              >





                {/* Driver Info */}


                <div
                  className="
                  flex
                  items-center
                  gap-4
                  "
                >



                  <div

                    className="
                    bg-blue-600
                    text-white
                    p-3
                    rounded-full
                    "

                  >

                    <FaUserTie />

                  </div>





                  <div>


                    <h3
                      className="
                      font-semibold
                      text-lg
                      "
                    >

                      #{index + 1} {driver.fullName}

                    </h3>



                    <p
                      className="
                      text-sm
                      text-gray-500
                      "
                    >

                      Experience: {driver.experience} years

                    </p>



                    <p
                      className="
                      text-sm
                      text-gray-500
                      "
                    >

                      Status: {driver.status}

                    </p>



                  </div>



                </div>









                {/* Performance Metrics */}


                <div

                  className="
                  grid
                  grid-cols-2
                  sm:grid-cols-4
                  gap-4
                  text-sm
                  "

                >





                  <div
                    className="
                    text-center
                    "
                  >

                    <FaShieldAlt
                      className="
                      mx-auto
                      text-green-600
                      "
                    />


                    <p className="font-bold">

                      {driver.status === "Driving"
                      ? "95%"
                      : "85%"}

                    </p>


                    <span className="text-gray-500">

                      Safety

                    </span>


                  </div>







                  <div
                    className="
                    text-center
                    "
                  >


                    <FaRoute
                      className="
                      mx-auto
                      text-blue-600
                      "
                    />


                    <p className="font-bold">

                      {30 + index * 5}

                    </p>


                    <span className="text-gray-500">

                      Trips

                    </span>


                  </div>







                  <div

                    className="
                    text-center
                    "

                  >


                    <FaStar

                      className="
                      mx-auto
                      text-yellow-500
                      "

                    />


                    <p className="font-bold">

                      {(
                        4.8 - index * 0.1
                      ).toFixed(1)}

                    </p>


                    <span className="text-gray-500">

                      Rating

                    </span>


                  </div>








                  <div

                    className="
                    text-center
                    "

                  >



                    <FaGasPump

                      className="
                      mx-auto
                      text-orange-500
                      "

                    />



                    <p className="font-bold">

                      {92 - index * 3}%

                    </p>



                    <span className="text-gray-500">

                      Efficiency

                    </span>



                  </div>







                </div>






              </div>


            )

          )

        }




      </div>





    </div>


  );


};



export default DriverPerformance;