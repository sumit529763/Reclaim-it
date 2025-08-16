import React from "react";

const Hero = () => {
  return (
    <section
      id="home"
      className="flex-1 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center px-6"
    >
      <div>
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          Find. Reclaim. Connect.
        </h2>
        <p className="text-lg md:text-xl mb-6">
          Reclaim-it helps you report, track, and recover lost items with ease.
        </p>
        <button className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-gray-100">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Hero;
