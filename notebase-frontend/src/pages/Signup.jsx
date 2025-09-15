
// src/pages/Signup.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchTenants, registerUser } from "../api/api";

export default function Signup() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    tenant: "", // This will be the tenant ID
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch available tenants when the component loads
  useEffect(() => {
    fetchTenants()
      .then(setTenants)
      .catch(() => setError("Could not load tenant information."));
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { fullName, email, password, tenant } = formData;
    if (!fullName || !email || !password || !tenant) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      await registerUser(formData);
      navigate("/dashboard"); // Navigate to dashboard on successful registration and login
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create an Account
        </h2>
        
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="tenant"
            value={formData.tenant}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a Tenant</option>
            {tenants.map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center">
            <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:underline">Log in</Link></p>
        </div>

      </div>
    </div>
  );
}