import { Navigate } from "react-router-dom";
import { getUser } from "../services/AuthService";

function ProtectedRoute({ children, role }) {

  const user = getUser();

  if (!user) {

    return <Navigate to="/login" replace />;

  }

  if (role && user.role !== role) {

    return <Navigate to="/login" replace />;

  }

  return children;

}

export default ProtectedRoute;