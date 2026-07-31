import StatCard from "../../components/Cards/StatCard";

import {
  FaTruck,
  FaUsers,
  FaRoute,
  FaBell,
} from "react-icons/fa";


const AdminDashboard = () => {


  return (

    <div className="
      min-h-screen
      bg-gray-100
      p-6
      space-y-6
    ">


      {/* Header */}

      <div className="
        bg-white
        rounded-xl
        shadow
        p-6
      ">

        <h1 className="
          text-3xl
          font-bold
          text-gray-800
        ">
          FleetDash Admin Dashboard
        </h1>


        <p className="
          text-gray-500
          mt-2
        ">
          Manage your fleet system from admin panel
        </p>


      </div>





      {/* Statistics */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
      ">


        <StatCard

          title="Total Vehicles"

          value={120}

          icon={<FaTruck />}

          color="text-blue-600"

          percentage="+8%"

        />



        <StatCard

          title="Total Drivers"

          value={45}

          icon={<FaUsers />}

          color="text-green-600"

          percentage="+5%"

        />



        <StatCard

          title="Total Trips"

          value={320}

          icon={<FaRoute />}

          color="text-purple-600"

          percentage="+12%"

        />



        <StatCard

          title="Alerts"

          value={15}

          icon={<FaBell />}

          color="text-red-600"

          percentage="-2%"

        />



      </div>






      {/* Admin Content */}


      <div className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
      ">


        <div className="
          bg-white
          rounded-xl
          shadow
          p-6
        ">

          <h2 className="
            text-xl
            font-semibold
            mb-4
          ">
            Fleet Overview
          </h2>


          <p className="text-gray-600">
            Vehicle, driver and trip management overview.
          </p>


        </div>





        <div className="
          bg-white
          rounded-xl
          shadow
          p-6
        ">

          <h2 className="
            text-xl
            font-semibold
            mb-4
          ">
            Recent Activities
          </h2>


          <p className="text-gray-600">
            Latest fleet updates will appear here.
          </p>


        </div>


      </div>



    </div>

  );

};


export default AdminDashboard;