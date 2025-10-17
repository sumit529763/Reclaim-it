// src/app/routes.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Pages
import Home from "../features/home/pages/Home";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/components/Signup";

import Dashboard from "../features/dashboard/pages/Dashboard"; // ✅ Ensure this component is a default export
import Profile from "../features/dashboard/pages/Profile";
import Settings from "../features/dashboard/pages/Settings";
import AdminTools from "../features/dashboard/pages/AdminTools"; // Admin page

import ReportItem from "../features/items/pages/ReportItem";
import MyReports from "../features/items/pages/MyReports";
import ItemDetails from "../features/items/pages/ItemDetails";
import LostItemsList from "../features/items/pages/LostItemsList";
import FoundItemsList from "../features/items/pages/FoundItemsList";

// Layout/Guards
import AdminGuard from "../features/dashboard/layout/AdminGuard";

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

      {/* Protected Dynamic Item Details Route (Public view of active items) */}
      <Route
        path="/item/:itemId"
        element={
          <ProtectedRoute>
            <ItemDetails />
          </ProtectedRoute>
        }
      />

      {/* ADMIN ROUTE (Secured) */}
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminTools />
          </AdminGuard>
        }
      />

      {/* 🔑 CORRECTED: PROTECTED DASHBOARD ROUTES WITH NESTED ROUTING */}
      <Route 
        path="/dashboard" 
        element={
            <ProtectedRoute>
                {/* Dashboard component handles rendering either the overview OR the <Outlet /> */}
                <Dashboard /> 
            </ProtectedRoute>
        }
    >
        {/* Nested Dashboard Pages (NO path required if using nested routing) */}
        <Route index element={null} /> {/* This handles the exact /dashboard path without rendering an Outlet */}
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="report" element={<ReportItem />} />
        <Route path="reports" element={<MyReports />} />
        <Route path="lost" element={<LostItemsList />} />
        <Route path="found" element={<FoundItemsList />} />
      </Route>
      {/* ----------------------------------------------------- */}

      {/* Fallback for Unknown Routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}