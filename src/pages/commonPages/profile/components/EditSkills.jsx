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

    // State to manage visibility of the input field and skills value
    const [isEditing, setIsEditing] = useState(false);
    const [skills, setSkills] = useState(userData?.skillsList?.join(", ") || "");

    const updateSkills = async (e) => {
        e.preventDefault();
        const skillsList = skills.split(",").map((skill) => skill.trim());
        if (skillsList.length === 0 || skillsList.some((skill) => !skill)) {
            return toast.error("Skills cannot be empty.");
        }
        await updateDoc(doc(data2, currentUser.uid), { skillsList });
        toast.success("Skills updated successfully.");
        setIsEditing(false); // Hide the input after updating
        fetchUserData();
    };

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                    Skills
                </h2>
                <PenIcon
                    onClick={() => setIsEditing(!isEditing)}
                    className="cursor-pointer hover:text-secondary transition"
                />
            </div>

            <div className="mt-4">
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
                        {userData.skillsList && userData.skillsList.map((skill, index) => (
                            <div
                                key={index}
                                className="m-2 p-[2px] rounded-lg bg-gradient-to-r from-secondary to-green-500"
                            >
                                <span className="block px-4 py-2 text-white font-medium rounded-lg bg-gray-800">
                                    {skill}
                                </span>
                            </div>
                        ))}
                        {!userData.skillsList?.length && (
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
