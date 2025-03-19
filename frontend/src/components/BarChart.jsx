import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { axiosInstance } from "../lib/axios.js"; // Adjust the path as needed
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import useBatterStore from "../store/batterStore.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ height = "50vh", width = "37vw", graphHeight = "40vh", graphWidth = "37vw", urls = ["/get-season-vs-runs/V Kohli"], yLabel = "Runs", xLabel = "Seasons", graphTitle = "Runs Per Season", colors = [ "#36a2eb", "#4bc0c0", "#9966ff","#018749","#ff033e","#f400a1"]}) => {
    const { selectedBatter } = useBatterStore();
    const [apiData, setApiData] = useState([]);
    const [apiDataName, setApiDataName] = useState([]);
    const [apiLabelValues, setApiLabelValues] = useState([]);
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
                    setApiLabelValues(data["label"]);

                    for(let i in data){
                        if(i == "label") continue
                        newApiData.push(data[i]);
                        newApiDataName.push(i)
                    }
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

    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

    const data = {
        labels: apiLabelValues,
        datasets: apiData.map((dataSet, index) => {
            const color = getRandomColor();
            return {
                label: apiDataName[index] || `Dataset ${index + 1}`,
                data: dataSet,
                borderColor: `${color}`,
                backgroundColor: `${color}60`, // Bar color
                borderWidth: 1,
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
                {loading ? <div className="font-bold flex items-center justify-center h-full text-2xl"><p>Loading...</p></div> : <Bar data={data} options={options} style={{ height: graphHeight, width: graphWidth }} />}
            </div>
        </div>
    );
};

export default BarChart;
