// src/features/auth/components/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { ALLOWED_DOMAIN } from "../../../config/app"; // ✅ import domain config

export default function Signup() {
  const { signupWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    // ✅ Check if email ends with college domain
    if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      setErr(`Only ${ALLOWED_DOMAIN} emails are allowed`);
      return;
    }

    try {
      await signupWithEmail(email, password);
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message || "Sign up failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      {err && <p className="text-red-600 mb-3">{err}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="College Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full rounded bg-black text-white py-2">
          Create account
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
