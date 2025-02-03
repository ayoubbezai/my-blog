import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import EditName from "./components/EditName";
import EditBio from "./components/EditBio";
import EditSkills from "./components/EditSkills";
import toast, { Toaster } from "react-hot-toast";
import NavbarAdmin from "../../adminPages/adminComp/Navbar";
import NavbarUser from "../../userPages/userComp/NavBar";
import { useEffect, useRef, useState } from "react";
import { createPortal } from 'react-dom';
import UpdatePic from "./components/UpdatePic";
const Profile = () => {
    const { logout, currentUser, fetchUserData, userData, abvName } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef(null);

    const navigate = useNavigate();
    fetchUserData()
    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen]);


    return (
        <div className="h-screen bg-primary md:flex">
            {/* Navbar */}
            {userData.role === "admin" && <NavbarAdmin hoverd={5} />}
            {userData.role === "user" && <NavbarUser hoverd={5} />}

            {/* Main Content */}
            <div className="flex-1 bg-primary md:overflow-auto p-6">
                <div className="flex items-center mb-6 md:mb-0  flex-col flex-row md:space-y-8 text-center md:text-left">
                    <div className="flex gap-4 justify-center items-center">
                        {/* Left Section: Profile Picture and Role */}



                        {userData?.profile ? <img
                            src={userData?.profile || "https://via.placeholder.com/150"}
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover mb-4 md:mb-0"
                        /> : <p className="w-32 h-32 rounded-full border-4 border-gray-300 text-4xl text-black bg-white mb-4 md:mb-0 flex items-center justify-center">{abvName}</p>
                        }
                        <div className="text-white">
                            <h1 className="text-2xl font-bold">{userData?.name || "Loading..."}</h1>
                            <p className="text-lg text-gray-200">{userData?.role || "Role not available"}</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="bg-secondary text-white px-6 py-2 rounded-md font-semibold transition-all hover:scale-105"
                        >
                            {userData?.profile ? "Change Profile" : "Add Profile"}
                        </button>

                    </div>

                    {isOpen && createPortal(
                        <div className="fixed inset-0 flex justify-center bg-black bg-opacity-50 z-50">
                            <div ref={modalRef} className="bg-white overflow-auto w-[90%] my-2 md:w-2/3 p-6 pb-0 rounded-lg shadow-lg relative">
                                <div className="flex justify-between  items-center">
                                    <h2 className="text-xl font-bold">Add a New Blog</h2>
                                    <button onClick={() => setIsOpen(false)} className="text-xl">X</button>
                                </div>
                                <div className="flex justify-center items-center">

                                    <UpdatePic setIsOpen={setIsOpen} />
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
                    <div className="w-full max-w-2xl mx-auto shadow-lg rounded-lg p-6 bg-gray-800 text-gray-800">
                        <div className="flex flex-col md:flex-row mb-8">


                            {/* Right Section: Personal Info */}
                            <div className="md:w-2/3">
                                <EditName fetchUserData={fetchUserData} userData={userData} />
                                <EditBio fetchUserData={fetchUserData} userData={userData} />
                                <EditSkills fetchUserData={fetchUserData} userData={userData} />
                            </div>

                        </div>
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleLogout}
                                className="bg-secondary text-white px-6 py-2 rounded-md font-semibold transition-all hover:scale-105"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
