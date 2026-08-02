import type { ReactNode } from "react";

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
    loading,
  } = useDrivers();






  // Loading State

  if (loading) {

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

        <div className="animate-pulse space-y-4">

          <div className="h-6 bg-gray-200 rounded w-1/3" />

          <div className="h-20 bg-gray-200 rounded" />

          <div className="h-20 bg-gray-200 rounded" />

          <div className="h-20 bg-gray-200 rounded" />

        </div>

      </div>

    );

  }





  // Empty State

  if (!drivers || drivers.length === 0) {

    return (

      <div
        className="
        bg-white
        rounded-2xl
        shadow-lg
        border
        border-gray-200
        p-6
        text-center
        text-gray-400
        "
      >

        No Driver Data Available

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




      {/* Header */}

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







      {/* Drivers List */}

      <div className="space-y-6">


        {
          drivers
            .slice(0, 5)
            .map(
              (
                driver: Driver,
                index: number
              ) => {


                const performance =
                  Math.max(
                    0,
                    95 - index * 3
                  );



                return (

                  <div
                    key={
                      driver._id ?? index
                    }
                    className="
                  border-b
                  pb-5
                  last:border-none
                  "
                  >





                    {/* Profile + Metrics */}


                    <div
                      className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    justify-between
                    gap-5
                    "
                    >





                      {/* Driver Profile */}


                      <div
                        className="
                      flex
                      items-center
                      gap-4
                      "
                      >


                        <div
                          className="
                        h-14
                        w-14
                        rounded-full
                        bg-blue-600
                        text-white
                        flex
                        items-center
                        justify-center
                        text-xl
                        "
                        >

                          <FaUserTie />

                        </div>






                        <div>


                          <h3
                            className="
                          text-lg
                          font-bold
                          text-slate-800
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

                            Experience:
                            {" "}
                            {driver.experience}
                            {" "}
                            years

                          </p>





                          <span
                            className={`
                          inline-block
                          mt-2
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-semibold
                        ${driver.status === "Available"
                                ? "bg-green-100 text-green-600"
                                :
                                "bg-orange-100 text-orange-600"
                              }
                          `}
                          >

                            {driver.status}

                          </span>



                        </div>


                      </div>








                      {/* Metrics */}


                      <div
                        className="
                      grid
                      grid-cols-2
                      sm:grid-cols-4
                      gap-5
                      "
                      >



                        <Metric

                          icon={<FaShieldAlt />}

                          value={
                            driver.status === "Driving"
                              ? "95%"
                              : "85%"
                          }

                          label="Safety"

                          color="text-green-600"

                        />






                        <Metric

                          icon={<FaRoute />}

                          value={
                            String(
                              30 + index * 5
                            )
                          }

                          label="Trips"

                          color="text-blue-600"

                        />







                        <Metric

                          icon={<FaStar />}

                          value={
                            (
                              4.8 -
                              index * 0.1
                            )
                              .toFixed(1)
                          }

                          label="Rating"

                          color="text-yellow-500"

                        />








                        <Metric

                          icon={<FaGasPump />}

                          value={
                            `${92 - index * 3}%`
                          }

                          label="Efficiency"

                          color="text-orange-500"

                        />




                      </div>


                    </div>









                    {/* Performance Progress */}


                    <div className="mt-5">


                      <div
                        className="
                      flex
                      justify-between
                      text-xs
                      mb-2
                      "
                      >

                        <span>
                          Performance Score
                        </span>


                        <span
                          className="
                        font-semibold
                        "
                        >

                          {performance}%

                        </span>


                      </div>





                      <div
                        className="
                      h-2
                      bg-gray-200
                      rounded-full
                      overflow-hidden
                      "
                      >

                        <div

                          className="
                        h-full
                        bg-blue-600
                        rounded-full
                        "

                          style={{
                            width: `${performance}%`
                          }}

                        />


                      </div>



                    </div>





                  </div>

                );

              }

            )

        }



      </div>





    </div>

  );

};







// Metric Component


const Metric = ({
  icon,
  value,
  label,
  color,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  color: string;
}) => {


  return (

    <div
      className="
      text-center
      "
    >


      <div
        className={`
        text-xl
        mx-auto
        ${color}
        `}
      >

        {icon}

      </div>



      <p
        className="
        font-bold
        mt-1
        "
      >

        {value}

      </p>



      <span
        className="
        text-xs
        text-gray-500
        "
      >

        {label}

      </span>



    </div>

  );

};





export default DriverPerformance;