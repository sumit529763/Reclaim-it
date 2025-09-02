import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Contact Us
        </h2>
        <p className="text-gray-600 mb-8">
          Have questions or need help? Reach out to us anytime.
        </p>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
            <Mail className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-semibold">Email</h3>
            <p className="text-sm text-gray-500">naiks0234@gmail.com</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
            <Phone className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-semibold">Phone</h3>
            <p className="text-sm text-gray-500">+91 6372887548</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
            <MapPin className="w-6 h-6 text-red-600 mb-2" />
            <h3 className="font-semibold">Address</h3>
            <p className="text-sm text-gray-500">Gunupur, Odisha, India</p>
          </div>
        </div>
      </div>
    </section>
  );
}
