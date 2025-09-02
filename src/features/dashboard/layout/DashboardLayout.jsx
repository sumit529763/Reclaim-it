import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

export default function DashboardLayout({ children }) {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar / Topbar */}
      <aside className="w-full md:w-64 bg-white shadow-md flex flex-col md:h-screen">
        {/* Brand */}
        <div className="flex items-center justify-between md:justify-start gap-2 px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <img
              src="/Logo.png"
              alt="Reclaim-it"
              className="w-8 h-8"
            />
            <h1 className="text-xl font-bold text-blue-600">Reclaim-it</h1>
          </div>

          {/* On mobile, keep logout button inline */}
          <button
            onClick={logout}
            className="md:hidden px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex md:flex-col justify-around md:justify-start flex-1 px-4 py-2 md:py-6 space-y-0 md:space-y-2">
          <Link
            to="/dashboard"
            className="block px-4 py-2 rounded-md text-blue-600 font-medium bg-blue-50"
          >
            Overview
          </Link>
          <Link
            to="/dashboard/profile"
            className="block px-4 py-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            Profile
          </Link>
          <Link
            to="/dashboard/settings"
            className="block px-4 py-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            Settings
          </Link>
        </nav>

        {/* Logout (desktop only) */}
        <div className="hidden md:block p-4">
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
