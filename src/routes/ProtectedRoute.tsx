import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const ProtectedRoute = () => {
  const location = useLocation();

  const { isLoggedIn, token } = useSelector(
    (state: RootState) => state.auth
  );

  const localToken = localStorage.getItem("token");

  const authToken = token || localToken;

  const isAuthenticated =
    !!authToken &&
    authToken.trim().length > 0;

  if (!isLoggedIn && !isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;