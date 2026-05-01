import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member"); 
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    console.log("Sending Role:", role);

    try {

      const res = await API.post("/auth/signup", {
        name,
        email,
        password,
        role
      });

      const data = res.data;
      if (!data || !data.token) {
        throw new Error("Signup failed: Invalid server response");
      }

      login(data);
      console.log("Signup Success. Role:", data.user.role);

      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/member-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred during signup");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xl w-[350px]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            className="w-full p-2 rounded bg-gray-50 border border-gray-300 text-gray-900"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="w-full p-2 rounded bg-gray-50 border border-gray-300 text-gray-900"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full p-2 rounded bg-gray-50 border border-gray-300 text-gray-900"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wider">
              Account Type
            </label>
            {}
           <select
  className="w-full p-2 rounded bg-gray-50 border border-gray-300"
  value={role}
  onChange={(e) => {
    console.log("Selected:", e.target.value);
    setRole(e.target.value);
  }}
>
  <option value="member">Member</option>
  <option value="admin">Admin</option>
</select>
          </div>

          <button className="w-full bg-indigo-500 text-white py-2 rounded font-bold hover:bg-indigo-600 transition-colors shadow-md mt-2">
            Sign Up
          </button>
        </div>

        <p className="text-sm mt-6 text-center text-gray-500">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
