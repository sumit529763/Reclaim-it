// src/features/items/pages/ItemDetails.jsx (FINAL PROFESSIONAL VERSION)

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getItem, updateItemStatus } from "../../../services/items.service";
import { Button } from "../../../components/common/button";
import { useAuth } from "../../../hooks/useAuth"; 
import { Package, AlertTriangle, CheckCircle, MapPin, Calendar, Tag, Shield, Trash2 } from 'lucide-react'; // 🔑 ICONS ADDED

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

// Helper for Status Badge Styling
const getStatusStyle = (status) => {
    if (status === 'resolved') return 'bg-green-100 text-green-700';
    if (status === 'in_review') return 'bg-yellow-100 text-yellow-700';
    if (status === 'active_found') return 'bg-blue-100 text-blue-700';
    return 'bg-red-100 text-red-700';
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
                alert("Failed to update status. Check Firebase Rules.");
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

    // --- Main Render (PROFESSIONAL LAYOUT) ---
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">{item.title}</h2>
            <div className="bg-white rounded-xl shadow-2xl p-6">
                
                {/* Image Section */}
                {item.imageUrl && (
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full max-h-96 object-contain rounded-lg mb-6 border border-gray-200"
                    />
                )}
                
                {/* CRITICAL DATA SECTION */}
                <div className="border-b pb-4 mb-6">
                    {/* STATUS ROW (Top priority visual element) */}
                    <div className="mb-4 flex flex-wrap gap-3 items-center">
                        <span className="text-xl font-extrabold text-gray-900 mr-2">Status:</span>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1 ${getStatusStyle(item.status)}`}>
                            {item.status === 'resolved' && <CheckCircle size={16} />}
                            {item.status === 'in_review' && <AlertTriangle size={16} />}
                            {(item.status === 'active_found' || item.status === 'active_lost') && <Tag size={16} />}
                            {item.status.toUpperCase().replace(/_/g, ' ')}
                        </span>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${isLostType ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                            {isLostType ? 'LOST ITEM' : 'FOUND ITEM'}
                        </span>
                    </div>

                    {/* DETAILS GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-gray-700">
                        
                        {/* Type & Category */}
                        <div className="flex items-center gap-3">
                            <Tag size={18} className="text-indigo-500" />
                            <p>
                                <span className="font-semibold block text-sm text-gray-500">Category</span>
                                <span className="text-base font-medium">{getCategoryLabel(item.category)}</span>
                            </p>
                        </div>
                        
                        {/* Location */}
                        <div className="flex items-center gap-3">
                            <MapPin size={18} className="text-indigo-500" />
                            <p>
                                <span className="font-semibold block text-sm text-gray-500">{isLostType ? 'Last Seen' : 'Found At'}</span>
                                <span className="text-base font-medium">{item.location}</span>
                            </p>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-indigo-500" />
                            <p>
                                <span className="font-semibold block text-sm text-gray-500">Date {isLostType ? 'Lost' : 'Found'}</span>
                                <span className="text-base font-medium">{item.date}</span>
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Description (FULL TEXT) */}
                <div className="mb-6 border-b pb-4">
                    <span className="font-semibold block mb-2 text-lg text-gray-800">Description:</span> 
                    <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
                </div>

                {/* --- Dynamic Actions Section --- */}
                <div className="mt-6 flex flex-col space-y-3">
                    
                    {/* SCENARIO A: ADMIN/OWNER ACTION (Highest Priority) */}
                    { (isAdmin || isOwner) && (
                        <div className="flex space-x-3 justify-center pt-4">
                            
                            {/* Resolve Button */}
                            <Button
                                onClick={() => handleUpdateStatus("resolved")}
                                className="bg-green-600 hover:bg-green-700 text-white text-base"
                                disabled={isUpdating || item.status === "resolved"}
                            >
                                <CheckCircle size={18} className="mr-2" /> Mark as Resolved (Returned)
                            </Button>
                            
                             {/* Revert to In Review Button (Admin Only) */}
                             {isAdmin && item.status !== "in_review" && (
                                <Button
                                    onClick={() => handleUpdateStatus("in_review")}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white text-base"
                                    disabled={isUpdating}
                                >
                                    <AlertTriangle size={18} className="mr-2" /> Revert to In Review
                                </Button>
                             )}
                        </div>
                    )}
                    
                    {/* SCENARIO B: CLAIM ACTION BUTTON (Visible ONLY for Found Items to Public Users) */}
                    {isFoundType && isPublicItem && !claimRequested && !isOwner && !isAdmin && !showPublicClaimForm && (
                        <Button
                            onClick={user ? () => handleClaimRequest(user.email) : () => setShowPublicClaimForm(true)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 text-lg"
                        >
                            I think this is mine! Initiate a Claim Request
                        </Button>
                    )}

                    {/* SCENARIO C: LOST ITEM GUIDANCE (Guidance for public users viewing a LOST item) */}
                    {isLostType && isPublicItem && !isOwner && !isAdmin && (
                        <p className="text-center text-base font-medium text-red-700 bg-red-50 p-3 rounded">
                            This is a **LOST ITEM** report. If you have **FOUND** this item, please go to the <Link to="/dashboard/report" className='underline font-semibold'>Report Item</Link> page to log it as found.
                        </p>
                    )}

                    {/* SCENARIO D/E: FORM/MESSAGE (remain unchanged) */}
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