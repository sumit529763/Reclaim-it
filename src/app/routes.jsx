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
import ItemDetails from "../features/items/pages/ItemDetails";
import LostItemsList from "../features/items/pages/LostItemsList";
import FoundItemsList from "../features/items/pages/FoundItemsList";

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
      {/* Public Routes */}
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

      {/* Protected Dashboard Routes with Nested Routing */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        {/* Nested Dashboard Pages */}
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="report" element={<ReportItem />} />
        <Route path="reports" element={<MyReports />} />
        <Route path="lost" element={<LostItemsList />} />
        <Route path="found" element={<FoundItemsList />} />
      </Route>

      {/* Protected Dynamic Item Details Route */}
      <Route
        path="/item/:itemId"
        element={
          <ProtectedRoute>
            <ItemDetails />
          </ProtectedRoute>
        }
      />

      {/* Fallback for Unknown Routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
