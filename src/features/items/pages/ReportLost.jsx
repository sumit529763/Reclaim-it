
import React, { useState } from "react";
import { createItem, uploadItemPhoto } from "../services/items.service";

export default function ReportLost() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      let photoURL = null;

      if (photo) {
        // upload image to Firebase Storage
        photoURL = await uploadItemPhoto(photo);
      }

      const itemData = {
        name,
        description,
        location,
        type: "lost", // 🔥 mark it as lost
        photoURL,
        createdAt: new Date(),
      };

      // use the same service layer as ReportItem.jsx
      await createItem(itemData);

      setStatus("Lost item reported successfully ✅");
      setName("");
      setDescription("");
      setLocation("");
      setPhoto(null);
    } catch (err) {
      console.error("Error reporting lost item:", err);
      setStatus("Error reporting lost item ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Report Lost Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Item Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Last Seen Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Lost Report"}
        </button>
      </form>
      {status && <p className="mt-3 text-center text-sm">{status}</p>}
    </div>
  );
}
