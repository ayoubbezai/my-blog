import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import EditName from "./components/EditName";
import EditBio from "./components/EditBio";
import EditSkills from "./components/EditSkills";
import toast, { Toaster } from "react-hot-toast";
import NavbarAdmin from "../../adminPages/adminComp/Navbar";
import NavbarUser from "../../userPages/userComp/NavBar";

const Profile = () => {
    const { logout, currentUser, fetchUserData, userData } = useAuth();
    const navigate = useNavigate();
    fetchUserData()
    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="h-screen bg-primary md:flex">
            {/* Navbar */}
            {userData.role === "admin" && <NavbarAdmin hoverd={3} />}
            {userData.role === "user" && <NavbarUser hoverd={5} />}

            {/* Main Content */}
            <div className="flex-1 bg-primary md:overflow-auto p-6">
                <div className="flex items-center mb-6 md:mb-0  flex-col flex-row md:space-y-8 text-center md:text-left">
                    <div className="flex gap-4 justify-center items-center">
                        {/* Left Section: Profile Picture and Role */}

                        <img
                            src={userData?.profile || "https://via.placeholder.com/150"}
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover mb-4 md:mb-0"
                        />
                        <div className="text-white">
                            <h1 className="text-2xl font-bold">{userData?.name || "Loading..."}</h1>
                            <p className="text-lg text-gray-200">{userData?.role || "Role not available"}</p>
                        </div>
                    </div>
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
