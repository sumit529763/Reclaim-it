// src/features/items/pages/ReportFound.jsx
import React, { useState } from "react";

export default function ReportFound() {
  const [form, setForm] = useState({ item: "", where: "", contact: "" });

  const submit = (e) => {
    e.preventDefault();
    alert(`Found: ${JSON.stringify(form, null, 2)}`);
    setForm({ item: "", where: "", contact: "" });
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Report Found Item</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Item"
               value={form.item} onChange={e=>setForm(s=>({...s, item:e.target.value}))}/>
        <input className="w-full border p-2 rounded" placeholder="Where you found it?"
               value={form.where} onChange={e=>setForm(s=>({...s, where:e.target.value}))}/>
        <input className="w-full border p-2 rounded" placeholder="Your contact"
               value={form.contact} onChange={e=>setForm(s=>({...s, contact:e.target.value}))}/>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
}
