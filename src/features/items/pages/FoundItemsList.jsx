// src/features/items/pages/FoundItemsList.jsx (CORRECTED)
import React, { useEffect, useState } from "react";
import { getFoundItems } from "../../../services/items.service";
// import DashboardLayout from "../../dashboard/layout/DashboardLayout"; // <<< REMOVE THIS IMPORT

export default function FoundItemsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getFoundItems();
      setItems(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p className="p-4">Loading found items...</p>;

  return (
    // ONLY RETURN THE PAGE'S SPECIFIC CONTENT
    <>
      <h2 className="text-2xl font-bold mb-6">Found Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow rounded-xl p-4 flex flex-col"
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="rounded mb-3 max-h-48 object-cover"
              />
            )}
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
            <span className="mt-2 text-sm text-green-600 font-medium">
              Status: {item.status}
            </span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-gray-500">No found items reported yet.</p>
        )}
      </div>
    </>
  );
}