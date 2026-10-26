import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { axiosInstance } from "../lib/axios.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ height = "50vh", width = "37vw", graphHeight = "40vh", graphWidth = "37vw", graphTitle = "Dismissal Types", url = "/batter-dismissal-types/V Kohli", dependency, colors = ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff", "#ff9f40", "#ffe119", "#4363d8", "#f58231", "#911eb4", "#46f0f0", "#f032e6"] }) => {
    const [apiData, setApiData] = useState([]);
    const [apiLabels, setApiLabels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(url);
                const data = response.data;
                if (data["label"] || data["labels"]) {
                    setApiLabels(data["label"] || data["labels"]);
                    const otherKey = Object.keys(data).find(k => k !== "label" && k !== "labels");
                    setApiData(data[otherKey] || []);
                } else {
                    const entries = Object.entries(data);
                    if (entries.length >= 2) {
                        const firstIsString = Array.isArray(entries[0][1]) && typeof entries[0][1][0] === "string";
                        if (firstIsString) {
                            setApiLabels(entries[0][1]);
                            setApiData(entries[1][1]);
                        } else {
                            setApiLabels(entries[1][1]);
                            setApiData(entries[0][1]);
                        }
                    }
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dependency]);

    const doughnutData = {
        labels: apiLabels,
        datasets: [
            {
                data: apiData,
                backgroundColor: colors.slice(0, apiLabels.length),
                hoverBackgroundColor: colors.slice(0, apiLabels.length),
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "50%", // Adjust for the Doughnut Chart
        plugins: {
            legend: {
                position: "right",
            },
        },
    };

    return (
        <div className="p-4 shadow-lg bg-white rounded-xl flex flex-col items-center" style={{ height, width }}>
            <h2 className="text-xl text-blue-800 font-medium">{graphTitle}</h2>
            <div className="rounded-lg bg-gray-50 p-2 w-full h-full">
                {loading ? (
                    <div className="font-bold flex items-center justify-center h-full text-2xl">
                        <p>Loading...</p>
                    </div>
                ) : (
                    <Doughnut data={doughnutData} options={options} style={{ height: graphHeight, width: graphWidth }} />
                )}
            </div>
        </div>
    );
};

export default DoughnutChart;
