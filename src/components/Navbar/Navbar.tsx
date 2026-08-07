import {
  FaBell,
  FaUserCircle,
  FaBars,
  FaSearch,
} from "react-icons/fa";

import { useAppSelector } from "../../redux/hooks";

interface NavbarProps {
  onMenuClick?: () =>void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header
      className="
        sticky
        top-0
        z-40
        h-16
        bg-white/95
        backdrop-blur-md
        border-b
        border-gray-200
        flex
        items-center
        justify-between
        px-4
        md:px-6
        shadow-sm
      "
    >
      {/* Left */}

      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="
            lg:hidden
            w-10
            h-10
            rounded-lg
            hover:bg-gray-100
            flex
            items-center
            justify-center
          "
        >
          <FaBars className="text-xl text-gray-700" />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg md:text-xl font-bold truncate text-gray-800">
            FleetDash Admin
          </h1>

          <p className="hidden md:block text-xs text-gray-500">
            Fleet Management System
          </p>
        </div>
      </div>

      {/* Search */}

      <div className="hidden lg:flex flex-1 justify-center px-10">
        <div className="relative w-full max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              py-2.5
              pl-11
              pr-4
              outline-none
              focus:border-blue-500
              focus:bg-white
            "
          />
        </div>
      </div>

      {/* Right */}

      <div className="flex items-center gap-3">

        <button
          className="
            relative
            h-10
            w-10
            rounded-xl
            hover:bg-gray-100
            flex
            items-center
            justify-center
          "
        >
          <FaBell className="text-gray-600 text-lg" />

          <span
            className="
              absolute
              top-1
              right-1
              h-2.5
              w-2.5
              rounded-full
              bg-red-500
            "
          />
        </button>

        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            px-2
            py-1
            hover:bg-gray-100
            cursor-pointer
          "
        >
          <FaUserCircle className="text-4xl text-blue-600" />

          <div className="hidden md:block leading-tight">
            <p className="font-semibold text-gray-800">
              {user?.username || "Admin"}
            </p>

            <p className="text-xs text-gray-500">
              {user?.role || "Administrator"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;