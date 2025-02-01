import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import Persentage from "./Persentage";

const db = getFirestore();

const LikesEngagement = () => {
    const [usersNumber, setUsersNumber] = useState(0);
    const [usersWithLikes, setUsersWithLikes] = useState(0);
    const [percentage, setPercentage] = useState(0);

    // Fetch all users
    const getUsers = async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("role", "==", "user"));
        const querySnapshot = await getDocs(q);
        setUsersNumber(querySnapshot.size);
    };

    // Fetch users who liked blogs
    const getLikesPercentage = async () => {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);

        // Filter users with non-empty `likedBlogs` array
        const likedUsers = querySnapshot.docs.filter(doc => {
            const data = doc.data();
            return data.role === "user" && Array.isArray(data.likedBlogs) && data.likedBlogs.length > 0;
        });

        setUsersWithLikes(likedUsers.length);
    };

    // Calculate percentage when values update
    useEffect(() => {
        getUsers();
        getLikesPercentage();
    }, []);

    useEffect(() => {
        if (usersNumber > 0) {
            setPercentage(Math.round((usersWithLikes / usersNumber) * 100));
        }
    }, [usersNumber, usersWithLikes]);

    return (
        <div className="flex flex-col items-center justify-center ">
            <Persentage percentage={percentage} />
            <h2 className="text-xl font-semibold  text-white ">User Engagement</h2>
        </div>
    );
};

export default LikesEngagement;
