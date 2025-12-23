import React , { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import useBatterStore from "../store/batterStore.js";
import { axiosInstance } from '../lib/axios.js';
import SmallCard from '../components/SmallCard.jsx';
import { GrTrophy } from 'react-icons/gr';
import { LiaMedalSolid } from 'react-icons/lia';
import { VscGraph } from 'react-icons/vsc';
import { RxLightningBolt } from 'react-icons/rx';
import DoughnutChart from '../components/DoughnutChart.jsx';

function Bowler(){

    const {selectedBowler , setSelectedBowler} = useBatterStore();
    const [bowlerInfo, setBowlerInfo] = useState({})

    useEffect( () => {
        axiosInstance.get(`get-bowler-info/${selectedBowler}`)
        .then((response) => {
            setBowlerInfo(response.data)
        })
        .catch(error => {
            console.error("Error fetching data of Bowler info:", error);
        })
        },[selectedBowler])

    return(
        <div className=' bg-slate-200 p-6 '>
            <SearchBar label="" placeholder="JJ Bumrah" onSelect={setSelectedBowler} width="30vw" api="get-total-bowler" />

            <div className='pt-6 flex gap-5'>
                {bowlerInfo ? <SmallCard topic={"Total Wickets"} value={bowlerInfo["TotalWickets"]} description={"12 seasons"} height="15vh"  width = "15vw"/> : "Loading ...."}
                {bowlerInfo ? <SmallCard topic={"Dot Ball"} value={bowlerInfo[ "DotBallPercentage"]} description={"12 seasons"} height="15vh"  width = "15vw" icon={<GrTrophy size={20}/>}/> : "Loading ...."}
                {bowlerInfo ? <SmallCard topic={"Strike Rate"} value={bowlerInfo["BowlingStrikeRate"]} description={"12 seasons"} height="15vh"  width = "15vw" icon={<LiaMedalSolid size={20}/>}/> : "Loading ...."}
                {bowlerInfo ? <SmallCard topic={"Bowling Average"} value={bowlerInfo["BowlingAverage"]} description={"12 seasons"} height="15vh"  width = "15vw" icon={<VscGraph size={20}/>}/> : "Loading ...."}
                {bowlerInfo ? <SmallCard topic={"Economy Rate"} value={bowlerInfo["EconomyRate"]} description={"12 seasons"} height="15vh"  width = "15vw" icon={<RxLightningBolt size={20}/>}/> : "Loading ...."}
            </div>

            <div className='mt-8 flex justify-between'>
                <DoughnutChart graphTitle='Dismissal types' dependency={selectedBowler} url= {`get-bowler-dismissal-kind/${selectedBowler}`} />
            </div>

        </div>
    )
}

export default Bowler