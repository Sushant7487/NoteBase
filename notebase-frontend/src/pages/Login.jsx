
// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/api";

const predefinedAccounts = [
  { email: "admin@acme.test", password: "password", tenant: "Acme", role: "Admin" },
  { email: "user@acme.test", password: "password", tenant: "Acme", role: "Member" },
  { email: "admin@globex.test", password: "password", tenant: "Globex", role: "Admin" },
  { email: "user@globex.test", password: "password", tenant: "Globex", role: "Member" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Both fields are required.");
    
    setLoading(true);
    try {
      await loginUser({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handlePredefinedLogin = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back!
        </h2>
        
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 sr-only">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (e.g., admin@acme.test)"
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 sr-only">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (password)"
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center">
            <p className="text-sm text-gray-600">No account? <Link to="/signup" className="font-medium text-blue-600 hover:underline">Sign up</Link></p>
        </div>

        <div className="pt-4 border-t">
          <h3 className="mb-2 text-sm font-semibold text-center text-gray-500">
            Or use a test account
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {predefinedAccounts.map(acc => (
              <button key={acc.email} onClick={() => handlePredefinedLogin(acc)} className="px-2 py-1 text-xs text-center text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                {acc.tenant} {acc.role}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}