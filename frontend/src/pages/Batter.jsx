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
import PieChart from '../components/PieChart.jsx';
import RadarChart from '../components/RadarChart.jsx';
import DoughnutChart from '../components/DoughnutChart.jsx';
import BarChart from '../components/BarChart.jsx';
import { BiDoughnutChart } from 'react-icons/bi';

function Batter() {

    const {selectedBatter , setSelectedBatter} = useBatterStore();
    const [batterInfo, setBatterInfo] = useState({})

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
        <SearchBar label="" placeholder="V kohli" onSelect={setSelectedBatter} width="30vw" api="get-total-players" />

        <div className='pt-6 flex gap-5'>
            {batterInfo ? <SmallCard topic={"Matches Batted"} value={batterInfo["total_matches_played"]} description={"12 seasons"} height="15vh"  width = "15vw"/> : "Loading ...."}
            {batterInfo ? <SmallCard topic={"Total Runs"} value={batterInfo["total_runs"]} description={"12 seasons"} height="15vh"  width = "15vw" icon={<GrTrophy size={20}/>}/> : "Loading ...."}
            {batterInfo ? <SmallCard topic={"Highest Score"} value={batterInfo["highest_score"]} description={"12 seasons"} height="15vh"  width = "15vw" icon={<LiaMedalSolid size={20}/>}/> : "Loading ...."}
            {batterInfo ? <SmallCard topic={"Batting Average"} value={batterInfo["batting_average"]} description={"12 seasons"} height="15vh"  width = "15vw" icon={<VscGraph size={20}/>}/> : "Loading ...."}
            {batterInfo ? <SmallCard topic={"Strike Rate"} value={batterInfo["strike_rate"]} description={"12 seasons"} height="15vh"  width = "15vw" icon={<RxLightningBolt size={20}/>}/> : "Loading ...."}
        </div>

        <div className='mt-8 flex justify-between'>
            <LineChart urls={[`get-season-vs-runs/${selectedBatter}`]} dependency={selectedBatter} />
            <LineChart urls={[`sixes-per-season/${selectedBatter}`,`fours-per-season/${selectedBatter}`]} graphTitle='Boundries Per Season' yLabel='Boundrie Count' dependency={selectedBatter} />
        </div>

        <div className='mt-8 flex justify-between'>
            <LineChart urls={[`half-centuries-and-centuries-per-season/${selectedBatter}`]} graphTitle='Centuries And Half Centuries Per Season' yLabel='Count' dependency={selectedBatter} />
            <LineChart urls={[`avg-strike-rate-per-season/${selectedBatter}`]} graphTitle='Season-Wise Performance' dependency={selectedBatter}/>
        </div>

        <div className='mt-8 flex justify-between'>
            <DoughnutChart graphTitle='Dismissal types' dependency={selectedBatter} url= {`batter-dismissal-types/${selectedBatter}`} />
            <BarChart urls= {[`most-dismissed-by-bowler/${selectedBatter}`]} graphTitle='Dismissal By Top Bowlers' dependency={selectedBatter}/>
        </div>

        
    </div>
  )
}

export default Batter