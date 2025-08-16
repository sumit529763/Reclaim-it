import React from "react";

const Contact = () => {
  return (
    <section id="contact" className="py-16 bg-gray-100">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-bold mb-6">Get in Touch</h3>
        <p className="text-lg mb-6 text-gray-600">
          Have questions or feedback? We’d love to hear from you.
        </p>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-700">
          Contact Us
        </button>
      </div>
    </section>
  );
};

export default Contact;
