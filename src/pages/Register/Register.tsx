import { useState } from "react";

import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  useNavigate
} from "react-router-dom";


import toast from "react-hot-toast";


import type {
  AppDispatch,
  RootState
} from "../../store/store";


import {
  registerUser
} from "../../store/slice/authSlice";



const Register =()=>{


const dispatch =
useDispatch<AppDispatch>();


const navigate =
useNavigate();



const [username,setUsername]=
useState("");


const [phoneNumber,setPhoneNumber]=
useState("");


const [email,setEmail]=
useState("");


const [password,setPassword]=
useState("");


const [confirmPassword,setConfirmPassword]=
useState("");


const [showPassword,setShowPassword]=
useState(false);



const loading =
useSelector(
(state:RootState)=>
state.auth.loading
);



const error =
useSelector(
(state:RootState)=>
state.auth.error
);





const handleRegister =
async(e:React.FormEvent)=>{


e.preventDefault();



if(password !== confirmPassword){

toast.error(
"Passwords do not match"
);

return;

}



try{


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


toast.success(
"Registration Successful 🎉"
);


navigate("/login");


}

else{


toast.error(
"Registration Failed"
);


}



}

catch(error){

toast.error(
"Something went wrong"
);

}



};






return(

<div className="
min-h-screen
bg-gray-100
flex
items-center
justify-center
px-4
">


<div className="
bg-white
shadow-xl
rounded-2xl
p-8
w-full
max-w-md
">



<h1 className="
text-3xl
font-bold
text-blue-600
text-center
">

FleetDash

</h1>


<p className="
text-center
text-gray-500
mb-6
">

Create your account

</p>





<form
onSubmit={handleRegister}
className="space-y-4"
>





<div className="flex items-center border rounded-lg px-3">

<FaUser className="text-gray-400"/>

<input

className="
w-full
p-3
outline-none
"

placeholder="Username"

value={username}

onChange={
e=>setUsername(e.target.value)
}

/>

</div>






<div className="flex items-center border rounded-lg px-3">


<FaPhone className="text-gray-400"/>


<input

className="
w-full
p-3
outline-none
"

placeholder="Phone Number"

value={phoneNumber}

onChange={
e=>setPhoneNumber(e.target.value)
}

/>


</div>







<div className="flex items-center border rounded-lg px-3">


<FaEnvelope className="text-gray-400"/>


<input

type="email"

className="
w-full
p-3
outline-none
"

placeholder="Email"

value={email}

onChange={
e=>setEmail(e.target.value)
}

/>


</div>







<div className="flex items-center border rounded-lg px-3">


<FaLock className="text-gray-400"/>


<input

type={
showPassword
?
"text"
:
"password"
}


className="
w-full
p-3
outline-none
"


placeholder="Password"


value={password}


onChange={
e=>setPassword(e.target.value)
}


/>


<button

type="button"

onClick={()=>
setShowPassword(!showPassword)
}

>

{
showPassword
?
<FaEyeSlash/>
:
<FaEye/>
}

</button>


</div>







<div className="flex items-center border rounded-lg px-3">


<FaLock className="text-gray-400"/>


<input


type="password"


className="
w-full
p-3
outline-none
"


placeholder="Confirm Password"


value={confirmPassword}


onChange={
e=>setConfirmPassword(e.target.value)
}


/>


</div>








{
error &&

<p className="
text-red-500
text-sm
">

{error}

</p>

}








<button

disabled={loading}

className="
w-full
bg-blue-600
hover:bg-blue-700
text-white
py-3
rounded-lg
font-semibold
transition
"

>


{
loading
?
"Creating Account..."
:
"Register"
}


</button>






<p className="
text-center
text-gray-500
">

Already have account?


<button

type="button"

onClick={()=>
navigate("/login")
}

className="
text-blue-600
ml-2
font-semibold
"

>

Login

</button>


</p>





</form>



</div>


</div>


);


};


export default Register;