// src/features/dashboard/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom"; // <-- Import Outlet and useLocation
import DashboardLayout from "../layout/DashboardLayout";
import { getDashboardStats } from "../../../services/items.service";
import { useAuth } from "../../../hooks/useAuth";

export default function Dashboard() {
  const { user, initializing } = useAuth();
  // Get the current location to determine if we are on the main overview page
  const location = useLocation(); 
  
  const [stats, setStats] = useState({
    reported: 0,
    resolved: 0,
    inReview: 0,
  });
  const [loading, setLoading] = useState(true);

  // Checks if the current path is exactly /dashboard (or /dashboard/)
  const isOverview = location.pathname === "/dashboard" || location.pathname === "/dashboard/";

  useEffect(() => {
    // Only fetch stats if the user is authenticated AND we are on the overview page
    if (isOverview && !initializing && user) {
      const fetchStats = async () => {
        setLoading(true);
        try {
          const fetchedStats = await getDashboardStats(user.uid);
          setStats(fetchedStats);
        } catch (error) {
          console.error("Error fetching dashboard stats:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    } else if (!initializing && !user) {
      setLoading(false);
    }
  }, [user, initializing, isOverview]); // Added isOverview as a dependency

  return (
    <DashboardLayout>
      {/* This is the core fix: 
        1. If we are on the exact '/dashboard' path, render the Dashboard Overview (stats/quick actions).
        2. Otherwise (if the path is '/dashboard/report', '/dashboard/profile', etc.), 
           render the <Outlet /> to display the nested component.
      */}
      {isOverview ? (
        <>
          {/* Dashboard Header */}
          <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

          {loading ? (
            <p className="text-center text-lg mt-8">Loading stats...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Stats Cards */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold">Items Reported</h3>
                <p className="text-3xl font-bold mt-2">{stats.reported}</p>
                <p className="text-sm mt-1 opacity-80">Total lost items you added</p>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold">Resolved</h3>
                <p className="text-3xl font-bold mt-2">{stats.resolved}</p>
                <p className="text-sm mt-1 opacity-80">
                  Successfully matched & found
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold">In Review</h3>
                <p className="text-3xl font-bold mt-2">{stats.inReview}</p>
                <p className="text-sm mt-1 opacity-80">Pending confirmation</p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ➕ Report New Item */}
            <div className="bg-white border rounded-xl p-6 shadow hover:shadow-md transition">
              <h4 className="text-lg font-bold mb-2">➕ Report New Item</h4>
              <p className="text-gray-600 text-sm mb-3">
                Add details of a newly lost or found item.
              </p>
              <Link to="/dashboard/report">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Report Item
                </button>
              </Link>
            </div>

            {/* 📋 My Reports */}
            <div className="bg-white border rounded-xl p-6 shadow hover:shadow-md transition">
              <h4 className="text-lg font-bold mb-2">📋 My Reports</h4>
              <p className="text-gray-600 text-sm mb-3">
                View and manage all items you reported.
              </p>
              <Link to="/dashboard/reports">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  View Reports
                </button>
              </Link>
            </div>

            {/* ⚙️ Account Settings */}
            <div className="bg-white border rounded-xl p-6 shadow hover:shadow-md transition">
              <h4 className="text-lg font-bold mb-2">⚙️ Account Settings</h4>
              <p className="text-gray-600 text-sm mb-3">
                Manage your profile and preferences.
              </p>
              <Link to="/dashboard/settings">
                <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition">
                  Go to Settings
                </button>
              </Link>
            </div>
          </div>
        </>
      ) : (
        // Renders the component defined by the nested route (e.g., ReportItem)
        <Outlet /> 
      )}
    </DashboardLayout>
  );
}