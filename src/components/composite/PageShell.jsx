// src/components/layout/PageShell.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageShell({ children }) {
  const location = useLocation();

  // Hide Navbar + Footer on dashboard routes
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboard && <Navbar />}

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {!isDashboard && <Footer />}
    </div>
  );
}
