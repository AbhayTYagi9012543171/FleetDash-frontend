import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";


import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaIdCard,
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";


import {
  fetchDrivers,
  addDriver,
} from "../../store/slice/driverSlice";


import type {
  RootState,
  AppDispatch,
} from "../../store/store";


import {
  api,
} from "../../services/api";




// ==========================
// Interface
// ==========================


interface DriverForm {

  _id?:string;

  fullName:string;

  email:string;

  phoneNumber:string;

  licenseNumber:string;

  address:string;

  experience:number;

  status:string;

}




const Drivers =()=>{


const dispatch =
useDispatch<AppDispatch>();



const {
 drivers=[],
 loading,
}
=
useSelector(
(state:RootState)=>
state.drivers
);





// ==========================
// States
// ==========================


const [
search,
setSearch
]
=
useState("");



const [
showAddModal,
setShowAddModal
]
=
useState(false);



const [
showViewModal,
setShowViewModal
]
=
useState(false);



const [
showEditModal,
setShowEditModal
]
=
useState(false);



const [
showDeleteModal,
setShowDeleteModal
]
=
useState(false);




const [
selectedDriver,
setSelectedDriver
]
=
useState<DriverForm|null>(null);





const [
formData,
setFormData
]
=
useState<DriverForm>({

fullName:"",

email:"",

phoneNumber:"",

licenseNumber:"",

address:"",

experience:0,

status:"Available"

});







// ==========================
// Fetch Drivers
// ==========================


useEffect(()=>{


dispatch(fetchDrivers());


},[dispatch]);







// ==========================
// Search
// ==========================


const filteredDrivers =
useMemo(()=>{


return drivers.filter(
(driver:any)=>

driver.fullName
?.toLowerCase()
.includes(
search.toLowerCase()
)

);


},[
drivers,
search
]);








// ==========================
// Add Driver
// ==========================


const handleAddDriver =
async()=>{


try{


await dispatch(
addDriver(formData)
).unwrap();



alert(
"Driver Added Successfully"
);



dispatch(
fetchDrivers()
);



setShowAddModal(false);



setFormData({

fullName:"",

email:"",

phoneNumber:"",

licenseNumber:"",

address:"",

experience:0,

status:"Available"

});


}

catch(error:any){


alert(
error?.message ||
"Failed to add driver"
);


}


};








// ==========================
// Edit Open
// ==========================


const handleEditDriver =
(driver:DriverForm)=>{


setSelectedDriver(driver);



setFormData({

_id:driver._id,

fullName:
driver.fullName,

email:
driver.email,

phoneNumber:
driver.phoneNumber,

licenseNumber:
driver.licenseNumber,

address:
driver.address,

experience:
driver.experience,

status:
driver.status

});



setShowEditModal(true);


};







// ==========================
// Update Driver
// ==========================


const handleUpdateDriver =
async()=>{


try{


if(!selectedDriver?._id)
return;



await api.put(

`/drivers/${selectedDriver._id}`,

formData

);



alert(
"Driver Updated Successfully"
);



dispatch(
fetchDrivers()
);



setShowEditModal(false);



}

catch(error:any){


console.error(
error
);



alert(
"Update Failed"
);


}


};








// ==========================
// Delete Open
// ==========================


const openDeleteModal =
(driver:DriverForm)=>{


setSelectedDriver(driver);


setShowDeleteModal(true);


};






// ==========================
// Delete Driver
// ==========================


const handleDeleteDriver =
async()=>{


try{


if(!selectedDriver?._id)
return;



await api.delete(

`/drivers/${selectedDriver._id}`

);



alert(
"Driver Deleted Successfully"
);



dispatch(
fetchDrivers()
);



setShowDeleteModal(false);



setSelectedDriver(null);



}

catch(error:any){


console.error(error);



alert(
"Delete Failed"
);


}


};
// ==========================
// Statistics
// ==========================


const stats = [

{
title:"Total Drivers",

value:drivers.length,

icon:<FaUsers size={28}/>,

bg:"bg-blue-100",

color:"text-blue-600"

},


{
title:"Available",

value:drivers.filter(
(d:any)=>
d.status==="Available"
).length,

icon:<FaUserCheck size={28}/>,

bg:"bg-green-100",

color:"text-green-600"

},


{
title:"On Trip",

value:drivers.filter(
(d:any)=>
d.status==="On Trip"
).length,

icon:<FaUserClock size={28}/>,

bg:"bg-yellow-100",

color:"text-yellow-600"

},


{
title:"Licensed",

value:drivers.filter(
(d:any)=>
d.licenseStatus==="Licensed"
).length,

icon:<FaIdCard size={28}/>,

bg:"bg-purple-100",

color:"text-purple-600"

}

];






// ==========================
// Input Change
// ==========================


const handleInputChange = (

e:React.ChangeEvent<
HTMLInputElement |
HTMLSelectElement
>

)=>{


setFormData({

...formData,

[e.target.name]:

e.target.name==="experience"

?

Number(e.target.value)

:

e.target.value

});


};







return (

<div className="space-y-8">



{/* ================= HEADER ================= */}


<div className="
flex
flex-col
lg:flex-row
justify-between
items-center
gap-5
">


<div>

<h1 className="
text-3xl
font-bold
text-gray-800
">

Driver Management

</h1>


<p className="
text-gray-500
mt-1
">

Manage all fleet drivers from one place.

</p>


</div>






<div className="flex gap-3">


<div className="relative">


<FaSearch

className="
absolute
left-3
top-3
text-gray-400
"

/>



<input

type="text"

placeholder="Search Driver..."

value={search}

onChange={
(e)=>setSearch(
e.target.value
)
}

className="
pl-10
pr-4
py-2
border
rounded-lg
w-72
outline-none
focus:ring-2
focus:ring-blue-500
"

/>



</div>





<button

onClick={
()=>setShowAddModal(true)
}

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


<FaPlus/>

Add Driver


</button>



</div>



</div>









{/* ================= STATS ================= */}


<div className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-4
gap-6
">


{

stats.map(
(item,index)=>(


<div

key={index}

className="
bg-white
rounded-xl
shadow
p-5
flex
justify-between
items-center
"

>


<div>

<p className="
text-gray-500
text-sm
">

{item.title}

</p>


<h2 className="
text-3xl
font-bold
mt-2
">

{item.value}

</h2>


</div>




<div

className={`
${item.bg}
${item.color}
p-4
rounded-full
`}

>

{item.icon}


</div>



</div>


)

)


}


</div>









{/* ================= TABLE ================= */}



<div className="
bg-white
rounded-xl
shadow
overflow-hidden
">


<div className="
overflow-x-auto
">


<table className="
min-w-full
">


<thead className="
bg-gray-100
">


<tr>


<th className="
px-6
py-3
text-left
">

Driver

</th>



<th className="
px-6
py-3
text-left
">

Phone

</th>



<th className="
px-6
py-3
text-left
">

License

</th>



<th className="
px-6
py-3
text-left
">

Experience

</th>



<th className="
px-6
py-3
text-left
">

Status

</th>



<th className="
px-6
py-3
text-center
">

Action

</th>



</tr>


</thead>







<tbody>



{
loading &&

<tr>

<td

colSpan={6}

className="
text-center
py-8
"

>

Loading Drivers...

</td>

</tr>

}





{

!loading &&

filteredDrivers.length===0 &&


<tr>

<td

colSpan={6}

className="
text-center
py-8
text-gray-500
"

>

No Drivers Found

</td>


</tr>


}








{

filteredDrivers.map(

(driver:any)=>(


<tr

key={driver._id}

className="
border-t
hover:bg-gray-50
"

>


<td className="
px-6
py-4
">


<p className="font-semibold">

{driver.fullName}

</p>


<p className="
text-sm
text-gray-500
">

{driver.email}

</p>



</td>







<td className="px-6 py-4">

{driver.phoneNumber}

</td>





<td className="px-6 py-4">

{driver.licenseNumber}

</td>





<td className="px-6 py-4">

{driver.experience} Years

</td>





<td className="px-6 py-4">


<span

className={`

px-3
py-1
rounded-full
text-sm

${

driver.status==="Available"

?

"bg-green-100 text-green-700"

:

driver.status==="On Trip"

?

"bg-yellow-100 text-yellow-700"

:

"bg-red-100 text-red-700"

}

`}

>

{driver.status}

</span>



</td>








<td className="
px-6
py-4
">


<div className="
flex
justify-center
gap-4
">



<button

onClick={()=>{

setSelectedDriver(driver);

setShowViewModal(true);

}}

className="
text-blue-600
"

>

<FaEye/>

</button>





<button

onClick={()=>handleEditDriver(driver)}

className="
text-green-600
"

>

<FaEdit/>

</button>






<button

onClick={()=>openDeleteModal(driver)}

className="
text-red-600
"

>

<FaTrash/>

</button>





</div>


</td>




</tr>



)


)

}



</tbody>



</table>



</div>


</div>
{/* ================= ADD DRIVER MODAL ================= */}

{
showAddModal && (

<div className="
fixed
inset-0
bg-black/50
flex
items-center
justify-center
z-50
">

<div className="
bg-white
rounded-xl
p-6
w-full
max-w-2xl
">


<h2 className="
text-2xl
font-bold
mb-5
">
Add Driver
</h2>



<div className="
grid
grid-cols-2
gap-4
">


<input
name="fullName"
placeholder="Full Name"
value={formData.fullName}
onChange={handleInputChange}
className="border p-3 rounded-lg"
/>



<input
name="email"
placeholder="Email"
value={formData.email}
onChange={handleInputChange}
className="border p-3 rounded-lg"
/>



<input
name="phoneNumber"
placeholder="Phone Number"
value={formData.phoneNumber}
onChange={handleInputChange}
className="border p-3 rounded-lg"
/>



<input
name="licenseNumber"
placeholder="License Number"
value={formData.licenseNumber}
onChange={handleInputChange}
className="border p-3 rounded-lg"
/>



<input
type="number"
name="experience"
placeholder="Experience"
value={formData.experience}
onChange={handleInputChange}
className="border p-3 rounded-lg"
/>



<select
name="status"
value={formData.status}
onChange={handleInputChange}
className="border p-3 rounded-lg"
>

<option>
Available
</option>

<option>
On Trip
</option>

<option>
Inactive
</option>

</select>



<textarea

name="address"

placeholder="Address"

value={formData.address}

onChange={(e)=>
setFormData({
...formData,
address:e.target.value
})
}

className="
border
p-3
rounded-lg
col-span-2
"

/>


</div>



<div className="
flex
justify-end
gap-3
mt-6
">


<button

onClick={()=>setShowAddModal(false)}

className="
border
px-5
py-2
rounded-lg
"

>
Cancel
</button>



<button

onClick={handleAddDriver}

className="
bg-blue-600
text-white
px-6
py-2
rounded-lg
"

>
Save
</button>



</div>


</div>

</div>

)

}





{/* ================= VIEW MODAL ================= */}


{
showViewModal &&
selectedDriver &&

(

<div className="
fixed
inset-0
bg-black/50
flex
items-center
justify-center
z-50
">


<div className="
bg-white
rounded-xl
p-6
w-full
max-w-md
">


<h2 className="text-xl font-bold mb-4">
Driver Details
</h2>



<p>
<b>Name:</b> {selectedDriver.fullName}
</p>

<p>
<b>Email:</b> {selectedDriver.email}
</p>

<p>
<b>Phone:</b> {selectedDriver.phoneNumber}
</p>

<p>
<b>License:</b> {selectedDriver.licenseNumber}
</p>

<p>
<b>Status:</b> {selectedDriver.status}
</p>

<p>
<b>Address:</b> {selectedDriver.address}
</p>



<button

onClick={()=>setShowViewModal(false)}

className="
mt-5
bg-blue-600
text-white
px-5
py-2
rounded-lg
"

>
Close
</button>



</div>


</div>

)

}





{/* ================= EDIT MODAL ================= */}


{
showEditModal &&

(

<div className="
fixed
inset-0
bg-black/50
flex
items-center
justify-center
z-50
">


<div className="
bg-white
rounded-xl
p-6
w-full
max-w-xl
">


<h2 className="text-xl font-bold mb-4">
Update Driver
</h2>


<input
name="fullName"
value={formData.fullName}
onChange={handleInputChange}
className="border p-3 w-full mb-3 rounded"
/>



<input
name="email"
value={formData.email}
onChange={handleInputChange}
className="border p-3 w-full mb-3 rounded"
/>



<input
name="phoneNumber"
value={formData.phoneNumber}
onChange={handleInputChange}
className="border p-3 w-full mb-3 rounded"
/>



<select
name="status"
value={formData.status}
onChange={handleInputChange}
className="border p-3 w-full rounded"
>

<option>
Available
</option>

<option>
On Trip
</option>

<option>
Inactive
</option>

</select>



<div className="flex justify-end gap-3 mt-5">


<button

onClick={()=>setShowEditModal(false)}

className="border px-5 py-2 rounded"

>
Cancel
</button>



<button

onClick={handleUpdateDriver}

className="
bg-green-600
text-white
px-5
py-2
rounded
"

>
Update
</button>


</div>



</div>

</div>


)

}





{/* ================= DELETE MODAL ================= */}


{
showDeleteModal &&
selectedDriver &&

(

<div className="
fixed
inset-0
bg-black/50
flex
items-center
justify-center
z-50
">


<div className="
bg-white
p-6
rounded-xl
">


<h2 className="text-xl font-bold">
Delete Driver?
</h2>


<p className="mt-3">

Are you sure to delete

<b>
{" "}
{selectedDriver.fullName}
</b>

?

</p>



<div className="
flex
justify-end
gap-3
mt-5
">


<button

onClick={()=>setShowDeleteModal(false)}

className="border px-5 py-2 rounded"

>
Cancel
</button>



<button

onClick={handleDeleteDriver}

className="
bg-red-600
text-white
px-5
py-2
rounded
"

>
Delete
</button>


</div>


</div>


</div>


)

}


</div>

);

};


export default Drivers;