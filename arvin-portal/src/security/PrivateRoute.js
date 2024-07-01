import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, accessChecker }) => {
  const hasAccess = accessChecker();

  return hasAccess ? children : <Navigate to="/invalid-access" />;
};

export default PrivateRoute;
