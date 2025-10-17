// src/features/items/pages/ItemDetails.jsx (FINAL AND DEFINITIVE VERSION)

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getItem, updateItemStatus } from "../../../services/items.service";
import { Button } from "../../../components/common/button";
import { useAuth } from "../../../hooks/useAuth"; 

// Helper to get Category label (remains unchanged)
const getCategoryLabel = (value) => {
    const categories = [
        { value: "wallet", label: "Wallet/Pouch" },
        { value: "electronics", label: "Electronics" },
        { value: "keys", label: "Keys" },
        { value: "id_card", label: "ID Card/Badge" },
        { value: "other", label: "Other" },
    ];
    return categories.find(c => c.value === value)?.label || 'Miscellaneous';
};

export default function ItemDetails() {
    const { itemId } = useParams();
    const { user, profile, isAdmin } = useAuth();
    
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    
    const [claimRequested, setClaimRequested] = useState(false);          
    const [showPublicClaimForm, setShowPublicClaimForm] = useState(false); 
    const [publicClaimEmail, setPublicClaimEmail] = useState('');        

    const isOwner = user && item && item.ownerId === user.uid;
    const isPublicItem = item && (item.status === 'active_lost' || item.status === 'active_found');
    // CRITICAL: Item type checks
    const isFoundType = item && item.type === 'found'; 
    const isLostType = item && item.type === 'lost';

    // 1. Fetch Item Details 
    useEffect(() => {
        if (itemId) {
            const fetchItem = async () => {
                try {
                    const fetchedItem = await getItem(itemId);
                    if (fetchedItem) {
                        setItem(fetchedItem);
                    } else {
                        setError("Item not found or permission denied.");
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

    // 2. Admin/Owner Status Update Handler
    const handleUpdateStatus = async (newStatus) => {
        if (!isAdmin && !isOwner) return; 
        if (!window.confirm(`Are you sure you want to change the status to ${newStatus}?`)) return;

        setIsUpdating(true);
        try {
            const success = await updateItemStatus(itemId, newStatus);
            if (success) {
                setItem((prev) => ({ ...prev, status: newStatus }));
                alert(`Status updated to ${newStatus} successfully!`);
            } else {
                alert("Failed to update status.");
            }
        } catch (err) {
            alert("Error updating status. Check Firebase Rules.");
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };
    
    // 3. Claim/Contact Handler 
    const handleClaimRequest = (contactEmail) => {
        
        let claimantEmail = contactEmail || profile?.email;

        if (!claimantEmail || !claimantEmail.includes('@')) {
            alert("Claim initiation failed: Please enter a valid contact email.");
            return;
        }
        
        if (!window.confirm(`Initiate claim using email: ${claimantEmail}? The campus administration will be notified.`)) {
            return;
        }

        // SIMULATE CLAIM LOGGING
        console.log(`Claim initiated for item ${itemId} by email: ${claimantEmail}`);
        
        setClaimRequested(true);
        setShowPublicClaimForm(false);
        alert(`Claim initiated! The campus administration has been notified via ${claimantEmail} and will reach out shortly.`);
    };

    // --- Loading, Error, Not Found States (remains unchanged) ---
    if (loading) return <p className="text-center text-lg mt-8">Loading item details...</p>;
    if (error) return <div className="p-6 text-center text-red-500"><p>{error}</p><Link to="/dashboard/reports" className="text-blue-600 underline mt-4 block">Go back</Link></div>;
    if (!item) return <p className="text-center text-lg mt-8">Item not found.</p>;

    // --- Main Render ---
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">{item.title}</h2>
            <div className="bg-white rounded-xl shadow-2xl p-6">
                
                {/* Image Section */}
                {item.imageUrl && (
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full max-h-96 object-contain rounded-lg mb-6 border border-gray-100"
                    />
                )}
                
                {/* DETAILS GRID: Display all item data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4 mb-4">
                    <p className="text-gray-700">
                        <span className="font-semibold text-gray-900">Type:</span> {isLostType ? 'Lost Item 😞' : 'Found Item 🙌'}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold text-gray-900">Category:</span> {getCategoryLabel(item.category)}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold text-gray-900">{isLostType ? 'Last Seen:' : 'Found At:'}</span> {item.location}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold text-gray-900">Date {item.type} (Approx):</span> {item.date}
                    </p>
                    <p className="text-gray-700 md:col-span-2">
                        <span className="font-semibold text-gray-900">Status:</span> 
                        <span className={`ml-2 font-bold ${item.status === 'resolved' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {item.status.toUpperCase().replace('_', ' ')}
                        </span>
                    </p>
                </div>
                
                {/* Description */}
                <p className="text-gray-700 mb-6">
                    <span className="font-semibold block mb-1 text-gray-900">Description:</span> 
                    {item.description}
                </p>

                {/* --- Dynamic Actions Section (FIXED PRIORITY) --- */}
                <div className="mt-6 pt-4 border-t flex flex-col space-y-3">
                    
                    {/* SCENARIO A: ADMIN/OWNER ACTION (Highest Priority) */}
                    { (isAdmin || isOwner) && (
                        <div className="flex space-x-3 justify-center border-t pt-4 mt-4">
                            
                            {/* Resolve Button */}
                            <Button
                                onClick={() => handleUpdateStatus("resolved")}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={isUpdating || item.status === "resolved"}
                            >
                                {isUpdating ? "Updating..." : "Mark as Resolved (Returned)"}
                            </Button>
                            
                             {/* Revert to In Review Button (Admin Only) */}
                             {isAdmin && item.status !== "in_review" && (
                                <Button
                                    onClick={() => handleUpdateStatus("in_review")}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? "Updating..." : "Revert to In Review"}
                                </Button>
                             )}
                        </div>
                    )}
                    
                    {/* SCENARIO B: CLAIM ACTION BUTTON (Visible to Public User on FOUND Items) */}
                    {isFoundType && isPublicItem && !claimRequested && !isOwner && !isAdmin && !showPublicClaimForm && (
                        <Button
                            onClick={user ? () => handleClaimRequest(user.email) : () => setShowPublicClaimForm(true)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 text-lg"
                        >
                            I think this is mine! Initiate a Claim Request
                        </Button>
                    )}

                    {/* SCENARIO C: LOST ITEM GUIDANCE (Visible to Public User on LOST Items) */}
                    {isLostType && isPublicItem && !isOwner && !isAdmin && (
                        <p className="text-center text-base font-medium text-red-700 bg-red-50 p-3 rounded">
                            This is a **LOST ITEM** report. If you have **FOUND** this item, please go to the <Link to="/dashboard/report" className='underline'>Report Item</Link> page to log it as found.
                        </p>
                    )}

                    {/* SCENARIO D/E: FORM/MESSAGE (Rendered only when needed) */}
                    {/* Public Claim Form */}
                    {!user && showPublicClaimForm && isFoundType && !claimRequested && (
                        <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                            <p className="font-semibold text-gray-700">Enter your campus email to notify staff:</p>
                            <input
                                type="email"
                                value={publicClaimEmail}
                                onChange={(e) => setPublicClaimEmail(e.target.value)}
                                placeholder="Your Campus Email"
                                className="w-full border p-2 rounded-lg"
                            />
                            <Button
                                onClick={() => handleClaimRequest(publicClaimEmail)}
                                disabled={!publicClaimEmail.includes('@')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Submit Claim (As Guest)
                            </Button>
                        </div>
                    )}

                    {/* Claim Requested Message */}
                    {claimRequested && (
                        <p className="text-center text-sm font-medium text-green-700 bg-green-50 p-3 rounded">
                            ✅ Claim request sent! The campus administration has been notified.
                        </p>
                    )}

                </div>
                {/* End Dynamic Actions Section */}

                <Link
                    to="/dashboard"
                    className="text-indigo-600 underline mt-6 block text-center"
                >
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    );
}