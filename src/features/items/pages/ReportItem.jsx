// src/features/items/pages/ReportItem.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { createItem } from "../../../services/items.service";
import { uploadItemPhoto } from "../../../services/upload.service";
import { Button } from "../../../components/common/button";

// 🔑 REQUIRED: Placeholder data for categories and locations 
const ITEM_CATEGORIES = [
  { value: "wallet", label: "Wallet/Pouch" },
  { value: "electronics", label: "Electronics (Phone, Laptop, etc.)" },
  { value: "keys", label: "Keys" },
  { value: "id_card", label: "ID Card/Badge" },
  { value: "other", label: "Other" },
];

const CAMPUS_LOCATIONS = [
  "Library Main Desk", 
  "Student Union Cafeteria", 
  "Engineering Building, Lab 305", 
  "Dormitory Parking Lot A",
  "Other",
];

export default function ReportItem() {
  const navigate = useNavigate();
  const { user, profile } = useAuth(); // Get profile for email
  
  // 🔑 MODIFIED: Add category, location, and date fields to state
  const [form, setForm] = useState({ 
    type: "lost", 
    title: "", 
    description: "",
    category: ITEM_CATEGORIES[0].value, // Default category
    location: CAMPUS_LOCATIONS[0],      // Default location
    date: new Date().toISOString().substring(0, 10), // Default to today's date
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !profile) {
      setError("You must be logged in with a full profile to report an item.");
      return;
    }
    if (!form.title || !form.description || !form.category || !form.location) {
        setError("Please fill out all required fields.");
        return;
    }


    setLoading(true);
    setError(null);

    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadItemPhoto(imageFile);
      }

      await createItem({
        ...form,
        imageUrl: imageUrl,
        ownerId: user.uid,
        ownerEmail: profile.email, // Add owner email for contact
      });
      
      alert("Report submitted successfully! It is now pending admin review.");
      navigate("/dashboard/reports");
      
    } catch (e) {
      setError(e.message || "Failed to submit report. Please try again.");
      console.error("Submission error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8"> 
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">Report Lost or Found Item</h2>
      <p className="mb-4 text-gray-600">Your report will be reviewed by campus staff before being published.</p>
      
      {error && <p className="text-red-500 mb-4 bg-red-100 p-3 rounded">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto"
      >
        {/* Type Selector and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          
          {/* Item Type */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Item Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50"
            >
              <option value="lost">Lost Item 😞</option>
              <option value="found">Found Item 🙌</option>
            </select>
          </div>

          {/* 🔑 NEW FIELD: Category */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50"
              required
            >
              {ITEM_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Title and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          
          {/* Title */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Item Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Black Wallet"
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            />
          </div>

          {/* 🔑 NEW FIELD: Date */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Date {form.type === 'lost' ? 'Lost' : 'Found'}
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            />
          </div>
        </div>
        
        {/* 🔑 NEW FIELD: Location */}
        <div className="mb-4">
          <label className="block font-semibold mb-1 text-gray-700">
            {form.type === 'lost' ? 'Last Seen Location' : 'Found Location'}
          </label>
          <select
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50"
            required
          >
            {CAMPUS_LOCATIONS.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-semibold mb-1 text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add details about the item..."
            className="w-full border border-gray-300 rounded-lg p-3"
            rows="4"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6 border-t pt-4">
          <label className="block font-semibold mb-3 text-gray-700">Image (Clear Photo is Best!)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-dashed border-gray-400 rounded-lg"
          />
          {imagePreview && (
            <img 
              src={imagePreview} 
              alt="Image Preview" 
              className="mt-4 rounded-lg max-h-48 object-cover shadow-md" 
            />
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 text-lg"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Report for Review"}
        </Button>
      </form>
    </div>
  );
}