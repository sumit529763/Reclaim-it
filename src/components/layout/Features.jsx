import React from "react";

const Features = () => {
  return (
    <section id="features" className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-3xl font-bold text-center mb-12">
          Why Choose Reclaim-it?
        </h3>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3 text-indigo-600">
              Easy Reporting
            </h4>
            <p>
              Quickly report lost or found items with just a few clicks. Our
              simple interface makes it effortless.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3 text-indigo-600">
              Smart Matching
            </h4>
            <p>
              Our system connects lost and found reports intelligently, making
              it easier to reunite items with their owners.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3 text-indigo-600">
              Community Driven
            </h4>
            <p>
              Built for students and organizations, fostering trust and
              collaboration to help you get your things back.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
