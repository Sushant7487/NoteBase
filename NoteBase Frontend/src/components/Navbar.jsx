
// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  let user = null;
  try {
    const storedData = JSON.parse(localStorage.getItem("user") || "null");
    if(storedData) user = storedData.user;
  } catch (e) {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    // Use window.location.reload() to ensure a clean state after logout
    window.location.reload(); 
  };

  return (
    <header className="bg-slate-800 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to={user ? "/dashboard" : "/"} className="text-xl font-bold hover:text-blue-300">
          NoteBase
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-slate-300 hidden sm:block">
                {user.email}
              </span>
              {user.role?.toLowerCase() === 'admin' && (
                <Link to="/users" className="text-sm font-medium hover:text-blue-300">
                  Users
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm font-semibold bg-red-600 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-blue-300">Login</Link>
              <Link to="/signup" className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}