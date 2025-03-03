import React, { useEffect, useRef, useState } from 'react';
import { axiosInstance } from "../lib/axios.js";

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        axiosInstance.get("/get-total-players")
            .then((response) => {
                setData(response.data['total_playes']);
                setFilteredSuggestions(response.data['total_playes']);
            })
            .catch(error => console.error("Error fetching total-players-searchbar:", error));

        function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleInputChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchTerm(query);

        setFilteredSuggestions(data.filter(item => item.toLowerCase().includes(query)));
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
    };

    return (

        <div className='flex items-center justify-center'>

            <h1 className='text-xl font-medium pr-3'>Search Batters : </h1>

            <div className="relative w-[50vw] ">
                {/* Input Field */}
                <div className="border border-gray-500 bg-black-500 rounded-lg bg-white space-x-2 p-2">
                    <input
                        type="text"
                        placeholder="Search Batters..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        onClick={() => setShowSuggestions(true)}
                        className="w-full outline-none"
                        ref={inputRef}
                    />
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && (
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
