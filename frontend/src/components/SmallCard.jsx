import React from "react";
import { MdOutlineSportsCricket } from "react-icons/md";


function SmallCard({ topic, value, description, height = "30vh", width = "30vw",icon="" }) {
  return (
    <div
      className="bg-white py-2.5 rounded-lg shadow-md"
      style={{ height, width }} //  Dynamically setting height & width
    >
      <div className="px-5">

        <div className="flex items-center justify-between">
            <div className="text-gray-800 text-lg">{topic}</div>
            <div className="bg-blue-100 text-blue-800 p-1 rounded-full"> {icon ? icon : <MdOutlineSportsCricket size={20}/>} </div>
        </div>
        <div className="font-medium text-2xl">{value}</div>
        
        <div className="text-gray-800">{description}</div>
      </div>
    </div>
  );
}

export default SmallCard;
