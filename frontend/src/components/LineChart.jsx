import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {axiosInstance} from "../lib/axios.js"; // Adjust the path as needed
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import useBatterStore from "../store/batterStore.js";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ height = "60vh", width = "37vw", graphHeight = "45vh", graphWidth = "37vw" }) => {
    const {selectedBatter} = useBatterStore();
    const [seasons, setSeasons] = useState([]);
    const [runs, setRuns] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`get_season_vs_runs/${selectedBatter}`);
                setSeasons(response.data.seasonName);
                setRuns(response.data.seasonRuns);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedBatter]);

    const data = {
        labels: seasons,
        datasets: [
            {
                label: "Total Runs Per Season",
                data: runs,
                borderColor: "green",
                backgroundColor: "rgba(0, 255, 0, 0.2)",
                borderWidth: 2,
                fill: true,
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Runs",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Season",
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
        },
    };

    return (
        <div className="p-4 shadow-lg bg-white rounded-xl flex flex-col items-center" style={{ height, width }}>
            <h2 className="text-2xl font-medium text-center mb-4">Runs Per Season</h2>
            <div className="rounded-lg bg-gray-50 p-2 w-full h-full">
                {loading ? <p>Loading...</p> : <Line data={data} options={options} style={{ height: graphHeight, width: graphWidth }} />}
            </div>
        </div>
    );
};

export default LineChart;
