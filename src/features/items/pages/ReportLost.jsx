// src/features/items/pages/ReportLost.jsx
import React, { useState } from "react";

export default function ReportLost() {
  const [form, setForm] = useState({ item: "", lastSeen: "", details: "" });

  const submit = (e) => {
    e.preventDefault();
    // TODO: send to Firestore later
    alert(`Lost: ${JSON.stringify(form, null, 2)}`);
    setForm({ item: "", lastSeen: "", details: "" });
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Report Lost Item</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Item"
               value={form.item} onChange={e=>setForm(s=>({...s, item:e.target.value}))}/>
        <input className="w-full border p-2 rounded" placeholder="Last seen location"
               value={form.lastSeen} onChange={e=>setForm(s=>({...s, lastSeen:e.target.value}))}/>
        <textarea className="w-full border p-2 rounded" placeholder="Details"
               value={form.details} onChange={e=>setForm(s=>({...s, details:e.target.value}))}/>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
}
