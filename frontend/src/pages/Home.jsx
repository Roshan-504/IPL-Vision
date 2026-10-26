import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Batter from './Batter';
import Bowler from './Bowler';
import Batter_VS_Bowler from './Batter_VS_Bowler';
import Team from './Team';
import Predictor from './Predictor';

function Home() {
  const [selectedContent, setSelectedContent] = useState("predictor");

  return (
    <div>
        <div className="flex">
            <Sidebar setSelectedContent={setSelectedContent} selectedContent={selectedContent} />
            <div className='w-4/5 h-[calc(100vh-4rem)] overflow-y-scroll scrollbar-hidden'>
                {selectedContent === "home" && <Batter />}
                {selectedContent === "bowler" && <Bowler />}
                {selectedContent === "batter_vs_bowler" && <Batter_VS_Bowler />}
                {selectedContent === "team" && <Team />}
                {selectedContent === "predictor" && <Predictor />}
            </div>
        </div>
    </div>
  );
}

export default Home;