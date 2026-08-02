import {
  useState
} from "react";


import toast from "react-hot-toast";


import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaTruck,
} from "react-icons/fa";


import {
  useDispatch,
  useSelector
} from "react-redux";


import {
  loginUser
} from "../../store/slice/authSlice";


import {
  useNavigate,
  useLocation
} from "react-router-dom";


import type {
  AppDispatch,
  RootState
} from "../../store/store";






const Login =()=>{


const dispatch =
useDispatch<AppDispatch>();



const navigate =
useNavigate();


const location =
useLocation();



const redirectPath =
(location.state as any)
?.from
?.pathname
||
"/dashboard";







const [email,setEmail]
=
useState("");



const [password,setPassword]
=
useState("");



const [
showPassword,
setShowPassword
]
=
useState(false);



const [
remember,
setRemember
]
=
useState(false);







const {
loading,
error
}
=
useSelector(
(state:RootState)=>
state.auth
);









// ==========================
// Login
// ==========================


const handleLogin =
async(
e:React.FormEvent
)=>{


e.preventDefault();




if(!email || !password){


toast.error(
"Please enter email and password"
);


return;


}






try{


const result =
await dispatch(

loginUser({

email,

password

})

);






if(
loginUser.fulfilled.match(result)
){



toast.success(
"Welcome to FleetDash 🚚"
);





if(remember){


localStorage.setItem(
"rememberEmail",
email
);


}






navigate(
redirectPath,
{
replace:true
}
);




}

else{


toast.error(
result.payload as string
||
"Invalid credentials"
);


}



}

catch(error){


toast.error(
"Login failed"
);


}



};









return (



<div className="
min-h-screen
bg-gradient-to-br
from-blue-50
to-gray-100
flex
items-center
justify-center
px-4
">





<div className="
w-full
max-w-md
bg-white
rounded-2xl
shadow-xl
p-8
">







{/* Logo */}


<div className="
text-center
mb-8
">


<div className="
flex
justify-center
mb-3
">


<div className="
bg-blue-600
text-white
p-4
rounded-full
">

<FaTruck
size={30}
/>


</div>


</div>





<h1 className="
text-4xl
font-bold
text-blue-600
">

FleetDash

</h1>



<p className="
text-gray-500
mt-2
">

Fleet Management System

</p>



</div>









<form

onSubmit={handleLogin}

className="
space-y-5
"

>






{/* EMAIL */}



<div>


<label className="
font-medium
">

Email

</label>



<div className="
flex
items-center
border
rounded-lg
mt-2
px-3
">


<FaEnvelope
className="
text-gray-400
"
/>



<input


type="email"


value={email}


onChange={
e=>setEmail(
e.target.value
)
}


placeholder="
admin@example.com
"


className="
w-full
p-3
outline-none
"


/>


</div>


</div>









{/* PASSWORD */}



<div>


<label className="
font-medium
">

Password

</label>




<div className="
flex
items-center
border
rounded-lg
mt-2
px-3
">


<FaLock
className="
text-gray-400
"
/>



<input


type={
showPassword
?
"text"
:
"password"
}


value={password}


onChange={
e=>setPassword(
e.target.value
)
}


placeholder="
Enter password
"


className="
w-full
p-3
outline-none
"



/>






<button

type="button"

onClick={()=>
setShowPassword(
!showPassword
)
}

className="
text-gray-500
"


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



</div>









{/* OPTIONS */}



<div className="
flex
justify-between
items-center
">


<label className="
flex
items-center
gap-2
text-sm
">


<input

type="checkbox"

checked={remember}

onChange={
e=>setRemember(
e.target.checked
)
}

/>


Remember me


</label>





<button

type="button"

className="
text-blue-600
text-sm
"

onClick={()=>{

toast(
"Contact admin to reset password"
)

}}

>

Forgot Password?

</button>



</div>









{/* ERROR */}



{

error &&

<p className="
text-red-500
text-sm
">

{error}

</p>

}









{/* BUTTON */}



<button


disabled={loading}


className="
w-full
bg-blue-600
hover:bg-blue-700
disabled:bg-blue-300
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

<div className="
flex
justify-center
gap-2
">

<span>
Logging in
</span>

<span className="
animate-spin
">

⏳

</span>


</div>


:

"Login"

}


</button>









{/* REGISTER */}



<p className="
text-center
text-gray-500
">

Don't have account?


<button


type="button"


onClick={()=>navigate("/register")}


className="
text-blue-600
font-semibold
ml-2
hover:underline
"

>

Register

</button>


</p>






</form>





</div>





</div>


);


};


export default Login;