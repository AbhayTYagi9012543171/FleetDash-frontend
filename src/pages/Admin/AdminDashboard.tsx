import {
  useEffect,
  useState,
} from "react";

import {
  api,
} from "../../services/api";


import StatCard from "../../components/Cards/StatCard";


import {
  FaTruck,
  FaUsers,
  FaRoute,
  FaBell,
  FaSyncAlt,
} from "react-icons/fa";





interface DashboardData {

  totalVehicles:number;

  totalDrivers:number;

  totalTrips:number;

  totalAlerts:number;

}






const AdminDashboard = ()=>{



const [data,setData]
=
useState<DashboardData>({

totalVehicles:0,

totalDrivers:0,

totalTrips:0,

totalAlerts:0,

});




const [loading,setLoading]
=
useState(true);



const [refreshing,setRefreshing]
=
useState(false);



const [error,setError]
=
useState("");










// =======================
// Fetch Dashboard Data
// =======================


const fetchDashboard =
async()=>{


try{


setError("");



const response =
await api.get("/dashboard");



console.log(
"Dashboard:",
response.data
);




const dashboard =

response.data.data ||

response.data.dashboard ||

response.data;





setData({

totalVehicles:
dashboard.totalVehicles ||
dashboard.vehicles ||
0,


totalDrivers:
dashboard.totalDrivers ||
dashboard.drivers ||
0,


totalTrips:
dashboard.totalTrips ||
dashboard.trips ||
0,


totalAlerts:
dashboard.totalAlerts ||
dashboard.alerts ||
0,


});



}

catch(error)
{


console.error(error);


setError(
"Unable to load dashboard"
);


}

finally{


setLoading(false);


}



};









useEffect(()=>{


fetchDashboard();



},[]);









const handleRefresh =
async()=>{


setRefreshing(true);


await fetchDashboard();


setRefreshing(false);



};









return (


<div className="
min-h-screen
bg-gray-100
p-4
sm:p-6
space-y-6
">







{/* Header */}



<div className="
bg-white
rounded-xl
shadow
p-6
flex
justify-between
items-center
">


<div>


<h1 className="
text-2xl
sm:text-3xl
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





<button


onClick={handleRefresh}


disabled={refreshing}


className="
bg-blue-600
text-white
px-4
py-2
rounded-lg
flex
items-center
gap-2
disabled:opacity-50
"


>


<FaSyncAlt

className={
  refreshing
    ? "animate-spin"
    : ""
}

/>


Refresh


</button>




</div>








{
error &&


<div className="
bg-red-100
text-red-700
p-3
rounded-lg
">

{error}

</div>


}









{/* Stats */}



<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-4
gap-6
">







<StatCard


title="Total Vehicles"


value={
loading
?
"..."
:
data.totalVehicles
}


icon={
<FaTruck/>
}


color="
text-blue-600
"


percentage="+8%"


/>








<StatCard


title="Total Drivers"


value={
loading
?
"..."
:
data.totalDrivers
}


icon={
<FaUsers/>
}


color="
text-green-600
"


percentage="+5%"


/>








<StatCard


title="Total Trips"


value={
loading
?
"..."
:
data.totalTrips
}


icon={
<FaRoute/>
}


color="
text-purple-600
"


percentage="+12%"


/>








<StatCard


title="Alerts"


value={
loading
?
"..."
:
data.totalAlerts
}


icon={
<FaBell/>
}


color="
text-red-600
"


percentage="-2%"


/>





</div>









{/* Dashboard Sections */}



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



<div className="
space-y-3
text-gray-600
">


<p>
🚚 Vehicles:
{" "}
<strong>
{data.totalVehicles}
</strong>
</p>


<p>
👨‍✈️ Drivers:
{" "}
<strong>
{data.totalDrivers}
</strong>
</p>


<p>
🛣 Trips:
{" "}
<strong>
{data.totalTrips}
</strong>
</p>


</div>



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




<p className="
text-gray-500
">

Latest fleet updates will appear here.

</p>



</div>






</div>







</div>


);



};



export default AdminDashboard;