import React, { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import useBatterStore from "../store/batterStore.js";
import { axiosInstance } from '../lib/axios.js';
import SmallCard from '../components/SmallCard.jsx';
import { GrTrophy } from "react-icons/gr";
import { LiaMedalSolid } from "react-icons/lia";
import { VscGraph } from "react-icons/vsc";
import { RxLightningBolt } from "react-icons/rx";
import LineChart from '../components/LineChart.jsx';

function Batter() {

    const {selectedBatter , setSelectedBatter} = useBatterStore();
    const [batterInfo, setBatterInfo] = useState({})
    console.log(selectedBatter)

    useEffect( () => {
        axiosInstance.get(`get-batter-info/${selectedBatter}`)
        .then((response) => {
            setBatterInfo(response.data)
        })
        .catch(error => {
            console.error("Error fetching data of batter info:", error);
        })
    },[selectedBatter])

  return (
    <div className=' bg-slate-200 p-6 '>
        <SearchBar label="Search Batters " placeholder="V kohli" onSelect={setSelectedBatter} width="30vw" api="get-total-players" />

        <div className='pt-6 flex gap-5'>
            {batterInfo ? <SmallCard topic={"Matches Played"} value={batterInfo["total_matches_played"]} description={"12 seasons"} height="15vh"  width = "15vw"/> : "Loading ...."}
            {batterInfo ? <SmallCard topic={"Total Runs"} value={batterInfo["total_runs"]} description={"12 seasons"} height="15vh"  width = "15vw" icon={<GrTrophy size={20}/>}/> : "Loading ...."}
            {batterInfo ? <SmallCard topic={"Highest Score"} value={batterInfo["highest_score"]} description={"12 seasons"} height="15vh"  width = "15vw" icon={<LiaMedalSolid size={20}/>}/> : "Loading ...."}
            {batterInfo ? <SmallCard topic={"Batting Average"} value={batterInfo["batting_average"]} description={"12 seasons"} height="15vh"  width = "15vw" icon={<VscGraph size={20}/>}/> : "Loading ...."}
            {batterInfo ? <SmallCard topic={"Strike Rate"} value={batterInfo["strike_rate"]} description={"12 seasons"} height="15vh"  width = "15vw" icon={<RxLightningBolt size={20}/>}/> : "Loading ...."}
        </div>

        <div className='mt-8 flex justify-between'>
            <LineChart/>
            <LineChart/>
        </div>

        <div className='mt-8 flex justify-between'>
            <LineChart/>
            <LineChart/>
        </div>

        
    </div>
  )
}

export default Batter