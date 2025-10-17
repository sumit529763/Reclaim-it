// src/features/dashboard/pages/AdminTools.jsx

import React, { useState, useEffect } from 'react';
import { 
  getItemsByStatusForAdmin, 
  updateItemStatus 
} from '../../../services/items.service';
import { useAuth } from '../../../hooks/useAuth'; 

// --- Helper Component: AdminItemCard ---
// A reusable component for displaying item details and action buttons
const AdminItemCard = ({ item, onAction }) => {
  
  // Convert Firestore Timestamp to readable date
  const reportedDate = item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'N/A';
  const itemType = item.type === 'lost' ? 'Lost' : 'Found';
  
  return (
      <div className="border border-gray-200 p-4 mb-3 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center bg-white hover:shadow-md transition">
          <div className="flex-1 min-w-0 mb-3 md:mb-0">
              <h3 className="text-lg font-bold text-gray-800 truncate">
                  {item.name || `[ID: ${item.id.substring(0, 6)}...]`}
                  <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${itemType === 'Found' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {itemType}
                  </span>
              </h3>
              <p className="text-sm text-gray-600 truncate">
                  <span className="font-medium">Category:</span> {item.category} | 
                  <span className="font-medium ml-2">Location:</span> {item.location}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Reported by: {item.ownerEmail || 'Email not available'} on {reportedDate}
              </p>
          </div>
          
          {/* Action Buttons (Conditional based on current status) */}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
              
              {/* Action for 'in_review' items */}
              {item.status === 'in_review' && (
                  <button 
                      onClick={() => {
                        // If it was reported as 'found', verify it to 'active_found'.
                        // If it was reported as 'lost', verify it to 'active_lost'.
                        const newStatus = item.type === 'found' ? 'active_found' : 'active_lost';
                        onAction(item.id, newStatus, `Verifying as ${newStatus}`);
                      }}
                      className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition"
                  >
                      Verify & Publish
                  </button>
              )}
              
              {/* Actions for active items */}
              {(item.status === 'active_found' || item.status === 'active_lost') && (
                  <button 
                      onClick={() => onAction(item.id, 'resolved', 'Marking as RESOLVED')}
                      className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition"
                  >
                      Mark as Returned/Resolved
                  </button>
              )}

              {/* General View Details Button */}
              <button 
                  onClick={() => window.open(`/item/${item.id}`, '_blank')} // Open in new tab
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition"
              >
                  View Details
              </button>
          </div>
      </div>
  );
};


// --- Main Component: AdminTools ---
export default function AdminTools() {
    const { isAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState('in_review');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Mapping keys to your Firestore status fields
    const statusMap = {
        'in_review': 'in_review',
        'active_lost': 'active_lost',
        'active_found': 'active_found',
        'resolved': 'resolved'
    };

    const fetchItems = async (status) => {
        setLoading(true);
        // Uses the new service function we just implemented
        const data = await getItemsByStatusForAdmin(status); 
        setItems(data);
        setLoading(false);
    };

    // 1. Initial fetch and refetch on tab change
    useEffect(() => {
        if (isAdmin) {
          fetchItems(statusMap[activeTab]);
        }
    }, [activeTab, isAdmin]); // Depend on activeTab and isAdmin

    
    // 2. Handle the administrative action (Verify/Resolve)
    const handleStatusUpdate = async (itemId, newStatus, message) => {
        if (!window.confirm(`Are you sure you want to proceed with: ${message}?`)) {
          return;
        }

        const success = await updateItemStatus(itemId, newStatus);

        if (success) {
            alert(`Item status successfully updated to ${newStatus}!`);
            
            // OPTIMIZATION: Instead of refetching everything, we can just remove the item from the local state
            setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } else {
            alert('Failed to update item status. Please check your console and Firestore rules.');
        }
    };


    if (!isAdmin) {
      // Should be blocked by AdminGuard, but good to have a fallback
      return <div className="p-10 text-center text-red-500">ACCESS DENIED</div>;
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold mb-2 text-indigo-700">Campus Administration</h1>
            <p className="mb-8 text-gray-600">Review, approve, and resolve item reports across the campus.</p>

            {/* Tab Navigation */}
            <div className="flex border-b mb-6 bg-white rounded-t-lg shadow-inner">
                {Object.keys(statusMap).map(key => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`py-3 px-6 text-base font-semibold transition-colors duration-200 ${
                            activeTab === key 
                            ? 'border-b-4 border-indigo-600 text-indigo-800' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {key.replace(/_/g, ' ').toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-5 text-gray-700 capitalize">
                    {activeTab.replace(/_/g, ' ')} Queue ({items.length})
                </h2>
                
                {loading ? (
                    <p className="text-center py-10 text-indigo-500 font-medium">Loading item data... ⚙️</p>
                ) : items.length === 0 ? (
                    <p className="text-center py-10 text-gray-500">
                      🎉 All clear! No items in the **{activeTab.replace(/_/g, ' ')}** queue.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {items.map(item => (
                            <AdminItemCard key={item.id} item={item} onAction={handleStatusUpdate} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}