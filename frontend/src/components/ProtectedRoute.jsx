import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" />;
  }

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" />;
    } else {
      return <Navigate to="/member-dashboard" />;
    }
  }

  return children;
}
