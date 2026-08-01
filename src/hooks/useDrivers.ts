import { useEffect, useState } from "react";

import { driverService } from "../services/driverService";
import type { Driver } from "../services/driverService";


const useDrivers = () => {


  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {


    const fetchDrivers = async () => {


      try {


        const data =
          await driverService.getDrivers();


        setDrivers(data);


      }
      catch(error){


        console.error(
          "Drivers Fetch Error:",
          error
        );


        setDrivers([]);


      }
      finally{


        setLoading(false);


      }


    };



    fetchDrivers();


  },[]);



  return {

    drivers,

    loading,

  };


};


export default useDrivers;