import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Persentage = ({ percentage }) => {
    const data = {
        datasets: [
            {
                data: [percentage, 100 - percentage], // Fill and empty space
                backgroundColor: ["#10B981", "#E5E7EB"], // Tailwind green-500 & gray-300
                borderWidth: 0,
            },
        ],
    };

    const options = {
        cutout: "70%", // Creates the circular progress effect
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
    };

    return (
        <div className="relative md:w-40 md:h-40 w-32  h-32 flex items-center justify-center  mb-8 ">
            <Doughnut data={data} options={options} />
            <span className="absolute text-lg font-semibold text-gray-100">
                {percentage}%
            </span>
        </div>
    );
};

export default Persentage;
