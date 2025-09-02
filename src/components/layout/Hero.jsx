import React from "react";
import { Link } from "react-router-dom";
import coverImg from "../../assets/cover.png"; // Adjust path as necessary

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 items-center gap-10">
        {/* Text */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Lost Something? <br /> Let’s Help You Reclaim It.
          </h1>
          <p className="mt-4 text-lg text-blue-100">
            A cloud-powered platform to connect finders and owners of lost items
            quickly and securely.
          </p>
          <Link
            to="/signup"
            className="mt-6 inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Illustration / Image Placeholder */}
        <div className="hidden md:block">
          <img
            src={coverImg}
            alt="Lost and Found"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
