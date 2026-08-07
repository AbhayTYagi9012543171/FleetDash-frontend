import {
  FaTruck,
  FaTools,
  FaCheckCircle,
  FaSyncAlt,
  FaUserCircle,
  FaHeartbeat,
  FaGasPump,
  FaBell,
  FaSearch,
  FaCalendarAlt,
  FaClock,
  FaArrowUp,
  FaWifi,
  FaMoon,
  FaSun,
} from "react-icons/fa";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import { motion } from "motion/react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAppSelector,
} from "../../redux/hooks";

import type {
  DashboardData,
} from "../../hooks/useDashboard";



// ===============================
// Interfaces
// ===============================


interface DashboardHeaderProps {

  dashboard?: DashboardData;

  lastUpdated?: string;

  onRefresh?: () => void | Promise<void>;

  refreshing?: boolean;

}




interface InfoCardProps {

  icon: ReactNode;

  title: string;

  value: string;

}




interface KPICardProps {

  title: string;

  value: number;

  icon: ReactNode;

  color:
  | "blue"
  | "green"
  | "orange"
  | "cyan";

  trend?: number;

}




interface TrendBadgeProps {

  value?: number;

}




// ===============================
// Animation Variants
// ===============================


const containerVariants = {

  hidden: {

    opacity: 0,

  },


  show: {

    opacity: 1,

    transition: {

      staggerChildren: 0.08,

    },

  },

};




const itemVariants = {

  hidden: {

    opacity: 0,

    y: 20,

  },


  show: {

    opacity: 1,

    y: 0,

    transition: {

      duration: 0.4,

    },

  },

};






// ===============================
// Main Component
// ===============================


const DashboardHeader = ({

  dashboard,

  lastUpdated,

  onRefresh,

  refreshing = false,

}: DashboardHeaderProps) => {



  const navigate = useNavigate();



  const user = useAppSelector(
    (state) => state.auth.user
  );




  const [
    currentTime,
    setCurrentTime,
  ] = useState(
    new Date()
  );



  const [
    search,
    setSearch,
  ] = useState("");



  const [
    darkMode,
    setDarkMode,
  ] = useState(false);






  // ===============================
  // Clock Update
  // ===============================


  useEffect(() => {


    const timer =
      setInterval(() => {

        setCurrentTime(
          new Date()
        );

      }, 1000);



    return () => clearInterval(timer);



  }, []);







  // ===============================
  // Date Time
  // ===============================


  const hour =
    currentTime.getHours();




  const greeting =
    useMemo(() => {


      if (hour < 12)

        return "Good Morning";


      if (hour < 18)

        return "Good Afternoon";


      return "Good Evening";


    }, [hour]);







  const today =
    useMemo(() => {


      return currentTime.toLocaleDateString(
        "en-IN",
        {

          weekday: "long",

          day: "numeric",

          month: "long",

          year: "numeric",

        }
      );


    }, [currentTime]);






  const clock =
    useMemo(() => {


      return currentTime.toLocaleTimeString(
        "en-IN",
        {

          hour: "2-digit",

          minute: "2-digit",

          second: "2-digit",

        }
      );


    }, [currentTime]);







  // ===============================
  // Dashboard Values
  // ===============================


  const totalVehicles =
    dashboard?.totalVehicles ?? 0;



  const activeVehicles =
    dashboard?.activeVehicles ?? 0;



  const totalDrivers =
    dashboard?.totalDrivers ?? 0;



  const totalAlerts =
    dashboard?.totalAlerts ?? 0;






  const fleetHealth =
    useMemo(() => {


      if (!totalVehicles)

        return 0;



      return Math.round(
        (
          activeVehicles /
          totalVehicles
        ) * 100
      );


    }, [
      activeVehicles,
      totalVehicles,
    ]);







  const fleetStatus =
    useMemo(() => {


      if (fleetHealth >= 90)

        return "Excellent";


      if (fleetHealth >= 75)

        return "Good";


      if (fleetHealth >= 60)

        return "Average";


      return "Needs Attention";


    }, [
      fleetHealth
    ]);






  const healthColor =
    useMemo(() => {


      if (fleetHealth >= 90)

        return "text-green-400";


      if (fleetHealth >= 70)

        return "text-yellow-300";


      return "text-red-400";


    }, [
      fleetHealth
    ]);







  const connectionStatus = true;







  const welcomeMessage =
    useMemo(() => {


      return `${greeting}, ${user?.username ??
        "Administrator"
        }`;


    }, [
      greeting,
      user,
    ]);







  const refreshHandler =
    useCallback(async () => {


      await onRefresh?.();


    }, [
      onRefresh
    ]);






  const toggleTheme = () => {


    setDarkMode(
      previous => !previous
    );


  };


  return (

    <motion.section

      variants={containerVariants}

      initial="hidden"

      animate="show"

      className="
        relative
        overflow-hidden
        rounded-3xl
        bg-gradient-to-br
        from-slate-950
        via-blue-900
        to-indigo-900
        p-6
        md:p-8
        shadow-2xl
        border
        border-white/10
        text-white
      "

    >



      {/* ================= BACKGROUND EFFECT ================= */}


      <div
        className="
          absolute
          inset-0
          overflow-hidden
          pointer-events-none
        "
      >


        <div
          className="
            absolute
            -top-24
            -right-24
            h-72
            w-72
            rounded-full
            bg-cyan-400/10
            blur-3xl
          "
        />


        <div
          className="
            absolute
            bottom-0
            left-0
            h-64
            w-64
            rounded-full
            bg-indigo-500/10
            blur-3xl
          "
        />


      </div>






      <div
        className="
          relative
          z-10
          space-y-8
        "
      >




        {/* ================= TOP HEADER ================= */}


        <motion.div

          variants={itemVariants}

          className="
            flex
            flex-col
            gap-8
            xl:flex-row
            xl:justify-between
          "

        >




          {/* LEFT CONTENT */}


          <div className="flex-1">



            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-emerald-400/20
                bg-emerald-500/10
                px-4
                py-2
                text-sm
                text-emerald-300
              "
            >


              <FaWifi
                className="
                  animate-pulse
                "
              />


              {
                connectionStatus
                  ?
                  "Backend Connected"
                  :
                  "Disconnected"
              }


            </div>







            <h1
              className="
                mt-6
                text-4xl
                font-black
                md:text-5xl
              "
            >

              {welcomeMessage}


              <span className="ml-2">
                👋
              </span>


            </h1>







            <p
              className="
                mt-4
                max-w-2xl
                text-lg
                text-blue-100
              "
            >

              Fleet Management Control Center.
              Monitor vehicles, drivers and fleet
              performance in real time.

            </p>







            <div
              className="
                mt-8
                flex
                flex-wrap
                gap-4
              "
            >




              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  bg-white/10
                  px-4
                  py-3
                "
              >

                <FaCalendarAlt
                  className="text-cyan-300"
                />


                <span>
                  {today}
                </span>


              </div>






              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  bg-white/10
                  px-4
                  py-3
                "
              >

                <FaClock
                  className="text-cyan-300"
                />


                <span>
                  {clock}
                </span>


              </div>






              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  bg-white/10
                  px-4
                  py-3
                "
              >

                <FaHeartbeat
                  className={healthColor}
                />


                <span>

                  Fleet Status:

                  <strong className="ml-2">

                    {fleetStatus}

                  </strong>

                </span>


              </div>




            </div>


          </div>








          {/* RIGHT PANEL */}



          <div
            className="
              w-full
              max-w-md
              space-y-4
            "
          >





            {/* SEARCH */}


            <div className="relative">


              <FaSearch

                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "

              />



              <input

                value={search}

                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }


                placeholder="Search vehicles, drivers..."


                className="
                  w-full
                  rounded-2xl
                  bg-white
                  py-4
                  pl-12
                  pr-4
                  text-slate-700
                  outline-none
                  shadow-lg
                  focus:ring-4
                  focus:ring-cyan-300/30
                "

              />


            </div>









            {/* BUTTONS */}



            <div
              className="
                flex
                gap-3
              "
            >



              <button

                onClick={() =>
                  navigate("/alerts")
                }

                className="
                  relative
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/20
                  hover:bg-white/30
                "

              >

                <FaBell
                  className="text-xl"
                />



                {
                  totalAlerts > 0 &&

                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-full
                      bg-red-500
                      text-xs
                      font-bold
                    "
                  >

                    {totalAlerts}

                  </span>

                }


              </button>







              <button

                onClick={refreshHandler}

                disabled={refreshing}

                className="
                  flex-1
                  rounded-2xl
                  bg-cyan-500
                  font-semibold
                  hover:bg-cyan-400
                  disabled:opacity-50
                "

              >

                <span
                  className="
                    flex
                    items-center
                    justify-center
                    gap-3
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
                      "Refreshing..."
                      :
                      "Refresh"
                  }


                </span>


              </button>






              <button

                onClick={toggleTheme}

                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/20
                  hover:bg-white/30
                "

              >

                {
                  darkMode
                    ?
                    <FaSun className="text-yellow-300 text-xl" />
                    :
                    <FaMoon className="text-xl" />
                }


              </button>



            </div>





            {/* USER CARD */}


            <div
              className="
                flex
                items-center
                gap-3
                rounded-2xl
                bg-white/10
                px-4
                py-3
              "
            >

              <FaUserCircle
                className="
                  text-4xl
                  text-cyan-300
                "
              />


              <div>


                <h3 className="font-bold">

                  {user?.username || "Admin"}

                </h3>



                <p className="text-sm text-blue-100">

                  {user?.role || "Administrator"}

                </p>


              </div>


            </div>



          </div>



        </motion.div>

        {/* ================= QUICK INFO ================= */}


        <motion.div

          variants={itemVariants}

          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-3
          "

        >



          <InfoCard
            icon={<FaHeartbeat />}
            title="Fleet Health"
            value={`${fleetHealth}%`}
          />
          <InfoCard

            icon={<FaGasPump />}

            title="Fuel Consumed Today"

            value="640 L"

          />



          <InfoCard

            icon={<FaClock />}

            title="Last Synchronization"

            value={lastUpdated || "--"}

          />



        </motion.div>







        {/* ================= KPI CARDS ================= */}



        <motion.div

          variants={itemVariants}

          className="
            grid
            grid-cols-1
            gap-6
            sm:grid-cols-2
            xl:grid-cols-4
          "

        >



          <KPICard

            title="Total Vehicles"

            value={totalVehicles}

            icon={<FaTruck />}

            color="blue"

            trend={12}

          />




          <KPICard

            title="Active Vehicles"

            value={activeVehicles}

            icon={<FaCheckCircle />}

            color="green"

            trend={8}

          />




          <KPICard

            title="Maintenance Due"

            value={totalAlerts}

            icon={<FaTools />}

            color="orange"

            trend={-3}

          />




          <KPICard

            title="Drivers"

            value={totalDrivers}

            icon={<FaUserCircle />}

            color="cyan"

            trend={5}

          />



        </motion.div>






      </div>




      <div
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-3xl
          ring-1
          ring-white/10
        "
      />


    </motion.section>

  );

};








// ===============================
// Trend Badge
// ===============================


const TrendBadge = ({
  value = 0,
}: TrendBadgeProps) => {


  const positive =
    value >= 0;



  return (

    <div
      className={`
        flex
        items-center
        gap-1
        text-xs
        font-semibold

        ${positive
          ?
          "text-emerald-600"
          :
          "text-red-600"
        }
      `}
    >

      <FaArrowUp

        className={
          positive
            ?
            ""
            :
            "rotate-180"
        }

      />


      {Math.abs(value)}%

    </div>

  );

};









// ===============================
// Info Card
// ===============================


const InfoCard = memo(({

  icon,

  title,

  value,

}: InfoCardProps) => {


  return (

    <motion.div

      whileHover={{
        y: -5,
      }}

      className="
        rounded-2xl
        border
        border-white/10
        bg-white/10
        p-5
        backdrop-blur-xl
      "

    >


      <div
        className="
          flex
          items-center
          gap-4
        "
      >


        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-cyan-500/20
            text-3xl
            text-cyan-300
          "
        >

          {icon}

        </div>




        <div>


          <p
            className="
              text-sm
              text-blue-100
            "
          >

            {title}

          </p>




          <h3
            className="
              text-2xl
              font-black
            "
          >

            {value}

          </h3>



        </div>


      </div>


    </motion.div>

  );


});









// ===============================
// KPI Card
// ===============================


const KPICard = memo(({

  title,

  value,

  icon,

  color,

  trend = 0,

}: KPICardProps) => {


  return (

    <motion.div

      whileHover={{
        scale: 1.03,
      }}

      className="
        rounded-3xl
        bg-white
        p-6
        shadow-xl
      "

    >


      <div
        className="
          flex
          justify-between
          items-start
        "
      >



        <div>


          <p
            className="
              text-sm
              text-slate-500
            "
          >

            {title}

          </p>




          <h2
            className="
              mt-3
              text-4xl
              font-black
              text-slate-900
            "
          >

            {value}

          </h2>




          <div className="mt-3">


            <TrendBadge
              value={trend}
            />


          </div>



        </div>







        <div
          className={`
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            text-3xl

            ${color === "blue"
              ?
              "bg-blue-100 text-blue-600"
              :
              color === "green"
                ?
                "bg-emerald-100 text-emerald-600"
                :
                color === "orange"
                  ?
                  "bg-orange-100 text-orange-600"
                  :
                  "bg-cyan-100 text-cyan-600"
            }

          `}
        >

          {icon}


        </div>



      </div>



    </motion.div>

  );


});







export default DashboardHeader;