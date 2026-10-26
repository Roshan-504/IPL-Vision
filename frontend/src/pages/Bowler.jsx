import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import useBatterStore from "../store/batterStore.js";
import { axiosInstance } from '../lib/axios.js';
import SmallCard from '../components/SmallCard.jsx';
import { GrTrophy } from 'react-icons/gr';
import { LiaMedalSolid } from 'react-icons/lia';
import { VscGraph } from 'react-icons/vsc';
import { RxLightningBolt } from 'react-icons/rx';
import { BiSolidCricketBall } from "react-icons/bi";
import { FaFire } from "react-icons/fa";
import { MdSportsCricket } from "react-icons/md";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { TbTargetArrow } from "react-icons/tb";
import LineChart from '../components/LineChart.jsx';
import BarChart from '../components/BarChart.jsx';
import DoughnutChart from '../components/DoughnutChart.jsx';

function Bowler() {
    const { selectedBowler, setSelectedBowler } = useBatterStore();
    const [bowlerInfo, setBowlerInfo] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axiosInstance.get(`get-bowler-info/${selectedBowler}`)
            .then((response) => {
                setBowlerInfo(response.data);
            })
            .catch(error => {
                console.error("Error fetching data of Bowler info:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedBowler]);

    const seasonDesc = bowlerInfo["TotalSeasons"]
        ? `${bowlerInfo["TotalSeasons"]} ${bowlerInfo["TotalSeasons"] === 1 ? 'season' : 'seasons'}`
        : "Career";

    return (
        <div className='bg-slate-200 p-6'>
            {/* Search Bar */}
            <SearchBar label="" placeholder="JJ Bumrah" onSelect={setSelectedBowler} width="30vw" api="get-total-bowler" />

            {/* KPI Cards Row 1: Core Rates & Wickets */}
            <div className='pt-6 flex gap-5'>
                {bowlerInfo ? (
                    <SmallCard
                        topic={"Total Wickets"}
                        value={bowlerInfo["TotalWickets"] ?? "0"}
                        description={seasonDesc}
                        height="15vh"
                        width="15vw"
                        icon={<BiSolidCricketBall size={20} />}
                    />
                ) : "Loading ..."}

                {bowlerInfo ? (
                    <SmallCard
                        topic={"Economy Rate"}
                        value={bowlerInfo["EconomyRate"] ?? "0"}
                        description={"Runs / Over"}
                        height="15vh"
                        width="15vw"
                        icon={<RxLightningBolt size={20} />}
                    />
                ) : "Loading ..."}

                {bowlerInfo ? (
                    <SmallCard
                        topic={"Bowling Average"}
                        value={bowlerInfo["BowlingAverage"] ?? "0"}
                        description={"Runs / Wicket"}
                        height="15vh"
                        width="15vw"
                        icon={<VscGraph size={20} />}
                    />
                ) : "Loading ..."}

                {bowlerInfo ? (
                    <SmallCard
                        topic={"Strike Rate"}
                        value={bowlerInfo["BowlingStrikeRate"] ?? "0"}
                        description={"Balls / Wicket"}
                        height="15vh"
                        width="15vw"
                        icon={<LiaMedalSolid size={20} />}
                    />
                ) : "Loading ..."}

                {bowlerInfo ? (
                    <SmallCard
                        topic={"Dot Ball %"}
                        value={bowlerInfo["DotBallPercentage"] ? `${bowlerInfo["DotBallPercentage"]}%` : "0%"}
                        description={"Dot balls bowled"}
                        height="15vh"
                        width="15vw"
                        icon={<TbTargetArrow size={20} />}
                    />
                ) : "Loading ..."}
            </div>

            {/* KPI Cards Row 2: Match Milestones & Control */}
            <div className='pt-4 flex gap-5'>
                {bowlerInfo ? (
                    <SmallCard
                        topic={"Best Bowling"}
                        value={bowlerInfo["BestBowling"] ?? "0/0"}
                        description={"Best in an inning"}
                        height="15vh"
                        width="15vw"
                        icon={<GrTrophy size={20} />}
                    />
                ) : "Loading ..."}

                {bowlerInfo ? (
                    <SmallCard
                        topic={"4+ Wkt Hauls"}
                        value={bowlerInfo["FourWicketHauls"] ?? "0"}
                        description={"4+ wickets in match"}
                        height="15vh"
                        width="15vw"
                        icon={<FaFire size={20} />}
                    />
                ) : "Loading ..."}

                {bowlerInfo ? (
                    <SmallCard
                        topic={"Matches Played"}
                        value={bowlerInfo["TotalMatches"] ?? "0"}
                        description={seasonDesc}
                        height="15vh"
                        width="15vw"
                        icon={<MdSportsCricket size={20} />}
                    />
                ) : "Loading ..."}

                {bowlerInfo ? (
                    <SmallCard
                        topic={"Overs Bowled"}
                        value={bowlerInfo["TotalOvers"] ?? "0.0"}
                        description={"Career total"}
                        height="15vh"
                        width="15vw"
                        icon={<BiSolidCricketBall size={20} />}
                    />
                ) : "Loading ..."}

                {bowlerInfo ? (
                    <SmallCard
                        topic={"Maiden Overs"}
                        value={bowlerInfo["MaidenOvers"] ?? "0"}
                        description={"0 runs conceded"}
                        height="15vh"
                        width="15vw"
                        icon={<IoShieldCheckmarkOutline size={20} />}
                    />
                ) : "Loading ..."}
            </div>

            {/* Visualizations Row 1: Season Trends */}
            <div className='mt-8 flex justify-between'>
                <LineChart
                    urls={[`get-bowler-season-vs-wickets/${selectedBowler}`]}
                    graphTitle='Wickets Per Season'
                    yLabel='Wickets'
                    xLabel='Seasons'
                    dependency={selectedBowler}
                />
                <LineChart
                    urls={[`get-bowler-season-performance/${selectedBowler}`]}
                    graphTitle='Season-Wise Economy & Average'
                    yLabel='Value'
                    xLabel='Seasons'
                    dependency={selectedBowler}
                />
            </div>

            {/* Visualizations Row 2: Match Phase Analysis & Dismissal Breakdown */}
            <div className='mt-8 flex justify-between'>
                <BarChart
                    urls={[`get-bowler-phase-analysis/${selectedBowler}`]}
                    graphTitle='Performance By Match Phase'
                    xLabel='Match Phase'
                    yLabel='Wickets & Economy'
                    dependency={selectedBowler}
                />
                <DoughnutChart
                    graphTitle='Dismissal Types'
                    dependency={selectedBowler}
                    url={`get-bowler-dismissal-kind/${selectedBowler}`}
                />
            </div>

            {/* Visualizations Row 3: Opponent & Batter Matchup Analysis */}
            <div className='mt-8 flex justify-between'>
                <BarChart
                    urls={[`get-bowler-top-dismissed-batters/${selectedBowler}`]}
                    graphTitle='Top Batters Dismissed (Bunnies)'
                    xLabel='Batters'
                    yLabel='Wickets'
                    dependency={selectedBowler}
                />
                <BarChart
                    urls={[`get-bowler-wickets-vs-teams/${selectedBowler}`]}
                    graphTitle='Wickets Against Opponents'
                    xLabel='Teams'
                    yLabel='Wickets'
                    dependency={selectedBowler}
                />
            </div>
        </div>
    );
}

export default Bowler;