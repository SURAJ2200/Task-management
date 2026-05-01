import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });

  useEffect(() => {
    console.log("User:", user);
    console.log("Role:", user?.role);

    const getDashboard = async () => {
      try {
        const res = await API.get("/tasks/dashboard");
        setData(res.data.data || res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getDashboard();
  }, [user]);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Navbar />

        <div className="bg-gray-50 min-h-screen p-6 text-gray-900">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Member Dashboard</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-gray-500 font-medium mb-1">My Tasks</p>
              <h2 className="text-3xl font-bold text-indigo-600">{data.total}</h2>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-gray-500 font-medium mb-1">Completed</p>
              <h2 className="text-3xl font-bold text-emerald-600">{data.completed}</h2>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-gray-500 font-medium mb-1">Pending</p>
              <h2 className="text-3xl font-bold text-amber-500">{data.pending}</h2>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-gray-500 font-medium mb-1">Overdue</p>
              <h2 className="text-3xl font-bold text-red-500">{data.overdue}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
