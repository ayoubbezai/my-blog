import { useAuth } from "../../../context/AuthContext";
import { getFirestore, doc, collection, updateDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import NavbarAdmin from "../../adminPages/adminComp/Navbar";
import NavbarUser from "../../userPages/userComp/NavBar";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const db = getFirestore();
const data2 = collection(db, "users");

const Profile = () => {
    const navigate = useNavigate();
    const { logout, currentUser, fetchUserData, userData } = useAuth();

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const nameRef = useRef();
    const bioRef = useRef();
    const skillsRef = useRef();

    const addPic = async (e) => {
        e.preventDefault();
        const picData = new FormData();
        picData.append("file", image);
        picData.append("upload_preset", "my-blog");
        picData.append("cloud_name", "dbjoo9sww");
        try {
            setLoading(true);
            if (!image) return toast.error("Please upload an image.");

            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dbjoo9sww/image/upload",
                {
                    method: "POST",
                    body: picData,
                }
            );
            const cloudData = await res.json();
            await updateDoc(doc(data2, currentUser.uid), { profile: cloudData.url });
            toast.success("Picture updated successfully.");
            fetchUserData();
        } catch {
            toast.error("Error uploading picture.");
        } finally {
            setImage(null);
            setLoading(false);
        }
    };

    const updateName = async (e) => {
        e.preventDefault();
        const name = nameRef.current.value;
        if (!name) return toast.error("Name cannot be empty.");
        await updateDoc(doc(data2, currentUser.uid), { name });
        toast.success("Name updated successfully.");
        nameRef.current.value = "";
        fetchUserData();
    };

    const updateBio = async (e) => {
        e.preventDefault();
        const bio = bioRef.current.value;
        if (!bio) return toast.error("Bio cannot be empty.");
        await updateDoc(doc(data2, currentUser.uid), { bio });
        toast.success("Bio updated successfully.");
        bioRef.current.value = "";
        fetchUserData();
    };
    const updateSkills = async (e) => {
        e.preventDefault();
        const skills = skillsRef.current.value;
        const skillsList = skills.split(",")
        if (!skills) return toast.error("skills cannot be empty.");
        await updateDoc(doc(data2, currentUser.uid), { skillsList });
        toast.success("Skills updated successfully.");
        skillsRef.current.value = "";
        fetchUserData();
    };

    const deletePicture = async () => {
        try {
            setLoading(true);
            await updateDoc(doc(data2, currentUser.uid), { profile: "" });
            toast.success("Picture removed successfully.");
        } catch {
            toast.error("Failed to delete picture.");
        } finally {
            setImage(null);
            setLoading(false);
            fetchUserData();
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div className=" h-screen  bg-primary   md:flex flex-col md:flex-row ">

            {/* Navbar */}
            {userData.role === "admin" && <NavbarAdmin hoverd={3} />}
            {userData.role === "user" && <NavbarUser hoverd={4} />}

            {/* Main Content */}

            <div className="md:flex-1 md:flex-col  bg-primary  md:overflow-auto">
                <div className="w-full md:max-w-4xl mx-auto shadow-lg rounded-lg p-6 md:p-12">
                    {/* Profile Info */}
                    <div className="w-full md:max-w-4xl bg-gray-800 shadow-lg  rounded-lg p-6 md:p-12 text-gray-800">
                        {/* Profile Header */}
                        <div className="flex flex-col items-center text-center space-y-4 mb-6 md:flex-row md:space-y-0 md:space-x-6 md:text-left">
                            <img
                                src={userData?.profile || "https://via.placeholder.com/150"}
                                alt="Profile"
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300 object-cover"
                            />
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    {userData?.name || "Loading..."}
                                </h1>
                                <p className="text-sm md:text-lg text-gray-200">
                                    {userData?.role || "Role not available"}
                                </p>
                            </div>
                        </div>

                        {/* Profile Details */}
                        {userData ? (
                            <div className="space-y-4 text-white flex flex-col">
                                <p className="text-sm md:text-lg">
                                    <span className="font-semibold text-gray-300">Email:</span> {userData.email}
                                </p>
                                <p className="text-sm md:text-lg">
                                    <span className="font-semibold text-gray-300">Bio:</span>{" "}
                                    {userData.bio || "No bio available."}
                                </p>
                                <div className="pt-4 my-3">
                                    {userData.skillsList && userData.skillsList.map((s, index) => (
                                        <div key={index} className="inline-block m-2 p-[2px] rounded-lg bg-gradient-to-r from-secondary to-green-500">
                                            <span className="block px-3 md:px-5 py-1 md:py-2 text-white font-medium md:font-semibold rounded-lg bg-gray-800">{s}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className=" bg-secondary text-white px-6 py-2 rounded-md md:text-lg font-medium md:font-semibold mt-8 self-center transition-all md:hover:scale-105"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <p className="text-lg text-gray-300 text-center">Fetching user details...</p>
                        )}
                    </div>

                    {/* Update Name */}
                    <div className="bg-gray-800 my-10 p-8 rounded-lg shadow-lg">
                        <section className="mb-12 flex flex-col font-bold">
                            <h1 className="text-white my-8 text-xl md:text-4xl self-center"> Updates </h1>
                            <h2 className="text-lg md:text-2xl font-semibold text-secondary mb-4">
                                Update Name
                            </h2>
                            <form className="flex flex-col md:flex-row space-y-4 md:space-y-0 items-center space-x-4" onSubmit={updateName}>
                                <textarea
                                    placeholder="Enter your name..."
                                    ref={nameRef}
                                    className="w-full border-2 border-secondary rounded-md p-2 h-12 resize-none focus:outline-none focus:ring-2 focus:ring-secondary"
                                ></textarea>
                                <button
                                    type="submit"
                                    className="bg-secondary text-white px-6 py-2 rounded-md font-semibold transition-all hover:scale-105"
                                >
                                    Update
                                </button>
                            </form>
                        </section>

                        {/* Update/Add Bio */}
                        <section className="mb-12">
                            <h2 className="text-lg md:text-2xl font-semibold text-secondary mb-4">
                                {userData.bio ? "Update Bio" : "Add Bio"}                        </h2>
                            <form
                                className="flex flex-col space-y-4"
                                onSubmit={updateBio}
                            >
                                <textarea
                                    placeholder="Enter your bio..."
                                    ref={bioRef}
                                    className="w-full border-2 border-secondary rounded-md p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-secondary"
                                ></textarea>
                                <button
                                    type="submit"
                                    className="bg-secondary text-white px-6 py-2 rounded-md font-semibold transition-all hover:scale-105"
                                >
                                    {userData.bio ? "Update Bio" : "Add Bio"}                              </button>
                            </form>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-lg md:text-2xl font-semibold text-secondary mb-4">
                                {userData.skillsList ? "Update Skills" : "Add Skills"}                        </h2>
                            <form
                                className="flex flex-col space-y-4"
                                onSubmit={updateSkills}
                            >
                                <textarea
                                    placeholder="Enter your skils `put , between them `..."
                                    ref={skillsRef}
                                    className="w-full border-2 border-secondary rounded-md p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-secondary"
                                ></textarea>
                                <button
                                    type="submit"
                                    className="bg-secondary text-white px-6 py-2 rounded-md font-semibold transition-all hover:scale-105"
                                >
                                    {userData.skillsList ? "Update Skills" : "Add Skills"}                              </button>
                            </form>
                        </section>

                        {/* Add/Update Picture */}
                        <section>
                            <h2 className="text-lg md:text-2xl font-semibold text-secondary mb-4">
                                {userData.profile ? "Update Picture" : "Add Picture"}
                            </h2>
                            <form
                                onSubmit={addPic}
                                className="flex flex-col items-center space-y-6"
                            >
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    {image ? (
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="Preview"
                                            className="w-32 h-32 rounded-full object-cover"
                                        />
                                    ) : (
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/128/1665/1665680.png"
                                            alt="Upload Icon"
                                            className="w-16 h-16"
                                        />
                                    )}
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`bg-secondary text-white px-6 py-2 rounded-md font-semibold ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                                        }`}
                                >
                                    {loading
                                        ? "Loading..."
                                        : `${userData.profile ? "Update" : "Add"} Picture`}
                                </button>
                            </form>
                            {userData.profile && (
                                <button
                                    onClick={deletePicture}
                                    disabled={loading}
                                    className={`bg-red-500 text-white mt-10 md:mt-6 px-6 py-2 rounded-md font-semibold ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                                        }`}
                                >
                                    {loading ? "Loading..." : "Remove Picture"}
                                </button>
                            )}
                        </section>
                    </div>
                    <Toaster />
                </div>
            </div>
        </div>
    );
};

export default Profile;
