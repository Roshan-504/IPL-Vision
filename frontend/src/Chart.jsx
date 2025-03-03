import { useState, useRef, useEffect } from "react";


export default function SearchBar() {
  const recommendations = [
    "Laptop", "Smartphone", "Headphones", "Shoes", "T-shirt", "Harry Potter Book",
    "JavaScript", "Python", "Machine Learning", "Deep Learning", "Gaming Mouse",
    "Bluetooth Speaker", "Wireless Earbuds", "Fitness Tracker", "Camera", "Smartwatch"
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
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

    if (query) {
      setFilteredSuggestions(
        recommendations.filter(item => item.toLowerCase().includes(query))
      );
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  return (
    
     <>
        <div ref={inputRef} className="flex items-center space-x-2 border border-gray-300 p-2 rounded-lg bg-white">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleInputChange}
            onClick={() => setShowSuggestions(true)}
            className="w-full outline-none"
          />
          
        </div>

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
      </>
  );
}