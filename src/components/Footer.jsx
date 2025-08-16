import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} Reclaim-it. All rights reserved.</p>
        <p>Built with ❤️ using React & Tailwind</p>
      </div>
    </footer>
  );
};

export default Footer;
