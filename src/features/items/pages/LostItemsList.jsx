// src/features/items/pages/LostItemsList.jsx (FINAL VERSION)

import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom"; 
import { getLostItems } from "../../../services/items.service"; 
import ItemCard from "../components/ItemCard"; 
import ItemFilter from "../components/ItemFilter"; 

// Local Client-Side Filtering Function (remains unchanged)
const filterItems = (items, filters) => {
    return items.filter(item => {
        // 1. Search Filter (Title/Description)
        const matchesSearch = filters.search.toLowerCase() === '' || 
                              item.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                              item.description.toLowerCase().includes(filters.search.toLowerCase());

        // 2. Category Filter
        const matchesCategory = filters.category === 'all' || item.category === filters.category;

        // 3. Location Filter
        const matchesLocation = filters.location === 'all' || item.location === filters.location;

        return matchesSearch && matchesCategory && matchesLocation;
    });
}


export default function LostItemsList() {
    const [allActiveItems, setAllActiveItems] = useState([]); 
    const [displayedItems, setDisplayedItems] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    const [filters, setFilters] = useState({
        search: '',
        category: 'all',
        location: 'all',
    });

    const handleFilterChange = useCallback((name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getLostItems(); 
                setAllActiveItems(data);
            } catch (error) {
                console.error("Failed to load lost items:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        const filtered = filterItems(allActiveItems, filters);
        setDisplayedItems(filtered);
    }, [allActiveItems, filters]);


    if (loading) {
        return (
            <div className="p-8 text-center text-indigo-600 font-semibold">
                Loading Lost Items... 🔎
            </div>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-3xl font-extrabold mb-6 text-red-600">
                Lost Items on Campus 😔
            </h2>
            
            <ItemFilter 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                listType="lost" 
            />

            <div className="mt-8">
                {displayedItems.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <p className="text-lg text-gray-600 font-medium mb-2">
                            No active lost items match your current filter settings.
                        </p>
                        <p className="text-sm text-gray-400">Try broadening your search criteria.</p>
                        
                        {/* 🔑 FINAL LINK: User should report what they found, not claim the lost item */}
                        <p className="mt-4 text-base">
                            <span className="font-semibold text-gray-700">Found an item matching this list? </span>
                            <Link to="/dashboard/report" className="text-blue-600 underline hover:text-blue-800 font-semibold">
                                Report it as Found!
                            </Link>
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayedItems.map((item) => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}