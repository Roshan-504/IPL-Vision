import React, { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../lib/axios.js";

function SearchBar({ label, placeholder, onSelect, width = "30vw", api }) {  
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!api) return;  // Prevent API call if no URL is provided

        setLoading(true);
        axiosInstance.get(api)
            .then((response) => {
                setData(response.data.total_playes || []);
                setFilteredSuggestions(response.data.total_playes || []);
                setError(null);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setError("Failed to load data");
            })
            .finally(() => setLoading(false));

        function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [api]);  // Use 'api' instead of 'fetchData' in the dependency array

    const handleInputChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchTerm(query);
        setFilteredSuggestions(data.filter(item => item.toLowerCase().includes(query)));
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
        onSelect(suggestion);
    };

    return (
        <div className="flex items-center">
            <h1 className="text-xl font-medium pr-3">{label}:</h1>
            <div className="relative" style={{ width }}>  
                <div className="border border-gray-500 rounded-lg bg-white space-x-2 p-2">
                    <input
                        type="text"
                        placeholder={`${placeholder}. . .`}
                        value={searchTerm}
                        onChange={handleInputChange}
                        onClick={() => setShowSuggestions(true)}
                        className="w-full outline-none"
                        ref={inputRef}
                    />
                </div>
                {loading && <div className="p-2 text-gray-500">Loading...</div>}
                {error && <div className="p-2 text-red-500">{error}</div>}
                {showSuggestions && !loading && !error && (
                    <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                        {filteredSuggestions.length > 0 ? (
                            filteredSuggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="p-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </div>
                            ))
                        ) : (
                            <div className="p-2 text-gray-500">No suggestions found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchBar;
