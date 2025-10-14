// src/features/auth/components/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { createStudent } from "../../../services/student.service";
import { ALLOWED_DOMAIN } from "../../../config/app";

export default function Signup() {
  const { signupWithEmail } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    address: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!formData.email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      setErr(`Only ${ALLOWED_DOMAIN} emails are allowed`);
      return;
    }

    const requiredFields = ["name", "email", "password", "phone", "gender", "address"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setErr(`Please fill in your ${field}`);
        return;
      }
    }

    try {
      setLoading(true);
      const userCred = await signupWithEmail(formData.email, formData.password);

      // Default profile photo
      const defaultPhoto = "https://ui-avatars.com/api/?name=" + encodeURIComponent(formData.name) + "&size=128&background=random&color=fff&rounded=true";

      await createStudent(userCred.user.uid, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        address: formData.address,
        photo: defaultPhoto,
      });

      navigate("/dashboard");
    } catch (e) {
      setErr(e.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      {err && <p className="text-red-600 mb-3">{err}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Full Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          autoComplete="name"
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="College Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Phone Number"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          autoComplete="tel"
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Gender"
          type="text"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          autoComplete="sex"
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Address"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          autoComplete="street-address"
        />
        <button
          type="submit"
          className="w-full rounded bg-black text-white py-2"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
