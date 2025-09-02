// src/features/items/pages/ReportItem.jsx
import React, { useState } from "react";
import DashboardLayout from "../../dashboard/layout/DashboardLayout";

export default function ReportItem() {
  const [form, setForm] = useState({ type: "lost", title: "", description: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", form);
    // later: send to backend (Firebase/DB)
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Report Lost or Found Item</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow max-w-xl"
      >
        {/* Type */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Item Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Item Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Black Wallet"
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add details about the item..."
            className="w-full border rounded p-2"
            rows="4"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Submit Report
        </button>
      </form>
    </DashboardLayout>
  );
}
