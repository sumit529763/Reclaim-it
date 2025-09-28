import React, { useEffect, useState } from "react";
import DashboardLayout from "../../dashboard/layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";
import { getMyItems } from "../../../services/items.service";
import { Link } from "react-router-dom"; // <-- Add this import

export default function MyReports() {
  const { user, initializing } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initializing && user) {
      const fetchReports = async () => {
        try {
          const fetchedReports = await getMyItems(user.uid);
          setReports(fetchedReports);
        } catch (e) {
          console.error("Failed to fetch reports:", e);
          setError("Failed to load reports. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      fetchReports();
    } else if (!initializing && !user) {
      setLoading(false);
    }
  }, [user, initializing]);

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-center text-lg mt-8">Loading your reports...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-center text-red-500 mt-8">{error}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-bold mb-4">My Reports</h1>
        {reports.length === 0 ? (
          <p className="text-gray-500">You have not submitted any reports yet.</p>
        ) : (
          <ul className="space-y-2">
            {reports.map((report) => (
              <li
                key={report.id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
              >
                <Link to={`/item/${report.id}`} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {report.imageUrl && (
                      <img
                        src={report.imageUrl}
                        alt={report.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="font-medium text-lg">{report.title}</p>
                      <p className="text-sm text-gray-500">
                        Type: {report.type}
                      </p>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(report.createdAt?.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}