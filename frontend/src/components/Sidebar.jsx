import React from 'react';
import { MdSportsCricket } from "react-icons/md";
import { BiSolidCricketBall } from "react-icons/bi";
import { RiTeamFill } from "react-icons/ri";
import { FaMapMarkerAlt } from "react-icons/fa";

function Sidebar(props) {
  return (
        <div className="h-[calc(100vh-4rem)] w-1/5 bg-slate-50 py-8 px-10">
            <div onClick={() => props.setSelectedContent("home")} className={`text-gray-900 flex text-lg cursor-pointer rounded-lg py-2 px-2 my-1  ${props.selectedContent === "home" ? "bg-blue-400 text-white" : ""} hover:bg-blue-400`}>
                <MdSportsCricket className='' size={28} />
                <button className="px-1 cursor-pointer">Batter Analysis</button>
            </div>

            <div onClick={() => props.setSelectedContent("bowler")} className={`text-gray-900 flex text-lg cursor-pointer rounded-lg py-2 px-2 my-1  ${props.selectedContent === "bowler" ? "bg-blue-400 text-white" : ""} hover:bg-blue-400`}>
                <BiSolidCricketBall className='' size={28} />
                <button className="px-1 cursor-pointer">Bowler Analysis</button>
            </div>

            <div onClick={() => props.setSelectedContent("batter_vs_bowler")} className={`text-gray-900 flex text-lg cursor-pointer rounded-lg py-2 px-2 my-1 ${props.selectedContent === "batter_vs_bowler" ? "bg-blue-400 text-white" : ""}  hover:bg-blue-400`}>
                <BiSolidCricketBall className='' size={28} />
                <button className="px-1 cursor-pointer">Batter VS Bowler</button>
            </div>

            <div onClick={() => props.setSelectedContent("team")} className={`text-gray-900 flex text-lg cursor-pointer rounded-lg py-2 px-2 my-1 ${props.selectedContent === "team" ? "bg-blue-400 text-white" : ""}  hover:bg-blue-400`}>
                <RiTeamFill className='' size={28} />
                <button className="px-1 cursor-pointer">Team Analysis</button>
            </div>

            <div onClick={() => props.setSelectedContent("home")} className="text-gray-900 flex text-lg cursor-pointer rounded-lg py-2 px-2 my-1 hover:bg-blue-400">
                <RiTeamFill className='' size={28} />
                <button className="px-1 cursor-pointer">Team VS Team</button>
            </div>

            <div onClick={() => props.setSelectedContent("home")} className="text-gray-900 flex text-lg cursor-pointer rounded-lg py-2 px-2 my-1 hover:bg-blue-400">
                <FaMapMarkerAlt className='' size={28} />
                <button className="px-1 cursor-pointer">Venue Analysis</button>
            </div>
        </div>

  )
}

export default Sidebar