import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { axiosInstance } from "../lib/axios.js"; // Adjust the path as needed
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler  } from "chart.js";
import useBatterStore from "../store/batterStore.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler );

const LineChart = ({ height = "50vh", width = "37vw", graphHeight = "40vh", graphWidth = "37vw", urls = ["/get-season-vs-runs/V Kohli"], yLabel = "Runs", xLabel = "Seasons", graphTitle = "Runs Per Season"}) => {
    const { selectedBatter } = useBatterStore();
    const [apiData, setApiData] = useState([]);
    const [apiDataName, setApiDataName] = useState([]);
    const [apiLabelValues, setApiLabelValues] = useState([]);
    const [apiLabelName, setApiLabelName] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const responses = await Promise.all(urls.map(url => axiosInstance.get(url)));

                const newApiData = [];
                const newApiDataName = [];

                responses.forEach(response => {
                    const data = response.data;
                    const entries = Object.entries(data);
                    setApiLabelName(entries[1][0]);
                    setApiLabelValues(entries[1][1]);

                    newApiData.push(entries[0][1]);
                    newApiDataName.push(entries[0][0]);
                });

                setApiData(newApiData);
                setApiDataName(newApiDataName);
                
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedBatter]);

    const colors = ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff", "#ff9f40"];

    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

    const data = {
        labels: apiLabelValues,
        datasets: apiData.map((dataSet, index) => {
            const color = getRandomColor();
            return {
                label: apiDataName[index] || `Dataset ${index + 1}`,
                fill: true,
                data: dataSet,
                borderColor: color, // Random border color
                backgroundColor: `${color}33`, // Lighter fill color using transparency
                borderWidth: 2,
                tension: 0.3,
            };
        }),
    };


    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: `${yLabel}`,
                },
            },
            x: {
                title: {
                    display: true,
                    text: `${xLabel}`,
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
            <h2 className="text-xl text-blue-800 font-medium">{graphTitle}</h2>
            <div className="rounded-lg bg-gray-50 p-2 w-full h-full">
                {loading ? <p>Loading...</p> : <Line data={data} options={options} style={{ height: graphHeight, width: graphWidth }} />}
                
            </div>
        </div>
    );
};

export default LineChart;
