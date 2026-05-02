import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await API.post("/api/auth/login", form);
      const data = res.data;
      if (!data || !data.token) {
        throw new Error("Login failed: Invalid server response");
      }
      login(data);
      console.log("Login Success. Role:", data.user.role);
      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/member-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
      <form className="bg-white border border-gray-200 p-8 rounded-2xl w-[350px] shadow-xl"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200 text-center">
            {error}
          </div>
        )}

        <input
          className="w-full mb-4 p-2 rounded bg-gray-50 border border-gray-300 text-gray-900"
          placeholder="Email"
          onChange={(e) =>
            setForm(prev => ({ ...prev, email: e.target.value }))
          }
        />

        <input
          type="password"
          className="w-full mb-4 p-2 rounded bg-gray-50 border border-gray-300 text-gray-900"
          placeholder="Password"
          onChange={(e) =>
            setForm(prev => ({ ...prev, password: e.target.value }))
          }
        />

        <button className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600">
          Login
        </button>

        <p className="text-sm mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}
