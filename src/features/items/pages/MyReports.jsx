// src/features/items/pages/MyItems.jsx
import React from "react";

export default function MyItems() {
  const items = [
    { id: 1, name: "Wallet", status: "Lost", date: "2025-08-10" },
    { id: 2, name: "Umbrella", status: "Found", date: "2025-08-12" },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">My Items</h1>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.id} className="bg-white p-4 rounded shadow flex justify-between">
            <div>
              <p className="font-medium">{it.name}</p>
              <p className="text-sm text-gray-500">{it.date}</p>
            </div>
            <span className="px-2 py-1 rounded text-white bg-gray-800 h-fit">{it.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
