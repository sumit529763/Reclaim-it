// src/features/dashboard/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";
import { getStudent, updateStudent } from "../../../services/student.service";

export default function Profile() {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      getStudent(user.uid).then((data) => {
        setStudent(data);
        if (data) {
          setName(data.name || "");
          setPhone(data.phone || "");
        }
        setLoading(false);
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateStudent(user.uid, { name, phone });
      alert("Profile updated!");
      setStudent((prev) => ({ ...prev, name, phone }));
      setActiveTab("info");
    } catch (err) {
      alert("Error updating profile: " + err.message);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <p>Please log in to see your profile.</p>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <p>Loading profile...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <div className="bg-white shadow-lg rounded-xl p-6 max-w-2xl">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 border-b pb-4 mb-4">
          <img
            src={student?.photo || "/default-avatar.png"}
            alt={student?.name}
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <h3 className="text-xl font-semibold">{student?.name}</h3>
            <p className="text-gray-600">Roll No: {student?.roll || "N/A"}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 border-b mb-4">
          {["info", "edit", "activity"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "info"
                ? "Profile Info"
                : tab === "edit"
                ? "Edit"
                : "Activity"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "info" && (
          <div>
            <p>
              <span className="font-semibold">Department:</span>{" "}
              {student?.department || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Year:</span> {student?.year || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {student?.phone || "N/A"}
            </p>
          </div>
        )}

        {activeTab === "edit" && (
          <form onSubmit={handleSave} className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Name"
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Phone"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Save Changes
            </button>
          </form>
        )}

        {activeTab === "activity" && (
          <div>
            <p className="text-gray-600">
              Recent activity will appear here (e.g. reported/lost items).
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
