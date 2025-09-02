import React from "react";

export default function Inspiration() {
  const items = [
    {
      title: "Community First",
      desc: "Bringing together people to support each other when items go missing.",
      icon: "👥",
    },
    {
      title: "Cloud Powered",
      desc: "Built on Firebase for secure, scalable, and reliable storage.",
      icon: "☁️",
    },
    {
      title: "Instant Matching",
      desc: "Smart search to quickly connect owners with finders.",
      icon: "⚡",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Why Choose Reclaim-it?
        </h2>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Inspired by real-world needs, our platform is designed to make the lost and found process
          professional, fast, and community-driven.
        </p>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="text-4xl">{item.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-blue-600">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
