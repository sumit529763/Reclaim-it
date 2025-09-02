// src/features/auth/pages/Login.jsx
import { ALLOWED_DOMAIN } from "../../../config/app";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

export default function Login() {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const isCollegeEmail = (mail) =>
    mail?.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!isCollegeEmail(email)) {
      setErr(`Use your @${ALLOWED_DOMAIN} email to log in`);
      return;
    }

    try {
      await loginWithEmail(email, password);
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message || "Login failed");
    }
  };

  const onGoogleLogin = async () => {
    setErr("");
    try {
      const user = await loginWithGoogle();
      if (!isCollegeEmail(user.email)) {
        throw new Error(`Only @${ALLOWED_DOMAIN} emails are allowed`);
      }
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message || "Google sign-in failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-4">Log in</h1>
      {err && <p className="text-red-600 mb-3">{err}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
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
          Continue
        </button>
      </form>

      <button
        onClick={onGoogleLogin}
        className="w-full rounded border mt-3 py-2"
      >
        Continue with Google
      </button>

      <p className="mt-4 text-sm">
        No account?{" "}
        <Link to="/signup" className="text-blue-600 underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
