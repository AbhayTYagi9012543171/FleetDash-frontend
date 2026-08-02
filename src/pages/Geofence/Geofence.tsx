import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiMapPin,
  FiPlus,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";


import { api } from "../../services/api";

import AddGeofenceModal from "../../components/geofence/AddGeofenceModal";



// ==========================
// Interface
// ==========================

interface Geofence {

  _id:string;

  name:string;

  center:{
    latitude:number;
    longitude:number;
  };

  radius:number;

  createdAt?:string;

}




const Geofence =()=>{


const [
geofences,
setGeofences
]
=
useState<Geofence[]>([]);



const [
loading,
setLoading
]
=
useState(false);



const [
search,
setSearch
]
=
useState("");



const [
openModal,
setOpenModal
]
=
useState(false);





// ==========================
// Fetch Geofence
// ==========================


const fetchGeofences = async()=>{


try{


setLoading(true);



const response =
await api.get("/geofences");



console.log(
"Geofence Response:",
response.data
);



let data:Geofence[]=[];



if(
Array.isArray(response.data.geofences)
){

data =
response.data.geofences;

}

else if(
Array.isArray(response.data.data)
){

data =
response.data.data;

}

else if(
Array.isArray(response.data)
){

data =
response.data;

}



setGeofences(data);



}

catch(error:any){


console.error(
"Geofence Error:",
error.response?.data ||
error.message
);



setGeofences([]);



}

finally{


setLoading(false);


}


};






useEffect(()=>{

fetchGeofences();

},[]);








// ==========================
// Search Filter
// ==========================


const filteredGeofences =

useMemo(()=>{


return geofences.filter(
(item)=>

item.name
.toLowerCase()
.includes(
search.toLowerCase()
)

);


},[
geofences,
search
]);






// ==========================
// Stats
// ==========================


const total =
geofences.length;


const averageRadius =

geofences.length

?

Math.round(

geofences.reduce(
(sum,item)=>
sum + item.radius,
0
)
/
geofences.length

)

:

0;






return (


<div className="space-y-6">



{/* Header */}


<div className="
flex
flex-col
md:flex-row
justify-between
gap-4
">



<div>


<h1 className="
text-3xl
font-bold
text-gray-800
">

Geofence Management

</h1>


<p className="
text-gray-500
mt-1
">

Create and monitor vehicle restricted areas.

</p>


</div>






<div className="
flex
gap-3
">


<button

onClick={fetchGeofences}

className="
bg-blue-600
hover:bg-blue-700
text-white
px-5
py-2
rounded-lg
flex
items-center
gap-2
"

>


<FiRefreshCw/>

Refresh

</button>




<button

onClick={()=>
setOpenModal(true)
}

className="
bg-green-600
hover:bg-green-700
text-white
px-5
py-2
rounded-lg
flex
items-center
gap-2
"

>


<FiPlus/>

Add Geofence

</button>



</div>



</div>









{/* Stats */}


<div className="
grid
grid-cols-1
md:grid-cols-2
gap-5
">



<div className="
bg-white
shadow
rounded-xl
p-5
flex
items-center
gap-4
">


<div className="
bg-blue-100
text-blue-600
p-4
rounded-full
">

<FiMapPin size={25}/>

</div>


<div>

<p className="text-gray-500">

Total Geofences

</p>


<h2 className="
text-3xl
font-bold
">

{total}

</h2>


</div>


</div>





<div className="
bg-white
shadow
rounded-xl
p-5
">


<p className="text-gray-500">

Average Radius

</p>


<h2 className="
text-3xl
font-bold
">

{averageRadius} m

</h2>


</div>



</div>









{/* Search */}



<div className="
bg-white
rounded-xl
shadow
p-4
flex
items-center
gap-3
">


<FiSearch/>


<input

placeholder="Search geofence..."

value={search}

onChange={
(e)=>
setSearch(e.target.value)
}

className="
w-full
outline-none
"

/>


</div>









{/* Table */}



<div className="
bg-white
rounded-xl
shadow
overflow-hidden
">



<table className="
min-w-full
">


<thead className="
bg-gray-100
">


<tr>


<th className="p-4 text-left">

Name

</th>


<th className="p-4 text-left">

Latitude

</th>


<th className="p-4 text-left">

Longitude

</th>


<th className="p-4 text-left">

Radius

</th>


</tr>


</thead>





<tbody>



{
loading &&

<tr>

<td
colSpan={4}
className="
text-center
p-6
"
>

Loading geofences...

</td>

</tr>

}





{
!loading &&
filteredGeofences.length===0 &&

<tr>

<td
colSpan={4}
className="
text-center
p-6
text-gray-500
"
>

No geofence found.

</td>

</tr>

}





{
filteredGeofences.map(
(item)=>(


<tr

key={item._id}

className="
border-t
hover:bg-gray-50
"

>


<td className="
p-4
font-semibold
">

{item.name}

</td>



<td className="p-4">

{item.center.latitude}

</td>



<td className="p-4">

{item.center.longitude}

</td>



<td className="p-4">

{item.radius} m

</td>



</tr>



)

)

}





</tbody>


</table>



</div>









<AddGeofenceModal

isOpen={openModal}

onClose={()=>
setOpenModal(false)
}

onSuccess={()=>{

setOpenModal(false);

fetchGeofences();

}}

/>





</div>


);


};



export default Geofence;