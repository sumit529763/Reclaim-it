// src/features/items/pages/ItemDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// import DashboardLayout from '../../dashboard/layout/DashboardLayout'; // <-- REMOVE THIS IMPORT
import { getItem, updateItemStatus } from "../../../services/items.service";
import { Button } from "../../../components/common/button";

export default function ItemDetails() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (itemId) {
      const fetchItem = async () => {
        try {
          const fetchedItem = await getItem(itemId);
          if (fetchedItem) {
            setItem(fetchedItem);
          } else {
            setError("Item not found.");
          }
        } catch (err) {
          setError("Failed to fetch item details.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchItem();
    } else {
      setError("No item ID provided.");
      setLoading(false);
    }
  }, [itemId]);

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      const success = await updateItemStatus(itemId, newStatus);
      if (success) {
        setItem((prev) => ({ ...prev, status: newStatus }));
        alert(`Status updated to ${newStatus}!`);
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      alert("Error updating status.");
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      // REMOVED DashboardLayout
      <p className="text-center text-lg mt-8">Loading item details...</p>
    );
  }

  if (error) {
    return (
      // REMOVED DashboardLayout
      <div className="p-6 text-center text-red-500">
                <p>{error}</p>       {" "}
        <Link
          to="/dashboard/reports"
          className="text-blue-600 underline mt-4 block"
        >
          Go back to my reports
        </Link>
             {" "}
      </div>
    );
  }
  if (!item) {
    return (
      // REMOVED DashboardLayout
      <p className="text-center text-lg mt-8">Item not found.</p>
    );
  }

  return (
    // REMOVED DashboardLayout
    <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{item.title}</h2>     {" "}
      <div className="bg-white rounded-xl shadow p-6">
               {" "}
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-80 object-cover rounded-lg mb-4"
          />
        )}
               {" "}
        <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Description:</span>{" "}
          {item.description}       {" "}
        </p>
               {" "}
        <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Status:</span> {item.status}
                 {" "}
        </p>
               {" "}
        <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Reported On:</span>{" "}
          {new Date(item.createdAt?.toDate()).toLocaleDateString()}       {" "}
        </p>
               {" "}
        <div className="flex space-x-2 mt-4">
                   {" "}
          <Button
            onClick={() => handleUpdateStatus("resolved")}
            className="bg-green-500 hover:bg-green-600 text-white"
            disabled={isUpdating || item.status === "resolved"}
          >
                        {isUpdating ? "Updating..." : "Mark as Resolved"}       
             {" "}
          </Button>
                   {" "}
          <Button
            onClick={() => handleUpdateStatus("in_review")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            disabled={isUpdating || item.status === "in_review"}
          >
                        {isUpdating ? "Updating..." : "Mark as In Review"}     
               {" "}
          </Button>
                 {" "}
        </div>
               {" "}
        <Link
          to="/dashboard/reports"
          className="text-blue-600 underline mt-4 block"
        >
          Go back to my reports
        </Link>
             {" "}
      </div>
         {" "}
    </div>
  );
}
