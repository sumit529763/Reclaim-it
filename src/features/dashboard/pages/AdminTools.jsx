// src/features/dashboard/pages/AdminTools.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    getItemsByStatusForAdmin, 
    updateItemStatus,
    deleteItem // 🔑 NEW IMPORT
} from '../../../services/items.service'; 
import { useAuth } from '../../../hooks/useAuth';
import { Clock, CheckCircle, Package, AlertTriangle, ChevronRight, Loader2, Trash2 } from 'lucide-react'; // ICONS ADDED

// Helper component for displaying status and type within the card
const StatusBadge = ({ type, status }) => {
    let typeColor = type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';
    let baseColor = status === 'resolved' ? 'bg-gray-100 text-gray-500' : typeColor;

    const statusMap = {
        'in_review': 'Pending Review',
        'active_lost': 'Active',
        'active_found': 'Active',
        'resolved': 'Resolved',
    };

    return (
        <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${baseColor}`}>
            <Package size={12} className="hidden sm:block" />
            {type.toUpperCase()} / {statusMap[status] || 'N/A'}
        </span>
    );
};


// --- Admin Item Card Component ---
const AdminItemCard = ({ item, onAction }) => {
    // Actions are consolidated into a single handler that takes an actionType
    const isReadyForResolution = item.status === 'active_found' || item.status === 'active_lost';
    const isReviewPending = item.status === 'in_review';

    // Format item ID and date safely
    const shortId = item.id.substring(0, 8);
    const reportedDate = item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'N/A';
    
    return (
        <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white hover:shadow-lg transition flex flex-col sm:flex-row sm:items-center justify-between">
            
            {/* ITEM DETAILS & METADATA */}
            <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                        {item.title || `Item ID: ${shortId}...`}
                    </h3>
                    <StatusBadge type={item.type} status={item.status} />
                </div>
                
                <p className="text-sm text-gray-600 truncate">
                    <span className="font-medium">Category:</span> {item.category} | 
                    <span className="font-medium ml-2">Location:</span> {item.location}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Reported by: {item.ownerEmail} on {reportedDate}
                </p>
            </div>

            {/* ACTIONS CONTAINER */}
            <div className="flex space-x-2 flex-shrink-0 mt-2 sm:mt-0">
                
                {/* 1. VERIFY & PUBLISH Button (IN REVIEW Tab) */}
                {isReviewPending && (
                    <button 
                        onClick={() => {
                            const newStatus = item.type === 'found' ? 'active_found' : 'active_lost';
                            onAction(item.id, 'update', `Verifying as ${newStatus}`, newStatus); 
                        }}
                        className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition flex items-center"
                    >
                        <AlertTriangle size={16} className="mr-1" />
                        Verify & Publish
                    </button>
                )}
                
                {/* 2. RESOLVE Button (ACTIVE Tabs) */}
                {isReadyForResolution && (
                     <button 
                        onClick={() => onAction(item.id, 'update', 'Marking as RESOLVED/RETURNED', 'resolved')} 
                        className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition flex items-center"
                    >
                        <CheckCircle size={16} className="mr-1" />
                        Mark as Resolved
                    </button>
                )}

                {/* 🔑 NEW: DELETE BUTTON (Visible on all tabs for easy cleanup) */}
                <button
                    onClick={() => onAction(item.id, 'delete', 'PERMANENTLY DELETE this report')}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition flex items-center"
                >
                    <Trash2 size={16} className="mr-1" />
                    Delete
                </button>

                {/* 3. VIEW DETAILS Button (Always visible) */}
                <Link
                    to={`/item/${item.id}`}
                    target="_blank" // Opens in new tab for easy review
                    className="flex items-center text-gray-600 border border-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
                >
                    View <ChevronRight size={16} />
                </Link>
            </div>
        </div>
    );
};


// --- Main Component: AdminTools ---
export default function AdminTools() {
    const { isAdmin } = useAuth();
    // Maps the key to the specific status filter used in the service function
    const [activeTab, setActiveTab] = useState('in_review');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // 🔑 Map keys to database status fields
    const statusMap = {
        'in_review': 'in_review',
        'active_lost': 'active_lost',
        'active_found': 'active_found',
        'resolved': 'resolved'
    };

    // --- Data Fetching Logic ---
    const fetchItems = async (status) => {
        if (!isAdmin) return;
        setLoading(true);
        const data = await getItemsByStatusForAdmin(status);
        setItems(data);
        setLoading(false);
    };

    // Load items on tab change
    useEffect(() => {
        fetchItems(statusMap[activeTab]);
    }, [activeTab, isAdmin]);


    // 2. Handle the administrative action (UPDATED to handle 'delete')
    const handleAdminAction = async (itemId, actionType, message, newStatus = null) => {
        if (!window.confirm(`Admin Action: ${message}? This action requires an Admin role.`)) return;

        setLoading(true);
        let success = false;
        
        // 🔑 SWITCH LOGIC: Handle update or delete based on actionType
        if (actionType === 'delete') {
            success = await deleteItem(itemId); // Call the dedicated delete service
        } else if (actionType === 'update' && newStatus) {
            success = await updateItemStatus(itemId, newStatus); // Call the status update service
        }

        if (success) {
            alert(`Item successfully ${actionType === 'delete' ? 'DELETED' : 'updated to ' + newStatus}!`);
            // Optimistic update: Remove item from the local list
            setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } else {
            alert(`Failed to ${actionType} item. Check console and security rules.`);
        }
        setLoading(false);
    };


    if (!isAdmin) {
      // AdminGuard should handle this, but for safety
      return <div className="p-10 text-center text-red-500">ACCESS DENIED. Log in as an Administrator.</div>;
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold mb-2 text-indigo-700">Campus Administration</h1>
            <p className="mb-8 text-gray-600">Review, approve, and resolve item reports across the campus.</p>

            {/* Tab Navigation (Responsive - uses flex-wrap on mobile) */}
            <div className="flex flex-wrap sm:flex-nowrap border-b mb-6 bg-white rounded-t-lg shadow-inner">
                {Object.keys(statusMap).map(key => {
                    const statusName = key.replace(/_/g, ' ').toUpperCase();
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex-1 text-center py-3 px-4 text-sm sm:text-base font-semibold transition-colors duration-200 whitespace-nowrap 
                                ${ activeTab === key 
                                    ? 'border-b-4 border-indigo-600 text-indigo-800' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {statusName}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-5 text-gray-700 capitalize flex items-center gap-3">
                    <Clock size={24} className="text-gray-500" />
                    {activeTab.replace(/_/g, ' ')} Queue ({items.length})
                </h2>
                
                {loading ? (
                    <p className="text-center py-10 text-indigo-500 font-medium flex items-center justify-center">
                        <Loader2 size={24} className="animate-spin mr-2" />
                        Loading item data...
                    </p>
                ) : items.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg p-6 bg-gray-50">
                        <Package size={32} className="mx-auto mb-3" />
                        <p className="text-lg font-medium">
                            All clear! No items in the **{activeTab.replace(/_/g, ' ')}** queue.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map(item => (
                            <AdminItemCard key={item.id} item={item} onAction={handleAdminAction} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}