import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios';
import SmallCard from '../components/SmallCard';
import { VscGraph } from 'react-icons/vsc';
import { RxLightningBolt } from 'react-icons/rx';
import { BiSolidCricketBall } from 'react-icons/bi';
import { TbTargetArrow } from 'react-icons/tb';

const TEAM_COLORS = {
    'Chennai Super Kings': '#F9CD05',
    'Royal Challengers Bengaluru': '#D71921',
    'Mumbai Indians': '#004BA0',
    'Kolkata Knight Riders': '#3A225D',
    'Delhi Capitals': '#282968',
    'Rajasthan Royals': '#EA1A85',
    'Sunrisers Hyderabad': '#F26522',
    'Punjab Kings': '#DD1F2D',
    'Gujarat Titans': '#1B2133',
    'Lucknow Super Giants': '#0057E7'
};

const DEFAULT_BATTING_COLOR = '#2563eb';
const DEFAULT_BOWLING_COLOR = '#64748b';

function Predictor() {
    const [teams, setTeams] = useState([
        'Chennai Super Kings', 'Delhi Capitals', 'Gujarat Titans',
        'Kolkata Knight Riders', 'Lucknow Super Giants', 'Mumbai Indians',
        'Punjab Kings', 'Rajasthan Royals', 'Royal Challengers Bengaluru',
        'Sunrisers Hyderabad'
    ]);
    const [cities, setCities] = useState([
        'Ahmedabad', 'Bangalore', 'Bengaluru', 'Chennai', 'Delhi',
        'Hyderabad', 'Jaipur', 'Kolkata', 'Mumbai', 'Pune', 'Chandigarh'
    ]);

    // Match inputs
    const [battingTeam, setBattingTeam] = useState('Royal Challengers Bengaluru');
    const [bowlingTeam, setBowlingTeam] = useState('Chennai Super Kings');
    const [city, setCity] = useState('Bengaluru');
    const [targetRuns, setTargetRuns] = useState(185);
    const [currentScore, setCurrentScore] = useState(143);
    const [oversBowled, setOversBowled] = useState(16.0);
    const [wicketsLost, setWicketsLost] = useState(4);

    // Results
    const [prediction, setPrediction] = useState({
        batting_win_prob: 69.5,
        bowling_win_prob: 30.5,
        match_state: 'In Progress'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axiosInstance.get('get-predictor-metadata')
            .then(res => {
                if (res.data?.teams?.length) setTeams(res.data.teams);
                if (res.data?.cities?.length) setCities(res.data.cities);
            })
            .catch(err => {
                console.error("Failed to load metadata:", err);
            });

        fetchPrediction();
    }, []);

    const fetchPrediction = async (overrides = {}) => {
        setLoading(true);
        const payload = {
            batting_team: overrides.batting || battingTeam,
            bowling_team: overrides.bowling || bowlingTeam,
            city: overrides.city || city,
            target_runs: Number(overrides.target ?? targetRuns),
            current_score: Number(overrides.score ?? currentScore),
            overs_bowled: Number(overrides.overs ?? oversBowled),
            wickets_lost: Number(overrides.wickets ?? wicketsLost)
        };

        try {
            const res = await axiosInstance.post('predict-win-probability', payload);
            if (res.data?.status === 'success') {
                setPrediction(res.data);
            }
        } catch (err) {
            console.error("Prediction failed:", err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate match dynamics
    const completedOvers = Math.floor(oversBowled);
    const ballPart = Math.min(5, Math.round((oversBowled - completedOvers) * 10));
    const ballsBowledTotal = Math.min(120, completedOvers * 6 + ballPart);
    const ballsLeft = Math.max(0, 120 - ballsBowledTotal);
    const runsLeft = Math.max(0, targetRuns - currentScore);
    const crr = ballsBowledTotal > 0 ? ((currentScore * 6) / ballsBowledTotal).toFixed(2) : '0.00';
    const rrr = ballsLeft > 0 ? ((runsLeft * 6) / ballsLeft).toFixed(2) : '0.00';

    const battingColor = TEAM_COLORS[battingTeam] || DEFAULT_BATTING_COLOR;
    const bowlingColor = TEAM_COLORS[bowlingTeam] || DEFAULT_BOWLING_COLOR;

    const battingProb = prediction?.batting_win_prob ?? 50.0;
    const bowlingProb = prediction?.bowling_win_prob ?? 50.0;

    return (
        <div className="bg-slate-200 p-6 min-h-[calc(100vh-4rem)]">
            {/* KPI Summary Cards */}
            <div className="flex gap-5">
                <SmallCard
                    topic="Runs Needed"
                    value={runsLeft}
                    description={`Target: ${targetRuns}`}
                    height="15vh"
                    width="18vw"
                    icon={<TbTargetArrow size={20} />}
                />
                <SmallCard
                    topic="Balls Remaining"
                    value={ballsLeft}
                    description={`${ballsBowledTotal} balls bowled`}
                    height="15vh"
                    width="18vw"
                    icon={<BiSolidCricketBall size={20} />}
                />
                <SmallCard
                    topic="Required RR"
                    value={rrr}
                    description="Runs / Over"
                    height="15vh"
                    width="18vw"
                    icon={<RxLightningBolt size={20} />}
                />
                <SmallCard
                    topic="Current RR"
                    value={crr}
                    description="Runs / Over"
                    height="15vh"
                    width="18vw"
                    icon={<VscGraph size={20} />}
                />
            </div>

            {/* Win Probability Bar Card */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-800 text-lg font-medium">Win Probability</span>
                    <span className="text-sm font-semibold text-gray-500">
                        {prediction?.match_state || 'In Progress'}
                    </span>
                </div>

                {/* Team Win Percentages */}
                <div className="flex justify-between items-end mb-3">
                    <div>
                        <div className="text-sm font-semibold text-gray-600">{battingTeam}</div>
                        <div className="text-3xl font-bold text-gray-900">{battingProb}%</div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-semibold text-gray-600">{bowlingTeam}</div>
                        <div className="text-3xl font-bold text-gray-900">{bowlingProb}%</div>
                    </div>
                </div>

                {/* Horizontal Probability Bar */}
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex">
                    <div
                        style={{ width: `${battingProb}%`, backgroundColor: battingColor }}
                        className="transition-all duration-300 ease-out"
                    />
                    <div
                        style={{ width: `${bowlingProb}%`, backgroundColor: bowlingColor }}
                        className="transition-all duration-300 ease-out"
                    />
                </div>
            </div>

            {/* Match Inputs Form */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <div className="text-gray-800 text-lg font-medium mb-5">Match Details</div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Chasing Team */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Chasing Team
                        </label>
                        <select
                            value={battingTeam}
                            onChange={(e) => {
                                const val = e.target.value;
                                setBattingTeam(val);
                                if (val === bowlingTeam) {
                                    setBowlingTeam(teams.find(t => t !== val) || '');
                                }
                            }}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                        >
                            {teams.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    {/* Defending Team */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Defending Team
                        </label>
                        <select
                            value={bowlingTeam}
                            onChange={(e) => setBowlingTeam(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                        >
                            {teams.filter(t => t !== battingTeam).map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    {/* Venue / City */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Venue
                        </label>
                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                        >
                            {cities.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Target Score */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Target Runs
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="350"
                            value={targetRuns}
                            onChange={(e) => setTargetRuns(Math.max(1, parseInt(e.target.value) || 0))}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    {/* Current Score */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Score
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={currentScore}
                            onChange={(e) => setCurrentScore(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    {/* Wickets Lost */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Wickets Lost
                        </label>
                        <select
                            value={wicketsLost}
                            onChange={(e) => setWicketsLost(parseInt(e.target.value))}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                        >
                            {[...Array(11).keys()].map(w => (
                                <option key={w} value={w}>{w}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Overs Bowled Slider */}
                <div className="mt-5">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-gray-700">
                            Overs Bowled: <span className="font-semibold text-gray-900">{completedOvers}.{ballPart}</span>
                        </label>
                        <span className="text-xs text-gray-500">
                            {ballsLeft} balls left
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="19.5"
                        step="0.1"
                        value={oversBowled}
                        onChange={(e) => setOversBowled(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => fetchPrediction()}
                        disabled={loading}
                        className="bg-blue-400 hover:bg-blue-500 text-white font-medium px-6 py-2 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Calculating...' : 'Predict'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Predictor;
