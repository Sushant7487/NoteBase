
// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    try {
      const userJSON = localStorage.getItem("user");
      if (!userJSON) {
        // No user data, so they can't be an admin
        return <Navigate to="/login" replace />;
      }
      
      const storedData = JSON.parse(userJSON);
      if (storedData?.user?.role?.toLowerCase() !== 'admin') {
         // If they aren't an admin, send them to their dashboard
         return <Navigate to="/dashboard" replace />;
      }
    } catch (e) {
      // If parsing fails for any reason, it's safest to send to login
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}