import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const db = getFirestore();

const UsersBlogsCircle = () => {
    const [pending, setPending] = useState(0);
    const [accepted, setAccepted] = useState(0);
    const [refused, setRefused] = useState(0);
    const [blogCount, setBlogCount] = useState(0);

    // Function to get count of blogs by status
    const getBlogStatusCount = async (status, setter) => {
        const blogsRef = collection(db, "newBlogs");
        const q = query(blogsRef, where("status", "==", status));
        const querySnapshot = await getDocs(q);
        setter(querySnapshot.size);
    };
    const getBlogCount = async () => {
        const blogsRef = collection(db, "newBlogs");
        const q = query(blogsRef);
        const querySnapshot = await getDocs(q);
        setBlogCount(querySnapshot.size);
    };

    useEffect(() => {
        getBlogStatusCount("pending", setPending);
        getBlogStatusCount("accepted", setAccepted);
        getBlogStatusCount("refused", setRefused);
        getBlogCount();
    }, []);

    const data = {
        labels: ["Pending", "Accepted", "Refused"],
        datasets: [
            {
                data: [pending, accepted, refused],
                backgroundColor: ["#F59E0B", "#10B981", "#EF4444"], // Tailwind: yellow-500, green-500, red-500
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        layout: {
            padding: {
                left: 0, // Reduce left padding
                right: 0, // Reduce right padding
                top: 0, // Reduce top padding
                bottom: 0, // Reduce bottom padding
            },
            margin: {

                top: 0, // Reduce top padding
            },
        },
        plugins: {
            legend: { position: "right" },
        },
    };

    return (
        <div className="flex relative flex-col items-center mb-16 ">
            <div className=" relative w-72 md:w-72 md:h-72">
                <Doughnut data={data} options={options} />
                <span className="absolute text-xl font-semibold text-white bottom-32 left-20 ">{blogCount}</span>
            </div>
            <h2 className="text-xl font-semibold bottom-1  left-10  absolute text-white ">User Blogs</h2>
        </div>
    );
};

export default UsersBlogsCircle;
