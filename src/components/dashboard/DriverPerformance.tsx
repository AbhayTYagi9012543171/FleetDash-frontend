import { FaUserTie, FaStar } from "react-icons/fa";

import { driverPerformanceData } 
from "../../data/driverPerformanceData";


const DriverPerformance = () => {

  return (

    <div
      className="
      bg-white
      rounded-xl
      shadow-md
      p-6
      "
    >

      <h2
        className="
        text-xl
        font-semibold
        mb-6
        "
      >
        Driver Performance
      </h2>


      <div className="space-y-4">


      {
        driverPerformanceData.map(
          (driver,index)=>(

          <div
            key={driver.name}
            className="
            flex
            items-center
            justify-between
            border-b
            pb-4
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                bg-blue-500
                text-white
                p-3
                rounded-full
                "
              >
                <FaUserTie />
              </div>


              <div>

                <h3 className="font-semibold">
                  {index + 1}. {driver.name}
                </h3>


                <p className="text-sm text-gray-500">
                  {driver.trips} Trips
                  •
                  {driver.distance}
                </p>

              </div>


            </div>



            <div
              className="
              flex
              items-center
              gap-2
              text-green-600
              font-bold
              "
            >

              <FaStar />

              {driver.safetyScore}%

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