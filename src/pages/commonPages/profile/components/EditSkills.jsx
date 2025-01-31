import { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useAuth } from "../../../../context/AuthContext";
import { getFirestore, collection } from "firebase/firestore";
import PenIcon from "./PenIcon"; // Import the PenIcon component

const db = getFirestore();
const data2 = collection(db, "users");

const EditSkills = ({ fetchUserData, userData }) => {
    const { currentUser } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [skills, setSkills] = useState("");

    const startEditing = () => {
        // Set skills when editing starts to ensure it's initialized
        setSkills(userData?.skillsList?.join(", ") || "");
        setIsEditing(!isEditing);
    };

    const updateSkills = async (e) => {
        e.preventDefault();
        const skillsList = skills.split(",").map((skill) => skill.trim());
        if (skillsList.length === 0 || skillsList.some((skill) => !skill)) {
            return toast.error("Skills cannot be empty.");
        }
        try {
            await updateDoc(doc(data2, currentUser.uid), { skillsList });
            toast.success("Skills updated successfully.");
            setIsEditing(false);
            fetchUserData(); // Refresh user data
        } catch (error) {
            console.error("Error updating skills:", error);
            toast.error("Failed to update skills. Please try again.");
        }
    };

    return (
        <div className="mb-2">
            <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-bold text-white">
                    Skills
                </h2>
                <PenIcon
                    onClick={startEditing} // Start editing and initialize skills
                    className="cursor-pointer hover:text-secondary transition"
                />
            </div>

            <div className="mt-2">
                {isEditing ? (
                    <form className="flex flex-col space-y-4" onSubmit={updateSkills}>
                        <textarea
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            placeholder="Enter your skills (comma-separated)..."
                            className="w-full border-2 border-secondary rounded-md p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-secondary"
                        ></textarea>
                        <button
                            type="submit"
                            className="bg-secondary text-white px-6 py-2 rounded-md font-semibold transition-all hover:scale-105"
                        >
                            Update Skills
                        </button>
                    </form>
                ) : (
                    <div className="flex flex-wrap">
                        {userData?.skillsList && userData.skillsList.map((skill, index) => (
                            <div
                                key={index}
                                className="m-2 mt-3 p-[2px] rounded-lg bg-gradient-to-r from-secondary to-green-500"
                            >
                                <span className="block px-3 py-1 text-white font-medium rounded-lg bg-gray-800">
                                    {skill}
                                </span>
                            </div>
                        ))}
                        {!userData?.skillsList?.length && (
                            <p className="text-gray-200">
                                No skills available. Click the pen icon to add some!
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditSkills;
