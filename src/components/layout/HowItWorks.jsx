import React from "react";

export default function HowItWorks() {
  const steps = [
    { step: "1", title: "Report Lost Item", desc: "Submit details of your lost item easily." },
    { step: "2", title: "Finder Reports", desc: "Finders report items they discovered." },
    { step: "3", title: "Smart Matching", desc: "Our system matches lost items with found ones." },
    { step: "4", title: "Reclaim It!", desc: "Connect and reclaim your item securely." },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          A simple, reliable process to help you find your belongings.
        </p>

        <div className="mt-12 grid md:grid-cols-4 gap-8">
          {steps.map((item, i) => (
            <div
              key={i}
              className="p-6 border rounded-xl hover:shadow-md transition bg-gray-50"
            >
              <div className="text-2xl font-bold text-blue-600">{item.step}</div>
              <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
