import { useEffect, useState } from "react";
import { api } from "../../services/api";


interface Driver {

  _id: string;

  fullName?: string;

  name?: string;

  phoneNumber?: string;

  status?: string;

}




const DriverStatus = () => {


  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");





  // ========================
  // Fetch Drivers
  // ========================

  const fetchDrivers = async () => {

    try {


      setLoading(true);


      const response = await api.get("/drivers");


      console.log(
        "Drivers API:",
        response.data
      );



      if(response.data.success){


        setDrivers(

          response.data.drivers ||

          response.data.data ||

          []

        );


      }
      else{


        setDrivers([]);


      }



      setError("");



    }
    catch(error:any){


      console.log(
        "Driver Error:",
        error
      );


      setDrivers([]);


      setError(
        "Unable to load drivers"
      );


    }
    finally{


      setLoading(false);


    }


  };






  useEffect(()=>{


    fetchDrivers();


  },[]);







  // ========================
  // Status Color
  // ========================

  const getStatusColor = (
    status:string = ""
  ) => {


    switch(status){


      case "Driving":

      case "Active":

        return "bg-green-100 text-green-700";



      case "Idle":

        return "bg-yellow-100 text-yellow-700";



      case "Offline":

      case "Inactive":

        return "bg-red-100 text-red-700";



      default:

        return "bg-gray-100 text-gray-700";


    }


  };







  return (

    <div className="bg-white rounded-xl shadow-md p-6">



      <div className="flex justify-between items-center mb-5">


        <h2 className="text-xl font-semibold">

          Driver Status

        </h2>



        <button

          onClick={fetchDrivers}

          className="
          bg-blue-600
          text-white
          px-4
          py-2
          rounded-lg
          text-sm
          "

        >

          Refresh

        </button>


      </div>





      {
        error &&

        <p className="text-red-500 mb-3">

          {error}

        </p>

      }





      <div className="space-y-4">



        {
          loading ?


          (

            <p className="text-gray-500">

              Loading drivers...

            </p>

          )


          :


          drivers.length === 0 ?


          (

            <p className="text-gray-500">

              No drivers found

            </p>

          )


          :



          drivers.slice(0,5).map((driver)=>(



            <div

              key={driver._id}

              className="
              flex
              justify-between
              items-center
              border-b
              pb-3
              "

            >



              <div>


                <p className="font-medium">


                  {
                    driver.fullName ||

                    driver.name ||

                    "Unknown Driver"

                  }


                </p>




                <p className="text-sm text-gray-500">


                  {

                    driver.phoneNumber ||

                    "No phone"

                  }


                </p>


              </div>






              <span

                className={`
                px-3
                py-1
                rounded-full
                text-sm
                font-medium
                ${getStatusColor(driver.status)}
                `}

              >

                {

                  driver.status ||

                  "Unknown"

                }

              </span>



            </div>


          ))


        }



      </div>



    </div>


  );


};



export default DriverStatus;