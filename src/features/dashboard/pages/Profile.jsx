import React, { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";
import { getStudent, updateStudent } from "../../../services/student.service";
import { getUserActivities } from "../../../services/activity.service";
import { User, Edit, List } from "lucide-react";

export default function Profile() {
  const { user, initializing } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [activities, setActivities] = useState([]);

  const [isSaving, setIsSaving] = useState(false);

  // Form data for edit
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    address: "",
  });

  // Load student data and activities
  useEffect(() => {
    let isMounted = true;
    if (!initializing && user) {
      setLoading(true);
      const fetchProfileData = async () => {
        try {
          const studentData = await getStudent(user.uid);
          const userActivities = await getUserActivities(user.uid);
          if (isMounted) {
            setStudent(studentData);
            setActivities(userActivities);
            if (studentData) {
              setFormData({
                name: studentData.name || "",
                phone: studentData.phone || "",
                gender: studentData.gender || "",
                address: studentData.address || "",
              });
            }
          }
        } catch (error) {
          console.error("Failed to fetch profile data:", error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };
      fetchProfileData();
    } else if (!initializing && !user) {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [user, initializing]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateStudent(user.uid, formData);
      setStudent((prev) => ({ ...prev, ...formData }));
      setActiveTab("info");
      alert("Profile updated!");
    } catch (err) {
      alert("Error updating profile: " + err.message);
    } finally {
      setIsSaving(false);
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
            onError={(e) => (e.target.src = "/default-avatar.png")}
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
          {[
            { id: "info", label: "Profile Info", icon: <User size={18} /> },
            { id: "edit", label: "Edit", icon: <Edit size={18} /> },
            { id: "activity", label: "Activity", icon: <List size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`pb-2 flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "info" && (
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Department:</span>{" "}
              {student?.department || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Year:</span>{" "}
              {student?.year || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {student?.phone || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Gender:</span>{" "}
              {student?.gender || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Address:</span>{" "}
              {student?.address || "N/A"}
            </p>
          </div>
        )}

        {activeTab === "edit" && (
          <form onSubmit={handleSave} className="space-y-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Name"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Phone"
            />
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Gender"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Address"
            />

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        {activeTab === "activity" && (
          <div className="space-y-2 text-gray-600">
            {activities.length > 0 ? (
              <ul className="list-disc list-inside">
                {activities.map((a, i) => (
                  <li key={i}>
                    {a.message}{" "}
                    <span className="text-sm text-gray-400">
                      ({a.date || "recently"})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent activity.</p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}