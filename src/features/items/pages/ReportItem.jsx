// src/features/items/pages/ReportItem.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../dashboard/layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";
import { createItem } from "../../../services/items.service";
import { uploadItemPhoto } from "../../../services/upload.service";
import { Button } from "../../../components/common/button";

export default function ReportItem() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ type: "lost", title: "", description: "" });
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
    if (!user) {
      setError("You must be logged in to report an item.");
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
      });
      alert("Report submitted successfully!");
      navigate("/dashboard/reports");
    } catch (e) {
      setError("Failed to submit report. Please try again.");
      console.error("Submission error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Report Lost or Found Item</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}

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

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded p-2"
          />
          {imagePreview && (
            <img 
              src={imagePreview} 
              alt="Image Preview" 
              className="mt-4 rounded-xl max-h-48" 
            />
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </Button>
      </form>
    </DashboardLayout>
  );
}