import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const dashboardLink = user?.role === "admin" ? "/admin-dashboard" : "/member-dashboard";

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 p-5 text-gray-800 fixed shadow-sm z-10">
      <h2 className="text-2xl font-bold mb-6">Menu</h2>

      <ul className="space-y-4 font-medium">
        <li>
          <Link to={dashboardLink} className="hover:text-indigo-600 transition-colors">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/projects" className="hover:text-indigo-600 transition-colors">
            Projects
          </Link>
        </li>
        <li>
          <Link to="/tasks" className="hover:text-indigo-600 transition-colors">
            Tasks
          </Link>
        </li>
      </ul>
    </div>
  );
}
