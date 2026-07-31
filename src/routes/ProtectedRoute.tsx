import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useSelector } from "react-redux";

import type {
  RootState
} from "../store/store";



const ProtectedRoute = () => {



  const isLoggedIn = useSelector(
    (state: RootState) =>
      state.auth.isLoggedIn
  );



  const token =
    localStorage.getItem("token");





  // User is allowed if Redux OR localStorage has token

  if (!isLoggedIn && !token) {


    return (

      <Navigate
        to="/login"
        replace
      />

    );


  }





  return <Outlet />;


};



export default ProtectedRoute;