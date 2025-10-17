// src/features/items/components/ItemCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/common/card'; // Assuming this Card exists

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

export default function ItemCard({ item }) {
    
    // Fallback for date if serverTimestamp hasn't resolved yet
    const displayDate = item.date || (item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'Date N/A');
    const itemType = item.type === 'lost' ? 'Lost' : 'Found';

    return (
        <Card className="flex flex-col h-full overflow-hidden transition-transform duration-200 hover:scale-[1.02]">
            <div className="relative w-full h-48 bg-gray-100 flex-shrink-0">
                {item.imageUrl ? (
                    <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                        No Image Provided
                    </div>
                )}
                <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full text-white ${
                    itemType === 'Lost' ? 'bg-red-600' : 'bg-green-600'
                }`}>
                    {itemType}
                </span>
            </div>

            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-3">
                    {itemType === 'Lost' ? 'Last Seen:' : 'Found At:'} **{item.location}**
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-2 border-t">
                    <span>Category: {getCategoryLabel(item.category)}</span>
                    <span>{displayDate}</span>
                </div>
            </div>

            <Link 
                to={`/item/${item.id}`} 
                className="block text-center bg-indigo-500 text-white font-semibold py-2 hover:bg-indigo-600 transition"
            >
                View Details
            </Link>
        </Card>
    );
}