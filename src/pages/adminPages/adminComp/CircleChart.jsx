import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CircleChart = ({ labels, values, colors }) => {
    const data = {
        labels: labels,
        datasets: [
            {
                data: values, // Example: [50, 30, 20]
                backgroundColor: colors || ["#10B981", "#3B82F6", "#F59E0B"],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%", // Adjust the inner circle size
        plugins: {
            legend: {
                position: "right", // Position the legend to the right
                labels: {
                    boxWidth: 30, // Optional: Adjust the size of the legend box
                },
            },
            tooltip: { enabled: true },
        },
    };

    return (
        <div className="w-40 h-40 md:w-72 md:h-72 ">
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default CircleChart;
