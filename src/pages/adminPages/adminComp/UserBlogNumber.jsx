import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

const db = getFirestore();

const Card = ({ title, value, backgroundColor, textColor }) => {
    return (
        <div className={`bg-${backgroundColor} ${textColor} p-6 rounded-lg shadow-md mt-4 text-center `}>
            <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
            <p className="text-xl md:text-3xl font-bold ">{value}</p>
        </div>
    );
};


const UserBlogNumber = () => {
    const [usersNumber, setUsersNumber] = useState(0);
    const [adminNumber, setAdminNumber] = useState(0);
    const [blogsNumber, setBlogsNumber] = useState(0);
    const [userBlogs, setUserBlogs] = useState(0);

    const getUsers = async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("role", "==", "user"));
        const querySnapshot = await getDocs(q);
        setUsersNumber(querySnapshot.size);
    };
    const getAdmin = async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("role", "==", "admin"));
        const querySnapshot = await getDocs(q);
        setAdminNumber(querySnapshot.size);
    };
    const getBlogs = async () => {
        const usersRef = collection(db, "blogs");
        const q = query(usersRef);
        const querySnapshot = await getDocs(q);
        setBlogsNumber(querySnapshot.size);
    };
    const getUserBlogs = async () => {
        const usersRef = collection(db, "newBlogs");
        const q = query(usersRef);
        const querySnapshot = await getDocs(q);
        setUserBlogs(querySnapshot.size);
    };

    useEffect(() => {
        getUsers();
        getAdmin();
        getBlogs();
        getUserBlogs();
    }, []);

    return (
        <div className="flex flex-col md:flex-row flex-wrap justify-around items-center mt-8">
            {/* Reusable Cards */}
            <Card title="Number of Users" value={usersNumber} backgroundColor="green-500" textColor="text-white" />
            <Card title="Number of Admins" value={adminNumber} backgroundColor="blue-500" textColor="text-white" />
            <Card title="Number of Blogs" value={blogsNumber} backgroundColor="yellow-500" textColor="text-black" />
            <Card title="Blogs of Users" value={userBlogs} backgroundColor="purple-600" textColor="text-white" />
        </div>
    );
};

export default UserBlogNumber;
