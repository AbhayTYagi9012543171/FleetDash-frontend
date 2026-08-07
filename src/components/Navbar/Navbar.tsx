// import {
//   FaBell,
//   FaUserCircle,
//   FaBars,
// } from "react-icons/fa";

// import { useAppSelector } from "../../redux/hooks";



// interface NavbarProps {

//   onMenuClick?:()=>void;

// }



// const Navbar = ({
//   onMenuClick
// }:NavbarProps)=>{


// const user =
// useAppSelector(
// (state)=>state.auth.user
// );




// return (

// <header
// className="
// bg-white
// shadow-sm
// h-16
// flex
// items-center
// justify-between
// px-6
// sticky
// top-0
// z-40
// "
// >



// {/* Mobile Menu */}

// <button

// onClick={onMenuClick}

// className="
// lg:hidden
// text-gray-600
// text-xl
// "

// >

// <FaBars />

// </button>







// {/* Header Title */}

// <div>


// <h1
// className="
// text-xl
// font-bold
// text-gray-800
// "
// >

// FleetDash Admin

// </h1>


// <p
// className="
// text-xs
// text-gray-500
// "
// >

// Fleet Management System

// </p>


// </div>







// {/* Right */}

// <div
// className="
// flex
// items-center
// gap-6
// "
// >



// {/* Notification */}

// <button

// className="
// relative
// text-gray-600
// hover:text-blue-600
// "

// >


// <FaBell
// className="
// text-xl
// "
// />


// <span

// className="
// absolute
// -top-2
// -right-2
// bg-red-500
// text-white
// text-xs
// rounded-full
// w-4
// h-4
// flex
// items-center
// justify-center
// "

// >

// 3

// </span>


// </button>









// {/* User Profile */}

// <div
// className="
// flex
// items-center
// gap-3
// "
// >


// <FaUserCircle

// className="
// text-3xl
// text-gray-500
// "

// />


// <div
// className="
// hidden
// md:block
// "
// >


// <p
// className="
// font-semibold
// text-gray-800
// "
// >

// {
// user?.username || "Admin"
// }

// </p>



// <p
// className="
// text-sm
// text-gray-500
// "
// >

// {
// user?.role || "Administrator"
// }

// </p>


// </div>


// </div>






// </div>



// </header>


// );

// };


// export default Navbar;



import {
  FaBell,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";

import { useAppSelector } from "../../redux/hooks";

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header
      className="
      bg-white
      shadow-sm
      h-16
      flex
      items-center
      justify-between
      px-3
      sm:px-4
      md:px-6
      sticky
      top-0
      z-40
      w-full
    "
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="
          lg:hidden
          text-gray-600
          text-xl
          shrink-0
        "
        >
          <FaBars />
        </button>

        <div className="min-w-0">
          <h1
            className="
            text-lg
            sm:text-xl
            font-bold
            text-gray-800
            truncate
          "
          >
            FleetDash Admin
          </h1>

          <p
            className="
            hidden
            sm:block
            text-xs
            text-gray-500
            truncate
          "
          >
            Fleet Management System
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 sm:gap-5">
        <button
          className="
          relative
          text-gray-600
          hover:text-blue-600
          shrink-0
        "
        >
          <FaBell className="text-xl" />

          <span
            className="
            absolute
            -top-2
            -right-2
            bg-red-500
            text-white
            text-[10px]
            rounded-full
            w-4
            h-4
            flex
            items-center
            justify-center
          "
          >
            3
          </span>
        </button>

        <div className="flex items-center gap-2">
          <FaUserCircle className="text-3xl text-gray-500 shrink-0" />

          <div className="hidden md:block">
            <p className="font-semibold text-gray-800">
              {user?.username || "Admin"}
            </p>

            <p className="text-sm text-gray-500">
              {user?.role || "Administrator"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;