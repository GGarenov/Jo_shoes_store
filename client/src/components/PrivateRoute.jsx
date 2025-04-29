import React from "react";
import { Navigate } from "react-router-dom";
import { isAdmin, getToken } from "../utils/authMiddleware"; // Importing the isAdmin function from utils

const PrivateRoute = ({ element }) => {
  const token = getToken();
  const admin = isAdmin(); // Using the imported isAdmin function

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!admin) {
    return <Navigate to="/" />; // Redirect non-admin users to the home page
  }

  return element;
};

export default PrivateRoute;
