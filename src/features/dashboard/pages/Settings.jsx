// src/features/dashboard/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import {
  updateEmail,
  updatePassword,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

export default function Settings() {
  const { user, profile } = useAuth(); // Firebase User + Firestore profile

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); // For re-authentication
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize fields from Firebase user
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Detect changes
  useEffect(() => {
    if (!user) return;
    setHasChanges(
      displayName !== (user.displayName || "") ||
      email !== (user.email || "") ||
      newPassword !== ""
    );
  }, [displayName, email, newPassword, user]);

  // Validation
  const validate = () => {
    const errors = {};

    if (!displayName.trim()) errors.displayName = "Display name cannot be empty";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.email = "Invalid email format";

    if (newPassword && newPassword.length < 6)
      errors.newPassword = "Password must be at least 6 characters";

    if ((email !== user.email || newPassword) && !currentPassword)
      errors.currentPassword = "Current password is required for email/password changes";

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    setLoading(true);

    try {
      // Reauthenticate if needed
      if (email !== user.email || newPassword) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
      }

      // Update displayName
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      // Update email
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      // Update password
      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      setMessage("Profile updated successfully!");
      setNewPassword("");
      setCurrentPassword("");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{message}</div>
      )}

      <form onSubmit={handleUpdateProfile} className="space-y-4">
        {/* Display Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
              error.displayName ? "border-red-500" : ""
            }`}
          />
          {error.displayName && (
            <p className="text-red-500 text-sm mt-1">{error.displayName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
              error.email ? "border-red-500" : ""
            }`}
          />
          {error.email && (
            <p className="text-red-500 text-sm mt-1">{error.email}</p>
          )}
        </div>

        {/* Current Password */}
        {(email !== user?.email || newPassword) && (
          <div>
            <label className="block text-gray-700 font-medium mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Required to change email or password"
              className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
                error.currentPassword ? "border-red-500" : ""
              }`}
            />
            {error.currentPassword && (
              <p className="text-red-500 text-sm mt-1">{error.currentPassword}</p>
            )}
          </div>
        )}

        {/* New Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
            className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
              error.newPassword ? "border-red-500" : ""
            }`}
          />
          {error.newPassword && (
            <p className="text-red-500 text-sm mt-1">{error.newPassword}</p>
          )}
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={loading || !hasChanges || Object.keys(error).length > 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
