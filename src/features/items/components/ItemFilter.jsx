// src/features/items/components/ItemFilter.jsx

import React from 'react';

// Reusing category/location data from ReportItem.jsx for consistency
const ITEM_CATEGORIES = [
    { value: "all", label: "All Categories" },
    { value: "wallet", label: "Wallet/Pouch" },
    { value: "electronics", label: "Electronics" },
    { value: "keys", label: "Keys" },
    { value: "id_card", label: "ID Card/Badge" },
    { value: "other", label: "Other" },
];

const CAMPUS_LOCATIONS = [
    { value: "all", label: "All Locations" },
    "Library Main Desk", 
    "Student Union Cafeteria", 
    "Engineering Building, Lab 305", 
    "Dormitory Parking Lot A",
    "Gymnasium Main Floor",
];

/**
 * Filter component for Lost/Found listings.
 * @param {object} filters - Current filter state { category, location }
 * @param {function} onFilterChange - Callback to update parent state
 * @param {string} listType - 'lost' or 'found' for dynamic labels
 */
export default function ItemFilter({ filters, onFilterChange, listType }) {
    
    const isLost = listType === 'lost';

    const handleInputChange = (e) => {
        onFilterChange(e.target.name, e.target.value);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            
            {/* 1. Search Box (Title/Description) */}
            <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Search Keywords</label>
                <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleInputChange}
                    placeholder={`Search item names and descriptions...`}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                />
            </div>
            
            {/* 2. Category Filter */}
            <div className="md:w-1/4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white"
                >
                    {ITEM_CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
            </div>
            
            {/* 3. Location Filter */}
            <div className="md:w-1/4">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                    {isLost ? "Location Lost" : "Location Found"}
                </label>
                <select
                    name="location"
                    value={filters.location}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white"
                >
                    {CAMPUS_LOCATIONS.map(loc => (
                        <option key={loc.value || loc} value={loc.value || loc}>{loc.label || loc}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}