import { useMemo, useState } from "react";

import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaTruck,
  FaShieldAlt,
  FaChartLine,
  FaMapMarkedAlt,
} from "react-icons/fa";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import type {
  AppDispatch,
  RootState,
} from "../../store/store";

import {
  registerUser,
} from "../../store/slice/authSlice";


// ======================================================
// COMPONENT
// ======================================================

const Register = () => {

  const dispatch =
    useDispatch<AppDispatch>();

  const navigate =
    useNavigate();


  // ====================================================
  // STATE
  // ====================================================

  const [username, setUsername] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  // ====================================================
  // REDUX
  // ====================================================

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


  // ====================================================
  // PASSWORD STRENGTH
  // ====================================================

  const passwordStrength =
    useMemo(() => {

      if (!password) {
        return {
          label: "",
          width: "0%",
          color: "bg-slate-200",
        };
      }

      let score = 0;

      if (password.length >= 8) {
        score++;
      }

      if (/[A-Z]/.test(password)) {
        score++;
      }

      if (/[0-9]/.test(password)) {
        score++;
      }

      if (/[^A-Za-z0-9]/.test(password)) {
        score++;
      }

      if (score <= 1) {
        return {
          label: "Weak password",
          width: "25%",
          color: "bg-red-500",
        };
      }

      if (score === 2) {
        return {
          label: "Fair password",
          width: "50%",
          color: "bg-amber-500",
        };
      }

      if (score === 3) {
        return {
          label: "Good password",
          width: "75%",
          color: "bg-blue-500",
        };
      }

      return {
        label: "Strong password",
        width: "100%",
        color: "bg-emerald-500",
      };

    }, [password]);


  // ====================================================
  // REGISTER
  // ====================================================

  const handleRegister =
    async (
      event: React.FormEvent
    ) => {

      event.preventDefault();


      // Basic validation

      if (
        !username.trim() ||
        !phoneNumber.trim() ||
        !email.trim() ||
        !password ||
        !confirmPassword
      ) {

        toast.error(
          "Please fill in all fields"
        );

        return;
      }


      if (
        password.length < 8
      ) {

        toast.error(
          "Password must contain at least 8 characters"
        );

        return;
      }


      if (
        password !==
        confirmPassword
      ) {

        toast.error(
          "Passwords do not match"
        );

        return;
      }


      try {

        const result =
          await dispatch(
            registerUser({
              username,
              phoneNumber,
              email,
              password,
            })
          );


        if (
          registerUser.fulfilled.match(
            result
          )
        ) {

          toast.success(
            "Registration successful 🎉"
          );

          navigate("/login");

        } else {

          toast.error(
            (result.payload as string) ||
              "Registration failed"
          );

        }

      } catch {

        toast.error(
          "Something went wrong. Please try again."
        );

      }

    };


  // ====================================================
  // INPUT CLASS
  // ====================================================

  const inputClass = `
    w-full
    rounded-xl
    border
    border-slate-200
    bg-slate-50
    py-3.5
    pl-11
    pr-4
    text-sm
    text-slate-800
    outline-none
    transition-all
    duration-200
    placeholder:text-slate-400
    hover:border-slate-300
    focus:border-blue-500
    focus:bg-white
    focus:ring-4
    focus:ring-blue-100
  `;


  // ====================================================
  // RETURN
  // ====================================================

  return (

    <div className="min-h-screen bg-slate-50">

      <div className="flex min-h-screen">


        {/* ==================================================
            LEFT BRANDING SECTION
        ================================================== */}

        <div className="
          relative
          hidden
          overflow-hidden
          bg-gradient-to-br
          from-blue-700
          via-blue-600
          to-indigo-700
          lg:flex
          lg:w-1/2
          xl:w-[55%]
        ">

          {/* Decorative circles */}

          <div className="
            absolute
            -right-24
            -top-24
            h-72
            w-72
            rounded-full
            bg-white/10
          " />

          <div className="
            absolute
            -bottom-32
            -left-20
            h-80
            w-80
            rounded-full
            bg-white/10
          " />

          <div className="
            absolute
            right-20
            bottom-20
            h-32
            w-32
            rounded-full
            bg-white/5
          " />


          {/* Content */}

          <div className="
            relative
            z-10
            flex
            w-full
            flex-col
            justify-between
            p-10
            xl:p-14
          ">


            {/* Logo */}

            <div className="flex items-center gap-3">

              <div className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-white
                text-blue-600
                shadow-lg
              ">

                <FaTruck size={22} />

              </div>

              <div>

                <h1 className="
                  text-2xl
                  font-extrabold
                  tracking-tight
                  text-white
                ">
                  FleetDash
                </h1>

                <p className="
                  text-xs
                  font-medium
                  text-blue-100
                ">
                  Fleet Management System
                </p>

              </div>

            </div>


            {/* Main Content */}

            <div className="
              max-w-xl
              py-16
            ">

              <span className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/20
                bg-white/10
                px-4
                py-2
                text-xs
                font-semibold
                text-blue-50
                backdrop-blur-sm
              ">

                <span className="
                  h-2
                  w-2
                  rounded-full
                  bg-emerald-400
                " />

                Smart Fleet Management

              </span>


              <h2 className="
                mt-6
                text-4xl
                font-extrabold
                leading-tight
                tracking-tight
                text-white
                xl:text-5xl
              ">

                Manage your fleet.
                <br />

                <span className="text-blue-200">
                  Drive your business.
                </span>

              </h2>


              <p className="
                mt-6
                max-w-lg
                text-base
                leading-7
                text-blue-100
              ">

                Create your FleetDash account and
                get complete visibility into your
                vehicles, drivers, routes and fleet
                performance.

              </p>


              {/* Features */}

              <div className="
                mt-10
                grid
                gap-4
                sm:grid-cols-3
              ">

                <div className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  p-4
                  backdrop-blur-sm
                ">

                  <FaMapMarkedAlt
                    className="text-blue-200"
                    size={20}
                  />

                  <p className="
                    mt-3
                    text-sm
                    font-semibold
                    text-white
                  ">
                    Live Tracking
                  </p>

                  <p className="
                    mt-1
                    text-xs
                    text-blue-100
                  ">
                    Monitor vehicles
                  </p>

                </div>


                <div className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  p-4
                  backdrop-blur-sm
                ">

                  <FaChartLine
                    className="text-blue-200"
                    size={20}
                  />

                  <p className="
                    mt-3
                    text-sm
                    font-semibold
                    text-white
                  ">
                    Analytics
                  </p>

                  <p className="
                    mt-1
                    text-xs
                    text-blue-100
                  ">
                    Track performance
                  </p>

                </div>


                <div className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  p-4
                  backdrop-blur-sm
                ">

                  <FaShieldAlt
                    className="text-blue-200"
                    size={20}
                  />

                  <p className="
                    mt-3
                    text-sm
                    font-semibold
                    text-white
                  ">
                    Secure
                  </p>

                  <p className="
                    mt-1
                    text-xs
                    text-blue-100
                  ">
                    Protected access
                  </p>

                </div>

              </div>

            </div>


            {/* Footer */}

            <div className="
              flex
              items-center
              justify-between
              border-t
              border-white/10
              pt-5
              text-xs
              text-blue-100
            ">

              <span>
                © {new Date().getFullYear()} FleetDash
              </span>

              <span>
                Fleet Management Platform
              </span>

            </div>

          </div>

        </div>


        {/* ==================================================
            RIGHT REGISTER SECTION
        ================================================== */}

        <div className="
          flex
          w-full
          items-center
          justify-center
          px-4
          py-8
          sm:px-6
          lg:w-1/2
          lg:px-10
          xl:w-[45%]
        ">

          <div className="
            w-full
            max-w-lg
          ">


            {/* Mobile Logo */}

            <div className="
              mb-8
              flex
              items-center
              justify-center
              gap-3
              lg:hidden
            ">

              <div className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-blue-600
                text-white
                shadow-md
              ">

                <FaTruck />

              </div>

              <div>

                <h1 className="
                  text-xl
                  font-extrabold
                  text-slate-900
                ">
                  FleetDash
                </h1>

                <p className="
                  text-xs
                  text-slate-500
                ">
                  Fleet Management System
                </p>

              </div>

            </div>


            {/* Register Card */}

            <div className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-xl
              shadow-slate-200/60
              sm:p-8
            ">


              {/* Header */}

              <div className="mb-7">

                <div className="
                  mb-4
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-blue-50
                  text-blue-600
                ">

                  <FaUser size={20} />

                </div>


                <h2 className="
                  text-2xl
                  font-extrabold
                  tracking-tight
                  text-slate-900
                  sm:text-3xl
                ">
                  Create your account
                </h2>

                <p className="
                  mt-2
                  text-sm
                  leading-6
                  text-slate-500
                ">
                  Join FleetDash and start managing
                  your fleet smarter.
                </p>

              </div>


              {/* Error */}

              {error && (

                <div className="
                  mb-5
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-red-700
                ">

                  {error}

                </div>

              )}


              {/* Form */}

              <form
                onSubmit={handleRegister}
                className="space-y-4"
              >


                {/* Username */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  ">
                    Username
                  </label>

                  <div className="relative">

                    <FaUser
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                      size={14}
                    />

                    <input
                      type="text"
                      value={username}
                      onChange={(e) =>
                        setUsername(
                          e.target.value
                        )
                      }
                      placeholder="Enter your username"
                      className={inputClass}
                      autoComplete="username"
                    />

                  </div>

                </div>


                {/* Phone */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  ">
                    Phone Number
                  </label>

                  <div className="relative">

                    <FaPhone
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                      size={14}
                    />

                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(
                          e.target.value
                        )
                      }
                      placeholder="Enter phone number"
                      className={inputClass}
                      autoComplete="tel"
                    />

                  </div>

                </div>


                {/* Email */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  ">
                    Email Address
                  </label>

                  <div className="relative">

                    <FaEnvelope
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                      size={14}
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      placeholder="you@example.com"
                      className={inputClass}
                      autoComplete="email"
                    />

                  </div>

                </div>


                {/* Password */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  ">
                    Password
                  </label>

                  <div className="relative">

                    <FaLock
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                      size={14}
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      placeholder="Create a strong password"
                      className={`${inputClass} pr-12`}
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        transition
                        hover:text-blue-600
                      "
                    >

                      {showPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}

                    </button>

                  </div>


                  {/* Strength */}

                  {password && (

                    <div className="mt-2">

                      <div className="
                        h-1.5
                        overflow-hidden
                        rounded-full
                        bg-slate-100
                      ">

                        <div
                          className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{
                            width:
                              passwordStrength.width,
                          }}
                        />

                      </div>

                      <p className="
                        mt-1
                        text-[11px]
                        font-medium
                        text-slate-500
                      ">
                        {passwordStrength.label}
                      </p>

                    </div>

                  )}

                </div>


                {/* Confirm Password */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  ">
                    Confirm Password
                  </label>

                  <div className="relative">

                    <FaLock
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                      size={14}
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      placeholder="Confirm your password"
                      className={`${inputClass} pr-12`}
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        transition
                        hover:text-blue-600
                      "
                    >

                      {showConfirmPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}

                    </button>

                  </div>


                  {/* Match indicator */}

                  {confirmPassword && (

                    <p
                      className={`
                        mt-1.5
                        text-xs
                        font-medium
                        ${
                          password ===
                          confirmPassword
                            ? "text-emerald-600"
                            : "text-red-500"
                        }
                      `}
                    >

                      {password ===
                      confirmPassword
                        ? "✓ Passwords match"
                        : "Passwords do not match"}

                    </p>

                  )}

                </div>


                {/* Terms */}

                <div className="
                  flex
                  items-start
                  gap-2
                  pt-1
                ">

                  <input
                    type="checkbox"
                    required
                    className="
                      mt-1
                      h-4
                      w-4
                      rounded
                      border-slate-300
                      text-blue-600
                      focus:ring-blue-500
                    "
                  />

                  <p className="
                    text-xs
                    leading-5
                    text-slate-500
                  ">

                    I agree to the{" "}

                    <button
                      type="button"
                      className="
                        font-semibold
                        text-blue-600
                        hover:underline
                      "
                    >
                      Terms of Service
                    </button>

                    {" "}and{" "}

                    <button
                      type="button"
                      className="
                        font-semibold
                        text-blue-600
                        hover:underline
                      "
                    >
                      Privacy Policy
                    </button>

                  </p>

                </div>


                {/* Register Button */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-2
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-600
                    to-indigo-600
                    px-5
                    py-3.5
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    shadow-blue-200
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:from-blue-700
                    hover:to-indigo-700
                    hover:shadow-xl
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    disabled:hover:translate-y-0
                  "
                >

                  {loading ? (

                    <>
                      <span className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                      " />

                      Creating Account...

                    </>

                  ) : (

                    <>
                      <FaUser size={13} />

                      Create Account
                    </>

                  )}

                </button>

              </form>


              {/* Login */}

              <div className="
                mt-6
                border-t
                border-slate-100
                pt-5
                text-center
              ">

                <p className="
                  text-sm
                  text-slate-500
                ">

                  Already have an account?

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/login")
                    }
                    className="
                      ml-1.5
                      font-bold
                      text-blue-600
                      transition
                      hover:text-blue-700
                      hover:underline
                    "
                  >
                    Login
                  </button>

                </p>

              </div>

            </div>


            {/* Bottom Security */}

            <div className="
              mt-5
              flex
              items-center
              justify-center
              gap-2
              text-xs
              text-slate-400
            ">

              <FaShieldAlt size={11} />

              Your account information is securely protected.

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


export default Register;