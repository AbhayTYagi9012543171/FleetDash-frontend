import toast from "react-hot-toast";
import { useState } from "react";

import {
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
  loginUser
} from "../../store/slice/authSlice";


import {
  useNavigate,
  useLocation,
} from "react-router-dom";


import type {
  AppDispatch,
  RootState
} from "../../store/store";



const Login = () => {


  const dispatch =
    useDispatch<AppDispatch>();


  const navigate =
    useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname: string } })?.from
      ?.pathname || "/dashboard";



  const [showPassword, setShowPassword] =
    useState(false);



  const [email, setEmail] =
    useState("");



  const [password, setPassword] =
    useState("");



  const loading =
    useSelector(
      (state: RootState) =>
        state.auth.loading
    );



  const error =
    useSelector(
      (state: RootState) =>
        state.auth.error
    );




  const handleLogin =
    async (e: React.FormEvent) => {


      e.preventDefault();



      const result =
        await dispatch(

          loginUser({

            email,

            password

          })

        );



      if (loginUser.fulfilled.match(result)) {

        toast.success("Login Successful 🎉");

        navigate(from, {
          replace: true,
        });

      } else {

        toast.error("Invalid Email or Password");

      }

    };





  return (


    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">


      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">


        {/* Header */}

        <div className="text-center mb-8">


          <h1 className="text-4xl font-bold text-blue-600">

            FleetDash

          </h1>


          <p className="text-gray-500 mt-2">

            Fleet Management System

          </p>


        </div>





        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >



          {/* Email */}

          <div>


            <label className="font-medium">

              Email

            </label>



            <div className="flex items-center border rounded-lg mt-2 px-3">


              <FaEnvelope
                className="text-gray-400"
              />



              <input

                type="email"

                value={email}

                onChange={
                  (e) =>
                    setEmail(e.target.value)
                }

                placeholder="Enter your email"

                className="w-full p-3 outline-none"

                required

              />


            </div>


          </div>






          {/* Password */}


          <div>


            <label className="font-medium">

              Password

            </label>




            <div className="flex items-center border rounded-lg mt-2 px-3">


              <FaLock
                className="text-gray-400"
              />



              <input


                type={
                  showPassword
                    ? "text"
                    : "password"
                }


                value={password}


                onChange={
                  (e) =>
                    setPassword(e.target.value)
                }



                placeholder="Enter your password"



                className="w-full p-3 outline-none"


                required


              />




              <button

                type="button"

                onClick={() =>
                  setShowPassword(!showPassword)
                }

              >

                {
                  showPassword
                    ?
                    <FaEyeSlash />
                    :
                    <FaEye />
                }


              </button>



            </div>


          </div>







          {/* Error */}


          {
            error &&

            <p className="text-red-500 text-sm">

              {error}

            </p>

          }







          {/* Login Button */}


          <button


            type="submit"


            disabled={loading}


            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-lg font-semibold transition"


          >


            {
              loading
                ?
                "Logging in..."
                :
                "Login"
            }


          </button>







          {/* Register Link */}


          <p className="text-center text-gray-500 mt-5">


            Don't have an account?


            <button


              type="button"


              onClick={() =>
                navigate("/register")
              }


              className="text-blue-600 font-semibold ml-2 hover:underline"


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