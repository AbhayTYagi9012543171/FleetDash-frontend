import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "../../store/store";
import { registerUser } from "../../store/slice/authSlice";


const Register = () => {


const dispatch =
useDispatch<AppDispatch>();


const navigate =
useNavigate();



const [username,setUsername] =
useState("");

const [phoneNumber,setPhoneNumber] =
useState("");

const [email,setEmail] =
useState("");

const [password,setPassword] =
useState("");



const loading =
useSelector(
(state:RootState)=>state.auth.loading
);



const error =
useSelector(
(state:RootState)=>state.auth.error
);



const handleRegister =
async(e:React.FormEvent)=>{


e.preventDefault();


const result =
await dispatch(

registerUser({

username,
phoneNumber,
email,
password

})

);



if(registerUser.fulfilled.match(result)){

navigate("/login");

}


};



return (

<div className="min-h-screen bg-gray-100 flex items-center justify-center">


<div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">


<h1 className="text-3xl font-bold text-blue-600 text-center mb-6">

FleetDash Register

</h1>


<form
onSubmit={handleRegister}
className="space-y-4"
>


<input

type="text"

placeholder="Username"

value={username}

onChange={(e)=>setUsername(e.target.value)}

className="w-full border p-3 rounded-lg"

/>



<input

type="text"

placeholder="Phone Number"

value={phoneNumber}

onChange={(e)=>setPhoneNumber(e.target.value)}

className="w-full border p-3 rounded-lg"

/>



<input

type="email"

placeholder="Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

className="w-full border p-3 rounded-lg"

/>



<input

type="password"

placeholder="Password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

className="w-full border p-3 rounded-lg"

/>



{
error &&
<p className="text-red-500">
{error}
</p>
}



<button

disabled={loading}

className="w-full bg-blue-600 text-white p-3 rounded-lg"

>

{
loading
?
"Creating..."
:
"Register"
}


</button>



</form>


</div>


</div>


);


};


export default Register;