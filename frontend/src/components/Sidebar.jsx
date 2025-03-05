import React from 'react';
import { MdSportsCricket } from "react-icons/md";
import { BiSolidCricketBall } from "react-icons/bi";
import { RiTeamFill } from "react-icons/ri";
import { FaMapMarkerAlt } from "react-icons/fa";

function Sidebar() {
  return (
        <div className="h-[calc(100vh-4rem)] w-1/5 bg-slate-50 py-8 px-10">
            <div className="text-white flex text-lg cursor-pointer rounded-lg py-2 px-2 my-1 bg-blue-400 hover:bg-blue-400">
                <MdSportsCricket className='' size={28} />
                <a className="px-1" href="/batter">Batter Analysis</a>
            </div>

            <div className="text-gray-900 flex text-lg cursor-pointer rounded-lg py-2 px-2 my-1 hover:bg-blue-400">
                <BiSolidCricketBall className='' size={28} />
                <a className="px-1" href="/batter">Bowler Analysis</a>
            </div>

            <div className="text-gray-900 flex text-lg cursor-pointer rounded-lg py-2 px-2 my-1 hover:bg-blue-400">
                <RiTeamFill className='' size={28} />
                <a className="px-1" href="/batter">Team Analysis</a>
            </div>

            <div className="text-gray-900 flex text-lg cursor-pointer rounded-lg py-2 px-2 my-1 hover:bg-blue-400">
                <RiTeamFill className='' size={28} />
                <a className="px-1" href="/batter">Team VS Team</a>
            </div>

            <div className="text-gray-900 flex text-lg cursor-pointer rounded-lg py-2 px-2 my-1 hover:bg-blue-400">
                <FaMapMarkerAlt className='' size={28} />
                <a className="px-1" href="/batter">Venue Analysis</a>
            </div>
        </div>

  )
}

export default Sidebar