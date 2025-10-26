// src/features/auth/pages/Login.jsx

import { ALLOWED_DOMAIN } from "../../../config/app";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

export default function Login() {
  // 🔑 MODIFIED: Import resetPassword function
  const { loginWithEmail, loginWithGoogle, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [message, setMessage] = useState(""); // 🔑 NEW: State for success messages
  const navigate = useNavigate();

  const isCollegeEmail = (mail) =>
    mail?.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMessage(""); // Clear success message

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
    setMessage(""); // Clear success message
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
  
  // 🔑 NEW HANDLER: For Forgot Password link
  const handleResetPassword = async () => {
      setErr("");
      setMessage("");
      
      // 1. Basic Email Check: Must have a value
      if (!email || email.length < 5) {
          setErr("Please enter your email address above before clicking 'Forgot Password'.");
          return;
      }
      
      // 2. Domain Check (Optional but safe)
      if (!isCollegeEmail(email)) {
          setErr("Password reset link can only be sent to your college email address.");
          return;
      }
      
      // 3. Send Reset Email
      try {
          await resetPassword(email);
          // Firebase sends a success response even if the email isn't registered (for security reasons)
          setMessage("✅ Password reset link sent to your email! Check your inbox (and spam folder).");
      } catch (e) {
          console.error("Reset Error:", e);
          setErr("Failed to send reset email. Please ensure the email is correct.");
      }
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-4">Log in</h1>
      {err && <p className="text-red-600 mb-3">{err}</p>}
      {message && <p className="text-green-600 mb-3 bg-green-100 p-2 rounded">{message}</p>} {/* Display success message */}
      
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button className="w-full rounded bg-black text-white py-2">
          Continue
        </button>
      </form>
      
      {/* 🔑 NEW: Forgot Password Link */}
      <div className="text-right mt-2">
          <button 
              type="button" 
              onClick={handleResetPassword}
              className="text-sm text-gray-500 hover:text-red-600 underline"
          >
              Forgot Password?
          </button>
      </div>

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