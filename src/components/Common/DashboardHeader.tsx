import {
  FaTruck,
  FaTools,
  FaCheckCircle,
  FaSyncAlt,
  FaUserCircle,
} from "react-icons/fa";

import { useAppSelector } from "../../redux/hooks";

interface DashboardHeaderProps {
  lastUpdated?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
}


const DashboardHeader = ({
  lastUpdated,
  onRefresh,
  refreshing,
}: DashboardHeaderProps) => {


  const user = useAppSelector(
    (state) => state.auth.user
  );


  return (

    <div className="
      bg-white
      rounded-2xl
      shadow-sm
      border
      border-gray-100
      p-5
      sm:p-6
      mb-6
    ">


      {/* TOP HEADER */}

      <div className="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-5
      ">


        {/* Welcome */}

        <div>

          <h1 className="
            text-2xl
            sm:text-3xl
            font-bold
            text-slate-800
          ">

            Good Morning, {user?.username || "Abhay"} 👋

          </h1>


          <p className="
            text-gray-500
            mt-1
          ">

            Welcome back to FleetDash Control Center

          </p>


        </div>





        {/* RIGHT AREA */}

        <div className="
          flex
          items-center
          gap-4
          flex-wrap
        ">


          {/* Sync */}

          <div className="
            bg-gray-50
            rounded-xl
            px-4
            py-3
          ">


            <p className="
              text-xs
              text-gray-500
            ">

              Last Sync

            </p>


            <p className="
              font-semibold
              text-gray-800
            ">

              {lastUpdated || "5:02 PM"}

            </p>


          </div>





          {/* Refresh */}

          <button

            onClick={onRefresh}

            disabled={refreshing}

            className="
              flex
              items-center
              gap-2
              bg-blue-600
              hover:bg-blue-700
              disabled:bg-blue-300
              text-white
              px-5
              py-3
              rounded-xl
              font-semibold
              transition
            "

          >

            <FaSyncAlt
              className={
                refreshing
                ?
                "animate-spin"
                :
                ""
              }
            />

            {
              refreshing
              ?
              "Refreshing"
              :
              "Refresh"
            }


          </button>





          {/* User */}

          <div className="
            flex
            items-center
            gap-3
            bg-gray-50
            rounded-xl
            px-4
            py-3
          ">


            <FaUserCircle
              className="
                text-3xl
                text-gray-500
              "
            />


            <div>


              <p className="
                font-bold
                text-gray-800
              ">

                {user?.username || "Abhay"}

              </p>


              <p className="
                text-sm
                text-gray-500
              ">

                {user?.role || "Administrator"}

              </p>


            </div>


          </div>


        </div>


      </div>





      {/* FLEET OVERVIEW */}


      <div className="
        mt-6
        grid
        grid-cols-1
        sm:grid-cols-3
        gap-4
      ">


        {/* Total Vehicles */}

        <div className="
          bg-blue-50
          rounded-xl
          p-4
          flex
          items-center
          gap-4
        ">


          <div className="
            bg-blue-600
            text-white
            p-3
            rounded-full
          ">

            <FaTruck />

          </div>


          <div>

            <h3 className="
              text-2xl
              font-bold
            ">

              124

            </h3>


            <p className="
              text-gray-600
            ">

              Vehicles

            </p>


          </div>


        </div>






        {/* Active Vehicles */}

        <div className="
          bg-green-50
          rounded-xl
          p-4
          flex
          items-center
          gap-4
        ">


          <div className="
            bg-green-600
            text-white
            p-3
            rounded-full
          ">

            <FaCheckCircle />

          </div>


          <div>

            <h3 className="
              text-2xl
              font-bold
            ">

              98

            </h3>


            <p className="
              text-gray-600
            ">

              Active

            </p>


          </div>


        </div>






        {/* Maintenance */}

        <div className="
          bg-orange-50
          rounded-xl
          p-4
          flex
          items-center
          gap-4
        ">


          <div className="
            bg-orange-500
            text-white
            p-3
            rounded-full
          ">

            <FaTools />

          </div>


          <div>

            <h3 className="
              text-2xl
              font-bold
            ">

              12

            </h3>


            <p className="
              text-gray-600
            ">

              Maintenance

            </p>


          </div>


        </div>



      </div>


    </div>

  );

};


export default DashboardHeader;