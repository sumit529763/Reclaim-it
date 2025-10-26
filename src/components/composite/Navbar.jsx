// src/components/layout/Navbar.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  // Pull the profile object, which contains the full name
  const { user, logout, profile } = useAuth(); 
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔑 FIX: Function to safely extract precise initials (e.g., S and N)
  const getInitials = () => {
    const fullName = profile?.name; 

    if (fullName) {
        // Split the name by space and filter out empty strings (for extra spaces)
        const parts = fullName.split(' ').filter(p => p.length > 0);
        
        if (parts.length >= 2) {
            // Use first letter of First Name and first letter of LAST Name
            return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
        } else if (parts.length === 1) {
            // If only one word (e.g., Sumit), use the first letter
            return parts[0].charAt(0).toUpperCase();
        }
    }
    
    // 3. Fallback to the first letter of the email 
    return user?.email?.charAt(0).toUpperCase() || "U";
  };
  
  // Close menu on navigation
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Brand */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Reclaim-it
        </Link>
        
        {/* --- Navigation Links and Authentication --- */}
        <div className="flex items-center space-x-4">
            
            {/* PUBLIC LINKS (FIXED PATHS) */}
            <div className="hidden sm:flex space-x-4 text-sm font-medium">
                {/* CRITICAL FIX: Link to top-level path /lost */}
                <Link to="/lost" className="px-3 py-2 text-gray-700 hover:text-red-600 transition">
                    Lost Items
                </Link>
                {/* CRITICAL FIX: Link to top-level path /found */}
                <Link to="/found" className="px-3 py-2 text-gray-700 hover:text-green-600 transition">
                    Found Items
                </Link>
            </div>


          {!user ? (
            // --- Unauthenticated View (Original Design) ---
            <div className="space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            // --- Authenticated View (Avatar & Dropdown) ---
            <div className="relative">
              
              {/* Avatar Toggle Button (Displays the correct two initials, e.g., SN) */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold focus:outline-none"
              >
                {getInitials()} 
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                    
                    {/* Logged-in User Info */}
                    <p className="px-4 pb-2 text-sm text-gray-500 truncate border-b mb-1">
                        Hi, {profile?.name || user.email}
                    </p>

                    {/* Dashboard Link */}
                    <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={closeMenu}
                    >
                        Dashboard
                    </Link>

                    {/* Original Dropdown Links */}
                    <Link
                        to="/dashboard/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={closeMenu}
                    >
                        Profile
                    </Link>
                    <Link
                        to="/dashboard/settings"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={closeMenu}
                    >
                        Settings
                    </Link>

                    {/* Logout Button */}
                    <button
                        onClick={() => {
                            logout();
                            closeMenu();
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition border-t mt-1 pt-1"
                    >
                        Logout
                    </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}