import React, { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import { axiosInstance } from "../lib/axios.js";
import useBatterStore from "../store/batterStore.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart = ({ height = "50vh", width = "37vw", url = "/batter-dismissal-types/V Kohli", color = "#36a2eb" }) => {
    const { selectedBatter } = useBatterStore();
    const [dismissalData, setDismissalData] = useState([]);
    const [dismissalLabels, setDismissalLabels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(url);
                const data = response.data;
                
                setDismissalLabels(data["Dismissal Type"]);
                setDismissalData(data["Dismissal Count"]);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedBatter]);

    const radarData = {
        labels: dismissalLabels,
        datasets: [
            {
                label: "Dismissal Types",
                data: dismissalData,
                backgroundColor: `${color}33`, // Transparent background
                borderColor: color,
                pointBackgroundColor: color,
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                position: "top",
            },
        },
    };

    return (
        <div className="p-4 shadow-lg bg-white rounded-xl flex flex-col items-center" style={{ height, width }}>
            <h2 className="text-xl text-blue-800 font-medium">Dismissal Types</h2>
            <div className="rounded-lg bg-gray-50 p-2 w-full h-full">
                {loading ? (
                    <div className="font-bold flex items-center justify-center h-full text-2xl">
                        <p>Loading...</p>
                    </div>
                ) : (
                    <Radar data={radarData} options={options} style={{ height: "40vh", width: "37vw" }} />
                )}
            </div>
        </div>
    );
};

export default RadarChart;
