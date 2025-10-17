// src/features/items/pages/FoundItemsList.jsx (FINAL VERSION)

import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom"; 
import { getFoundItems } from "../../../services/items.service";
import ItemCard from "../components/ItemCard";
import ItemFilter from "../components/ItemFilter";

// Local Client-Side Filtering Function (remains unchanged)
const filterItems = (items, filters) => {
    return items.filter(item => {
        const matchesSearch = filters.search.toLowerCase() === '' || 
                              item.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                              item.description.toLowerCase().includes(filters.search.toLowerCase());
        const matchesCategory = filters.category === 'all' || item.category === filters.category;
        const matchesLocation = filters.location === 'all' || item.location === filters.location;
        return matchesSearch && matchesCategory && matchesLocation;
    });
}


export default function FoundItemsList() {
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
                const data = await getFoundItems(); 
                setAllActiveItems(data);
            } catch (error) {
                console.error("Failed to load found items:", error);
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
            <div className="p-8 text-center text-green-600 font-semibold">
                Loading Found Items... 🙌
            </div>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-3xl font-extrabold mb-6 text-green-600">
                Items Found on Campus! 👏
            </h2>
            
            <ItemFilter 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                listType="found" 
            />

            <div className="mt-8">
                {displayedItems.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <p className="text-lg text-gray-600 font-medium mb-2">
                            No found items match your current filter settings.
                        </p>
                        <p className="text-sm text-gray-400">Try broadening your search criteria.</p>
                        
                        {/* 🔑 FINAL LINK: Guide user to report their item as LOST */}
                        <p className="mt-4 text-base">
                            <span className="font-semibold text-gray-700">Lost something? </span>
                            <Link to="/dashboard/report" className="text-blue-600 underline hover:text-blue-800 font-semibold">
                                Report it here!
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