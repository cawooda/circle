import { Navigate, Outlet } from "react-router-dom";
import useToken from "../hooks/UseToken";

export const PrivateRoute = ({ children, redirectTo = "/login" }) => {
  const { token } = useToken(); // Check if user has a valid token

  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? children : <Outlet />;
};
