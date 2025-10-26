// src/features/dashboard/pages/Profile.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { getStudent, updateStudent } from "../../../services/student.service";
// 🔑 ASSUMPTION: logActivity and getUserActivities are imported and available
import { getUserActivities, logActivity } from "../../../services/activity.service"; 
import {
  User,
  Edit,
  List,
  Mail,
  Phone,
  MapPin,
  Loader2,
  Calendar,
} from "lucide-react";

// --- Helper to generate default letter avatar (remains unchanged) ---
const generateDefaultAvatar = (name) => {
  const firstLetter = (name || "A")[0].toUpperCase();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "A"
  )}&size=128&background=random&color=fff&rounded=true`;
};

// --- Helper Component for Displaying Info Fields (remains unchanged) ---
const ProfileInfoField = ({ label, value, icon: Icon, isLoading }) => (
  <div className="flex items-start space-x-3 text-gray-700">
    <Icon size={18} className="text-blue-500 mt-1 flex-shrink-0" />
    <div>
      <span className="font-medium text-gray-500 text-sm">{label}</span>
      {isLoading ? (
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mt-1"></div>
      ) : (
        <p className="text-base font-semibold">{value || "N/A"}</p>
      )}
    </div>
  </div>
);

// --- Activity List Item Component (CORRECTED to handle fetched data) ---
const ActivityItem = ({ action, createdAt }) => {
    // Format the Firestore Timestamp object for display
    const dateStr = createdAt?.toDate 
        ? createdAt.toDate().toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })
        : 'recently'; 

    return (
        <li className="flex justify-between items-center py-2 border-b last:border-b-0">
            {/* Using 'action' field from activity.service.js */}
            <span className="text-gray-700">{action || 'General activity'}</span> 
            <span className="text-sm text-gray-400">{dateStr}</span>
        </li>
    );
};

export default function Profile() {
  const { user, initializing } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [activities, setActivities] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // 🔑 FIX 1: ADD Department and Year to the formData state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    address: "",
    department: "", // New Field
    year: "",       // New Field
    photo: "",
  });

  // --- Fetch user and activities (MODIFIED to populate new fields) ---
  useEffect(() => {
    let isMounted = true;
    if (!initializing && user) {
      setLoading(true);
      const fetchProfileData = async () => {
        try {
          // Fetch student data and activities concurrently
          const [studentData, userActivities] = await Promise.all([
            getStudent(user.uid),
            getUserActivities(user.uid),
          ]);

          // Use dynamic avatar if no photo
          if (studentData && !studentData.photo) {
            studentData.photo = generateDefaultAvatar(studentData.name);
          }

          if (isMounted) {
            setStudent(studentData);
            setActivities(userActivities);
            if (studentData) {
              setFormData({
                name: studentData.name || "",
                phone: studentData.phone || "",
                gender: studentData.gender || "",
                address: studentData.address || "",
                department: studentData.department || "", // Populate new field
                year: studentData.year || "",           // Populate new field
                photo:
                  studentData.photo || generateDefaultAvatar(studentData.name),
              });
            }
          }
        } catch (error) {
          console.error("Failed to fetch profile data:", error);
        } finally {
          if (isMounted) setLoading(false);
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

  // --- Handle Image Upload to Cloudinary (remains unchanged) ---
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_PROFILE_PRESET; 

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary configuration missing. Check your .env file.");
      return;
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", uploadPreset);

    try {
      setIsSaving(true);
      const res = await fetch(url, { method: "POST", body: form });
      const data = await res.json();

      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, photo: data.secure_url }));
        alert("Photo uploaded successfully! Click 'Save Profile' to finalize the change.");
      } else {
        throw new Error(data.error?.message || "Cloudinary upload error.");
      }
    } catch (err) {
      console.error("Photo upload failed:", err);
      alert(`Photo upload failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Save updated profile data to Firestore (MODIFIED to log activity) ---
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateStudent(user.uid, formData);
      // Update the main student state and revert to info tab
      setStudent((prev) => ({ ...prev, ...formData }));
      setActiveTab("info");
      alert("Profile updated successfully!");
      
      // 🔑 LOG ACTIVITY: Profile saved
      await logActivity(user.uid, "Updated profile information", 'profile_update');
      
    } catch (err) {
      console.error("Error updating profile:", err.message);
      alert(`Error updating profile: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Initializing/Error States (REMAINS UNCHANGED) ---
  if (initializing) {
    return (
      <div className="flex items-center justify-center p-8 h-64">
        <Loader2 className="animate-spin text-blue-500 mr-2" size={32} />
        <p className="text-xl text-gray-600">Initializing user session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <p className="p-6 text-xl font-semibold text-red-600">
        Please log in to view your profile.
      </p>
    );
  }
  
  // --- Main Render ---
  return (
    <>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">
        User Profile
      </h1>

      <div className="bg-white shadow-xl rounded-xl overflow-hidden max-w-4xl">
        {/* Profile Header (remains unchanged) */}
        <div className="p-6 border-b bg-gray-50 flex flex-col sm:flex-row items-center space-x-6">
          <img
            src={formData.photo || generateDefaultAvatar(formData.name)}
            alt={formData.name || "Anonymous"}
            onError={(e) =>
              (e.target.src = generateDefaultAvatar(formData.name))
            }
            className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
          />
          <div>
            {loading ? (
              <div className="space-y-2">
                <div className="h-6 w-56 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900">
                  {student?.name || "Anonymous User"}
                </h2>
                <p className="text-blue-600 font-medium">
                  Roll No: {student?.roll || "N/A"}
                </p>
                <p className="text-gray-500 flex items-center mt-1">
                  <Mail size={16} className="mr-2" />
                  {user.email}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="p-6">
          <div className="flex space-x-6 border-b pb-4 mb-6">
            {[
              { id: "info", label: "Profile Info", icon: User },
              { id: "edit", label: "Edit Profile", icon: Edit },
              { id: "activity", label: "Recent Activity", icon: List },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`pb-2 flex items-center gap-2 transition duration-150 ease-in-out ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 font-bold text-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="pt-4">
            {/* Profile Info */}
            {activeTab === "info" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 🔑 FIX: Department Field */}
                <ProfileInfoField
                  label="Department"
                  value={student?.department} // Now accessible
                  icon={List}
                  isLoading={loading}
                />
                  {/* 🔑 FIX: Current Year Field */}
                <ProfileInfoField
                  label="Current Year"
                  value={student?.year} // Now accessible
                  icon={Calendar}
                  isLoading={loading}
                />
                <ProfileInfoField
                  label="Phone Number"
                  value={student?.phone}
                  icon={Phone}
                  isLoading={loading}
                />
                <ProfileInfoField
                  label="Gender"
                  value={student?.gender}
                  icon={User}
                  isLoading={loading}
                />
                <div className="md:col-span-2">
                  <ProfileInfoField
                    label="Address"
                    value={student?.address}
                    icon={MapPin}
                    isLoading={loading}
                  />
                </div>
              </div>
            )}

            {/* Edit Profile (FIXED: Added Department and Year inputs) */}
            {activeTab === "edit" && (
              <form onSubmit={handleSave} className="space-y-4">
                <label className="block">
                  <span className="text-gray-700">Profile Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="mt-1 block w-full"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Full Name</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Name"
                    autoComplete="name"
                  />
                </label>
                
                {/* 🔑 FIX: New Department Input */}
                <label className="block">
                  <span className="text-gray-700">Department</span>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Computer Science"
                  />
                </label>

                {/* 🔑 FIX: New Current Year Input */}
                <label className="block">
                  <span className="text-gray-700">Current Year</span>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 3rd Year"
                  />
                </label>

                {/* Remaining fields remain unchanged */}
                <label className="block">
                  <span className="text-gray-700">Phone Number</span>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Phone"
                    autoComplete="tel"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Gender</span>
                  <input
                    type="text"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Gender"
                    autoComplete="sex"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Address</span>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Address"
                    autoComplete="street-address"
                  />
                </label>

                <button
                  type="submit"
                  className="w-full px-4 py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>
              </form>
            )}

            {/* Recent Activity (remains unchanged) */}
            {activeTab === "activity" && (
              <ul className="divide-y divide-gray-200">
                {activities.length === 0 ? (
                  <p className="text-gray-500">No recent activity</p>
                ) : (
                    activities.map((act, idx) => (
                        // Corrected to use the standard fields returned by your activity service
                        <ActivityItem key={idx} message={act.action} date={act.createdAt} />
                    ))
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}