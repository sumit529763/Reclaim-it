import React from "react";

const Navbar = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Reclaim-it</h1>
        <nav className="space-x-6">
          <a href="#home" className="hover:text-indigo-600">Home</a>
          <a href="#features" className="hover:text-indigo-600">Features</a>
          <a href="#about" className="hover:text-indigo-600">About</a>
          <a href="#contact" className="hover:text-indigo-600">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
