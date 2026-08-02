import {
  useEffect,
  useMemo,
  useState,
} from "react";


import {
  FiRefreshCw,
  FiTrash2,
  FiSearch,
  FiPlus,
  FiEdit,
  FiUsers,
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiX,
} from "react-icons/fi";


import toast from "react-hot-toast";

import { api } from "../../services/api";





interface User {

  _id:string;

  username:string;

  phoneNumber:string;

  email:string;

  role:string;

  status:string;

}






interface UserForm {


username:string;

phoneNumber:string;

email:string;

role:string;

status:string;

}





const initialForm:UserForm={


username:"",

phoneNumber:"",

email:"",

role:"Driver",

status:"Active",

};









const Users=()=>{



const [users,setUsers]=
useState<User[]>([]);



const [loading,setLoading]=
useState(false);



const [saving,setSaving]=
useState(false);



const [search,setSearch]=
useState("");



const [role,setRole]=
useState("All");



const [showModal,setShowModal]=
useState(false);



const [editId,setEditId]=
useState<string|null>(null);



const [form,setForm]=
useState<UserForm>(
initialForm
);









// ================= FETCH USERS =================



const fetchUsers=async()=>{


try{


setLoading(true);



const response=
await api.get("/users");



if(response.data?.success){

setUsers(
response.data.users
);

}

else if(Array.isArray(response.data)){

setUsers(response.data);

}


}

catch(error){


console.error(error);


toast.error(
"Failed to load users"
);


}

finally{


setLoading(false);


}


};









useEffect(()=>{


fetchUsers();


},[]);









// ================= FILTER =================



const filteredUsers=
useMemo(()=>{


return users.filter((user)=>{


const searchMatch=

user.username
.toLowerCase()
.includes(
search.toLowerCase()
)

||
user.email
.toLowerCase()
.includes(
search.toLowerCase()
);



const roleMatch=

role==="All"
||
user.role===role;



return searchMatch && roleMatch;



});


},[users,search,role]);











// ================= SAVE USER =================



const saveUser=async()=>{


try{


setSaving(true);



if(editId){



await api.put(

`/users/${editId}`,

form

);



toast.success(
"User updated"
);



}

else{


await api.post(

"/users",

form

);



toast.success(
"User created"
);



}



setShowModal(false);

setEditId(null);

setForm(initialForm);


fetchUsers();



}

catch(error){


console.error(error);


toast.error(
"Operation failed"
);



}

finally{


setSaving(false);


}



};











const editUser=(user:User)=>{


setEditId(
user._id
);



setForm({

username:user.username,

phoneNumber:user.phoneNumber,

email:user.email,

role:user.role,

status:user.status,

});


setShowModal(true);


};











// ================= DELETE =================



const deleteUser=async(id:string)=>{


const confirmDelete=
window.confirm(
"Delete this user?"
);



if(!confirmDelete)
return;



try{


await api.delete(
`/users/${id}`
);



toast.success(
"User deleted"
);



fetchUsers();



}

catch(error){


console.error(error);


toast.error(
"Delete failed"
);


}



};









return (


<div className="space-y-6">







{/* HEADER */}



<div className="
flex
justify-between
items-center
">


<div>


<h1 className="
text-3xl
font-bold
text-gray-800
">

Users Management

</h1>


<p className="
text-gray-500
">

Manage FleetDash users and permissions

</p>


</div>






<div className="
flex
gap-3
">


<button

onClick={fetchUsers}

className="
bg-blue-600
text-white
px-4
py-2
rounded-lg
flex
gap-2
items-center
"

>

<FiRefreshCw
className={
loading
?
"animate-spin"
:
""
}
/>


Refresh

</button>





<button

onClick={()=>{

setEditId(null);

setForm(initialForm);

setShowModal(true);

}}

className="
bg-green-600
text-white
px-4
py-2
rounded-lg
flex
gap-2
items-center
"

>

<FiPlus/>

Add User

</button>



</div>



</div>









{/* STATS */}



<div className="
grid
grid-cols-1
md:grid-cols-4
gap-5
">


<Card

icon={<FiUsers/>}

title="Total Users"

value={users.length}

/>


<Card

icon={<FiShield/>}

title="Admins"

value={
users.filter(
u=>u.role==="Admin"
).length
}

/>


<Card

icon={<FiCheckCircle/>}

title="Active"

value={
users.filter(
u=>u.status==="Active"
).length
}

/>


<Card

icon={<FiXCircle/>}

title="Inactive"

value={
users.filter(
u=>u.status!=="Active"
).length
}

/>



</div>









{/* FILTER */}



<div className="
bg-white
shadow
rounded-xl
p-5
flex
gap-4
">


<div className="
flex
items-center
border
rounded-lg
px-3
flex-1
">


<FiSearch/>


<input

className="
w-full
p-3
outline-none
"

placeholder="Search user..."

value={search}

onChange={
e=>setSearch(
e.target.value
)
}

/>


</div>





<select

className="
border
rounded-lg
px-4
"

value={role}

onChange={
e=>setRole(
e.target.value
)
}

>


<option>
All
</option>


<option>
Admin
</option>


<option>
Manager
</option>


<option>
Driver
</option>


</select>


</div>









{/* TABLE */}



<div className="
bg-white
shadow
rounded-xl
overflow-hidden
">


<table className="
w-full
">


<thead className="
bg-gray-100
">


<tr>


<th className="p-3 text-left">
Name
</th>


<th className="p-3 text-left">
Email
</th>


<th className="p-3 text-left">
Phone
</th>


<th className="p-3 text-left">
Role
</th>


<th className="p-3 text-left">
Status
</th>


<th className="p-3">
Action
</th>


</tr>


</thead>







<tbody>


{
loading
?

<tr>

<td
colSpan={6}
className="p-5 text-center"
>

Loading...

</td>

</tr>


:


filteredUsers.map(user=>(


<tr
key={user._id}
className="
border-t
hover:bg-gray-50
"
>


<td className="p-3 font-medium">

{user.username}

</td>


<td className="p-3">

{user.email}

</td>


<td className="p-3">

{user.phoneNumber}

</td>


<td className="p-3">


<span className="
bg-blue-100
text-blue-700
px-3
py-1
rounded-full
text-sm
">

{user.role}

</span>


</td>



<td className="p-3">


<span className={`
px-3
py-1
rounded-full
text-sm

${
user.status==="Active"
?
"bg-green-100 text-green-700"
:
"bg-red-100 text-red-700"
}

`}>

{user.status}

</span>


</td>




<td className="
p-3
flex
gap-3
">


<button

onClick={()=>editUser(user)}

className="
text-blue-600
"

>

<FiEdit/>

</button>




<button

onClick={()=>deleteUser(user._id)}

className="
text-red-600
"

>

<FiTrash2/>

</button>



</td>



</tr>


))


}



</tbody>



</table>


</div>









{/* MODAL */}



{
showModal &&


<div className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
">


<div className="
bg-white
rounded-xl
p-6
w-full
max-w-md
space-y-4
">



<div className="
flex
justify-between
">


<h2 className="
text-xl
font-bold
">

{
editId
?
"Edit User"
:
"Add User"
}

</h2>


<button

onClick={()=>setShowModal(false)}

>

<FiX/>

</button>


</div>





{
Object.keys(form).map((key)=>(


<input

key={key}

className="
border
p-3
rounded-lg
w-full
"

placeholder={key}

value={
(form as any)[key]
}

onChange={
e=>
setForm({

...form,

[key]:
e.target.value

})

}

/>


))

}






<button

disabled={saving}

onClick={saveUser}

className="
bg-blue-600
text-white
w-full
py-3
rounded-lg
"

>


{
saving
?
"Saving..."
:
"Save User"
}


</button>



</div>


</div>


}



</div>


);


};









const Card=({

icon,

title,

value

}:{

icon:React.ReactNode;

title:string;

value:number;

})=>(


<div className="
bg-white
shadow
rounded-xl
p-5
flex
gap-4
items-center
">


<div className="
text-blue-600
text-3xl
">

{icon}

</div>


<div>


<p className="
text-gray-500
">

{title}

</p>


<h2 className="
text-3xl
font-bold
">

{value}

</h2>


</div>


</div>


);







export default Users;