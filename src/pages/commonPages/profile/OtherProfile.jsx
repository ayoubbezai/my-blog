import { useAuth } from "../../../context/AuthContext";
import { getFirestore, collection, getDoc, doc } from "firebase/firestore";
import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import NavbarAdmin from "../../adminPages/adminComp/Navbar";
import NavbarUser from "../../userPages/userComp/NavBar";

const db = getFirestore();
const collectionRef = collection(db, "users");

const OtherProfile = () => {
    const { fetchUserData, userData } = useAuth();
    const [profileData, setProfileData] = useState();
    const { profile } = useParams();

    const getProfile = async (profileId) => {
        try {
            const docRef = doc(collectionRef, profileId);
            const dataRef = await getDoc(docRef);
            if (dataRef.exists()) {
                const data = dataRef.data();
                setProfileData(data);
            } else {
                console.log("userNotfound");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    useEffect(() => {
        getProfile(profile);
        fetchUserData();
    }, []);

    return (
        <div className="bg-primary min-h-screen md:flex">
            {/* Navbar */}
            {userData?.role === "admin" && <NavbarAdmin />}
            {userData?.role === "user" && <NavbarUser />}

            {/* Main Content */}
            <div className="flex-1 flex md:justify-center items-center px-4 py-8 md:py-12 md:px-6 h-[80vh] md:h-screen">

                <div className="w-full  bg-gray-800 shadow-lg rounded-lg p-6 md:p-12 text-gray-800">
                    {/* Profile Header */}
                    <div className="flex flex-col items-center text-center space-y-4 mb-6 md:flex-row md:space-y-0 md:space-x-6 md:text-left">
                        <img
                            src={profileData?.profile || "https://via.placeholder.com/150"}
                            alt="Profile"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300 object-cover"
                        />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                {profileData?.name || "Loading..."}
                            </h1>
                            <p className="text-sm md:text-lg text-gray-200">
                                {profileData?.role || "Role not available"}
                            </p>
                        </div>
                    </div>

                    {/* Profile Details */}
                    {profileData ? (
                        <div className="space-y-4 text-white">
                            <p className="text-sm md:text-lg">
                                <span className="font-semibold text-gray-300">Email:</span> {profileData.email}
                            </p>
                            <p className="text-sm md:text-lg">
                                <span className="font-semibold text-gray-300">Bio:</span>{" "}
                                {profileData.bio || "No bio available."}
                            </p>
                            <div className="pt-4 my-3">
                                {profileData.skillsList && profileData.skillsList.map((s, index) => (
                                    <div key={index} className="inline-block m-2 p-[2px] rounded-lg bg-gradient-to-r from-secondary to-green-500">
                                        <span className="block px-3 md:px-5 py-1 md:py-2 text-white font-medium md:font-semibold rounded-lg bg-gray-800">{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-lg text-gray-300 text-center">Fetching user details...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OtherProfile;
