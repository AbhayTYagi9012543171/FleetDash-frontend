import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaTruck,
  FaArrowRight,
  FaMapMarkerAlt,
  FaChartLine,
  FaShieldAlt,
  FaRoute,
  FaCheckCircle,
} from "react-icons/fa";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  loginUser,
} from "../../store/slice/authSlice";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import type {
  AppDispatch,
  RootState,
} from "../../store/store";


// ======================================================
// COMPONENT
// ======================================================

const Login = () => {

  // ====================================================
  // REDUX
  // ====================================================

  const dispatch =
    useDispatch<AppDispatch>();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    loading,
    error,
  } = useSelector(
    (state: RootState) =>
      state.auth
  );


  // ====================================================
  // STATE
  // ====================================================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [remember, setRemember] =
    useState(false);


  // ====================================================
  // REDIRECT
  // ====================================================

  const redirectPath =
    (location.state as any)
      ?.from
      ?.pathname ||
    "/dashboard";


  // ====================================================
  // REMEMBER EMAIL
  // ====================================================

  useEffect(() => {

    const rememberedEmail =
      localStorage.getItem(
        "rememberEmail"
      );

    if (rememberedEmail) {

      setEmail(
        rememberedEmail
      );

      setRemember(true);

    }

  }, []);


  // ====================================================
  // LOGIN
  // ====================================================

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    const cleanEmail =
      email.trim();

    if (
      !cleanEmail ||
      !password
    ) {

      toast.error(
        "Please enter email and password"
      );

      return;

    }


    try {

      const result =
        await dispatch(
          loginUser({
            email: cleanEmail,
            password,
          })
        );


      if (
        loginUser.fulfilled.match(
          result
        )
      ) {

        if (remember) {

          localStorage.setItem(
            "rememberEmail",
            cleanEmail
          );

        } else {

          localStorage.removeItem(
            "rememberEmail"
          );

        }


        toast.success(
          "Welcome to FleetDash 🚚"
        );


        navigate(
          redirectPath,
          {
            replace: true,
          }
        );

      } else {

        toast.error(
          (result.payload as string) ||
            "Invalid email or password"
        );

      }

    } catch (err) {

      console.error(
        "Login Error:",
        err
      );

      toast.error(
        "Login failed. Please try again."
      );

    }

  };


  // ====================================================
  // MAIN UI
  // ====================================================

  return (

    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-slate-50
      "
    >

      {/* ==================================================
          BACKGROUND DECORATIONS
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          -top-32
          h-96
          w-96
          rounded-full
          bg-blue-200/30
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-32
          h-[500px]
          w-[500px]
          rounded-full
          bg-indigo-200/30
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/3
          h-64
          w-64
          -translate-x-1/2
          rounded-full
          bg-blue-100/30
          blur-3xl
        "
      />


      {/* ==================================================
          MAIN CONTAINER
      ================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-screen
          max-w-7xl
          items-center
          justify-center
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >

        <div
          className="
            grid
            w-full
            max-w-6xl
            overflow-hidden
            rounded-[2rem]
            border
            border-white
            bg-white/80
            shadow-2xl
            shadow-slate-300/40
            backdrop-blur-xl
            lg:grid-cols-2
          "
        >


          {/* ==================================================
              LEFT BRAND PANEL
          ================================================== */}

          <div
            className="
              relative
              hidden
              overflow-hidden
              bg-gradient-to-br
              from-blue-700
              via-blue-600
              to-indigo-700
              p-10
              text-white
              lg:flex
              lg:min-h-[700px]
              lg:flex-col
              lg:justify-between
            "
          >

            {/* Decorative circles */}

            <div
              className="
                absolute
                -right-24
                -top-24
                h-72
                w-72
                rounded-full
                border
                border-white/10
              "
            />

            <div
              className="
                absolute
                -bottom-32
                -left-20
                h-80
                w-80
                rounded-full
                border
                border-white/10
              "
            />

            <div
              className="
                absolute
                right-10
                top-1/2
                h-32
                w-32
                rounded-full
                bg-white/5
                blur-2xl
              "
            />


            {/* BRAND */}

            <div className="relative z-10">

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-white
                    text-blue-600
                    shadow-lg
                  "
                >

                  <FaTruck size={22} />

                </div>

                <div>

                  <h1 className="text-2xl font-black tracking-tight">
                    FleetDash
                  </h1>

                  <p className="text-xs font-medium text-blue-100">
                    Fleet Management Platform
                  </p>

                </div>

              </div>


              {/* HERO */}

              <div className="mt-20 max-w-lg">

                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/20
                    bg-white/10
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    backdrop-blur
                  "
                >

                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />

                  Fleet system online

                </span>


                <h2
                  className="
                    mt-6
                    text-4xl
                    font-black
                    leading-tight
                    tracking-tight
                    xl:text-5xl
                  "
                >
                  Manage your fleet.
                  <span className="block text-blue-200">
                    Move smarter.
                  </span>
                </h2>


                <p
                  className="
                    mt-6
                    max-w-md
                    text-sm
                    leading-7
                    text-blue-100
                  "
                >
                  Monitor vehicles, track drivers,
                  manage geofences and understand
                  your fleet performance from one
                  powerful dashboard.
                </p>

              </div>


              {/* FEATURES */}

              <div className="mt-10 grid grid-cols-2 gap-3">

                <Feature
                  icon={<FaMapMarkerAlt />}
                  title="Live Tracking"
                  text="Real-time vehicles"
                />

                <Feature
                  icon={<FaChartLine />}
                  title="Analytics"
                  text="Fleet insights"
                />

                <Feature
                  icon={<FaRoute />}
                  title="Smart Routes"
                  text="Better operations"
                />

                <Feature
                  icon={<FaShieldAlt />}
                  title="Secure"
                  text="Protected data"
                />

              </div>

            </div>


            {/* FOOTER */}

            <div className="relative z-10">

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-blue-100
                "
              >

                <FaCheckCircle />

                Trusted fleet management system

              </div>

            </div>

          </div>


          {/* ==================================================
              RIGHT LOGIN PANEL
          ================================================== */}

          <div
            className="
              flex
              min-h-[700px]
              flex-col
              justify-center
              bg-white
              px-6
              py-10
              sm:px-10
              lg:px-14
            "
          >

            {/* MOBILE BRAND */}

            <div className="mb-8 text-center lg:hidden">

              <div
                className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-blue-600
                  text-white
                  shadow-xl
                  shadow-blue-600/20
                "
              >

                <FaTruck size={27} />

              </div>

              <h1 className="mt-4 text-3xl font-black text-slate-900">
                FleetDash
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Fleet Management System
              </p>

            </div>


            {/* LOGIN HEADER */}

            <div className="mx-auto w-full max-w-md">

              <div className="mb-8">

                <p
                  className="
                    mb-2
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-blue-600
                  "
                >
                  Secure Login
                </p>

                <h2
                  className="
                    text-3xl
                    font-black
                    tracking-tight
                    text-slate-900
                    sm:text-4xl
                  "
                >
                  Welcome back
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Sign in to access your fleet
                  management dashboard.
                </p>

              </div>


              {/* ERROR */}

              {error && (

                <div
                  className="
                    mb-5
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                  "
                >

                  <p className="text-sm font-medium text-red-700">
                    {error}
                  </p>

                </div>

              )}


              {/* FORM */}

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="
                      mb-2
                      block
                      text-sm
                      font-bold
                      text-slate-700
                    "
                  >
                    Email Address
                  </label>

                  <div className="group relative">

                    <div
                      className="
                        pointer-events-none
                        absolute
                        left-4
                        top-1/2
                        flex
                        -translate-y-1/2
                        items-center
                        text-slate-400
                        transition
                        group-focus-within:text-blue-600
                      "
                    >

                      <FaEnvelope size={15} />

                    </div>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      placeholder="admin@example.com"
                      autoComplete="email"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        py-3.5
                        pl-11
                        pr-4
                        text-sm
                        font-medium
                        text-slate-800
                        outline-none
                        transition
                        duration-200
                        placeholder:text-slate-400
                        hover:border-slate-300
                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-500/10
                      "
                    />

                  </div>

                </div>


                {/* PASSWORD */}

                <div>

                  <label
                    htmlFor="password"
                    className="
                      mb-2
                      block
                      text-sm
                      font-bold
                      text-slate-700
                    "
                  >
                    Password
                  </label>

                  <div className="group relative">

                    <div
                      className="
                        pointer-events-none
                        absolute
                        left-4
                        top-1/2
                        flex
                        -translate-y-1/2
                        text-slate-400
                        transition
                        group-focus-within:text-blue-600
                      "
                    >

                      <FaLock size={15} />

                    </div>

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        py-3.5
                        pl-11
                        pr-12
                        text-sm
                        font-medium
                        text-slate-800
                        outline-none
                        transition
                        duration-200
                        placeholder:text-slate-400
                        hover:border-slate-300
                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-500/10
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) =>
                            !previous
                        )
                      }
                      className="
                        absolute
                        right-2
                        top-1/2
                        flex
                        h-9
                        w-9
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-lg
                        text-slate-400
                        transition
                        hover:bg-slate-100
                        hover:text-blue-600
                      "
                    >

                      {showPassword ? (
                        <FaEyeSlash size={16} />
                      ) : (
                        <FaEye size={16} />
                      )}

                    </button>

                  </div>

                </div>


                {/* OPTIONS */}

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                  "
                >

                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-2
                    "
                  >

                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(event) =>
                        setRemember(
                          event.target.checked
                        )
                      }
                      className="
                        h-4
                        w-4
                        cursor-pointer
                        rounded
                        border-slate-300
                        accent-blue-600
                      "
                    />

                    <span className="text-sm text-slate-600">
                      Remember me
                    </span>

                  </label>


                  <button
                    type="button"
                    onClick={() =>
                      toast(
                        "Please contact your administrator to reset your password."
                      )
                    }
                    className="
                      text-sm
                      font-bold
                      text-blue-600
                      transition
                      hover:text-blue-700
                      hover:underline
                    "
                  >
                    Forgot Password?
                  </button>

                </div>


                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    relative
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    overflow-hidden
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
                    shadow-blue-600/20
                    transition
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-xl
                    hover:shadow-blue-600/25
                    focus:outline-none
                    focus:ring-4
                    focus:ring-blue-500/20
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  <span
                    className="
                      absolute
                      inset-0
                      -translate-x-full
                      bg-gradient-to-r
                      from-transparent
                      via-white/20
                      to-transparent
                      transition
                      duration-700
                      group-hover:translate-x-full
                    "
                  />

                  <span className="relative flex items-center gap-2">

                    {loading ? (

                      <>
                        <span
                          className="
                            h-5
                            w-5
                            animate-spin
                            rounded-full
                            border-2
                            border-white/30
                            border-t-white
                          "
                        />

                        Signing in...
                      </>

                    ) : (

                      <>
                        Sign In

                        <FaArrowRight
                          size={13}
                          className="
                            transition
                            duration-200
                            group-hover:translate-x-1
                          "
                        />

                      </>

                    )}

                  </span>

                </button>

              </form>


              {/* DIVIDER */}

              <div
                className="
                  my-7
                  flex
                  items-center
                  gap-4
                "
              >

                <div className="h-px flex-1 bg-slate-200" />

                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-widest
                    text-slate-400
                  "
                >
                  FleetDash
                </span>

                <div className="h-px flex-1 bg-slate-200" />

              </div>


              {/* REGISTER */}

              <div className="text-center">

                <span className="text-sm text-slate-500">
                  Don't have an account?
                </span>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/register")
                  }
                  className="
                    ml-2
                    text-sm
                    font-bold
                    text-blue-600
                    transition
                    hover:text-blue-700
                    hover:underline
                  "
                >
                  Create Account
                </button>

              </div>


              {/* SECURITY */}

              <div
                className="
                  mt-7
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-[11px]
                  font-medium
                  text-slate-400
                "
              >

                <FaShieldAlt />

                Secure & encrypted access

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


// ======================================================
// FEATURE COMPONENT
// ======================================================

const Feature = ({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) => {

  return (

    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/10
        p-4
        backdrop-blur
        transition
        duration-200
        hover:bg-white/15
      "
    >

      <div
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          bg-white/15
          text-blue-100
        "
      >

        {icon}

      </div>

      <p className="mt-3 text-sm font-bold">
        {title}
      </p>

      <p className="mt-1 text-xs text-blue-100">
        {text}
      </p>

    </div>

  );
};


export default Login;