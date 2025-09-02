// src/app/routes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Pages
import Home from "../features/home/pages/Home";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/components/Signup";

import Dashboard from "../features/dashboard/pages/Dashboard";
import Profile from "../features/dashboard/pages/Profile";
import Settings from "../features/dashboard/pages/Settings";

import ReportItem from "../features/items/pages/ReportItem";
import MyReports from "../features/items/pages/MyReports";

function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();
  if (initializing) return <div className="p-8">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }) {
  const { user, initializing } = useAuth();
  if (initializing) return <div className="p-8">Loading...</div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <Signup />
          </PublicOnlyRoute>
        }
      />

      {/* Dashboard and nested routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/report"
        element={
          <ProtectedRoute>
            <ReportItem />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/reports"
        element={
          <ProtectedRoute>
            <MyReports />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
