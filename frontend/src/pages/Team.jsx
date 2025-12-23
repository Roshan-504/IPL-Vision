import React, { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import useBatterStore from '../store/batterStore';
import { axiosInstance } from '../lib/axios';
import SmallCard from '../components/SmallCard';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';

function Team() {
    const {selectedTeam , setSelectedTeam} = useBatterStore();
    const [teamInfo, setTeamInfo] = useState({})

    useEffect(() => {
        axiosInstance.get(`get-team-info/${selectedTeam}`)
                .then((response) => {
                    setTeamInfo(response.data)
                })
                .catch(error => {
                    console.error("Error fetching data of batter info:", error);
                })
    },[selectedTeam])

    return (
        <div className=' bg-slate-200 p-6 '>
            <SearchBar label="" placeholder="Mumbai Indians" onSelect={setSelectedTeam} width="30vw" api="get-total-teams" />
            
            <div className='pt-6 flex gap-5'>
                {teamInfo ? <SmallCard topic={"Matches Played"} value={teamInfo["total_matches_played"]} description={"12 seasons"} height="15vh"  width = "15vw"/> : "Loading ...."}
                {teamInfo ? <SmallCard topic={"Matches Won"} value={teamInfo["total_matches_won"]} description={"12 seasons"} height="15vh"  width = "15vw"/> : "Loading ...."}
                {teamInfo ? <SmallCard topic={"Season Won"} value={teamInfo["season_won"]} description={"12 seasons"} height="15vh"  width = "15vw"/> : "Loading ...."}
                {teamInfo ? <SmallCard topic={"Total Runs Scored"} value={teamInfo["total_runs"]} description={"12 seasons"} height="15vh"  width = "15vw"/> : "Loading ...."}
            </div>

            <div className='mt-8 flex justify-between'>
                <BarChart urls={[`get-top-batters/${selectedTeam}`]} graphTitle='Top 10 Highest Run Scorers' xLabel='Batters' dependency={selectedTeam} />
                <BarChart urls={[`get-top-bowlers/${selectedTeam}`]} graphTitle='Top 10 Wicket Takers' xLabel='Bowlers' dependency={selectedTeam} />
            </div>


        </div>
    )
}

export default Team