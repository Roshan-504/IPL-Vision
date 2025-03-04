import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ height = "60vh", width = "37vw", graphHeight = "45vh", graphWidth = "37vw" }) => {
    const seasons = ["2016", "2017", "2018", "2019", "2020", "2021", "2022"];
    const runs = [973, 308, 530, 464, 466, 405, 341];
    const fours = [83, 35, 52, 44, 45, 38, 30];
    const sixes = [38, 9, 18, 13, 11, 10, 7];

    const data = {
        labels: seasons,
        datasets: [
            {
                label: "Runs per Season",
                data: runs,
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                borderWidth: 2,
                fill: true,
                tension: 0.3,
            },
            {
                label: "Total Fours",
                data: fours,
                borderColor: "green",
                backgroundColor: "rgba(0, 255, 0, 0.2)",
                borderWidth: 2,
                fill: true,
                tension: 0.3,
            },
            {
                label: "Total Sixes",
                data: sixes,
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
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
                    text: "Runs / Boundaries",
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
                {/* Fix: Apply height and width correctly */}
                <Line data={data} options={options} style={{ height: graphHeight, width: graphWidth }} />
            </div>
        </div>
    );
};

export default LineChart;
