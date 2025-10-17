// src/features/dashboard/layout/DashboardLayout.jsx

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  FileText,
  Search,
  Settings,
  User,
  List,
  Shield, // 🔑 NEW: Icon for Admin
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const { logout, isAdmin } = useAuth(); // 🔑 MODIFIED: Get isAdmin flag
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to determine active link styling (remains the same)
  const getLinkClasses = (path) => {
    const isActive =
      location.pathname === path ||
      (path === "/dashboard" && location.pathname === "/dashboard/");
    return `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-blue-100 text-blue-700 font-bold"
        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
    }`;
  };

  // Close the menu on link click (for mobile)
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 relative">
      {/* 1. Mobile Header (Visible only on small screens) - REMAINS UNCHANGED */}
      <header className="md:hidden w-full bg-white shadow-md flex items-center justify-between p-4 z-50">
        <div className="flex items-center gap-2">
          <img src="/Logo.png" alt="Reclaim-it" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-blue-600">Reclaim-it</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* 2. Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 
          w-64 bg-white shadow-xl 
          flex flex-col h-full 
          transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:shadow-md
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Mobile Brand Header (inside sidebar) - REMAINS UNCHANGED */}
        <div className="flex items-center justify-between p-4 md:hidden border-b">
          <div className="flex items-center gap-2">
            <img src="/Logo.png" alt="Reclaim-it" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-blue-600">Reclaim-it</h1>
          </div>
          <button onClick={handleLinkClick} className="text-gray-700 p-2">
            <X size={24} />
          </button>
        </div>

        {/* Desktop Brand Header - REMAINS UNCHANGED */}
        <div className="hidden md:flex items-center justify-start gap-2 px-6 py-5 border-b">
          <img src="/Logo.png" alt="Reclaim-it" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-blue-600">Reclaim-it</h1>
          
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link
            to="/dashboard"
            onClick={handleLinkClick}
            className={getLinkClasses("/dashboard")}
          >
            <LayoutDashboard size={20} /> Overview
          </Link>

          <Link
            to="/dashboard/report"
            onClick={handleLinkClick}
            className={getLinkClasses("/dashboard/report")}
          >
            <FileText size={20} /> Report Item
          </Link>

          <Link
            to="/dashboard/reports"
            onClick={handleLinkClick}
            className={getLinkClasses("/dashboard/reports")}
          >
            <List size={20} /> My Reports
          </Link>

          <Link
            to="/dashboard/lost"
            onClick={handleLinkClick}
            className={getLinkClasses("/dashboard/lost")}
          >
            <Search size={20} /> View Lost Items
          </Link>

          <Link
            to="/dashboard/found"
            onClick={handleLinkClick}
            className={getLinkClasses("/dashboard/found")}
          >
            <Search size={20} /> View Found Items
          </Link>
          
          {/* 🔑 CRITICAL ADDITION: ADMIN PANEL LINK */}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={handleLinkClick}
              className={getLinkClasses("/admin")}
            >
              <Shield size={20} /> Admin Panel 🛡️
            </Link>
          )}

          {/* User Settings */}
          <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
            <Link
              to="/dashboard/profile"
              onClick={handleLinkClick}
              className={getLinkClasses("/dashboard/profile")}
            >
              <User size={20} /> Profile
            </Link>
            <Link
              to="/dashboard/settings"
              onClick={handleLinkClick}
              className={getLinkClasses("/dashboard/settings")}
            >
              <Settings size={20} /> Settings
            </Link>
          </div>
        </nav>

        {/* Logout Button - REMAINS UNCHANGED */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150 font-semibold"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* 3. Overlay - REMAINS UNCHANGED */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={handleLinkClick}
        ></div>
      )}

      {/* 4. Page Content - REMAINS UNCHANGED */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pt-[68px] md:pt-0">
        {children}
      </main>
    </div>
  );
}