// src/components/layout/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-12">
      <div className="container mx-auto text-center text-sm">
        © {new Date().getFullYear()} Reclaim-it. All rights reserved.
      </div>
    </footer>
  );
}
