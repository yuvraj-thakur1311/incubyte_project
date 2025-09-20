// src/contexts/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  // logged in → show the protected page
  return children;
}
