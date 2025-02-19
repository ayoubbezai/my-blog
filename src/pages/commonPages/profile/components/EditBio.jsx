import { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useAuth } from "../../../../context/AuthContext";
import { getFirestore, collection } from "firebase/firestore";
import PenIcon from "./PenIcon"; // Import the PenIcon component

const db = getFirestore();
const data2 = collection(db, "users");

const EditBio = ({ fetchUserData, userData }) => {
    const { currentUser } = useAuth();

    // State to manage visibility of the input field and bio value
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState("");

    const startEditing = () => {
        // Initialize bio state when editing starts
        setBio(userData?.bio || "");
        setIsEditing(!isEditing);
    };

    const updateBio = async (e) => {
        e.preventDefault();
        if (!bio) {
            return toast.error("Bio cannot be empty.");
        }
        try {
            await updateDoc(doc(data2, currentUser.uid), { bio });
            toast.success("Bio updated successfully.");
            setIsEditing(false); // Hide the input after updating
            fetchUserData(); // Refresh user data
        } catch (error) {
            console.error("Error updating bio:", error);
            toast.error("Failed to update bio. Please try again.");
        }
    };

    return (
        <div className="my-8">
            <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-bold text-white">
                    Bio
                </h2>
                <PenIcon
                    onClick={startEditing} // Initialize bio and set editing mode
                    className="cursor-pointer hover:text-secondary transition"
                />
            </div>

            <div className="mt-2">
                {isEditing ? (
                    <form className="flex flex-col space-y-4" onSubmit={updateBio}>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Enter your bio..."
                            className="w-full border-2 border-secondary rounded-md p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-secondary"
                        ></textarea>
                        <button
                            type="submit"
                            className="bg-secondary text-white px-6 py-2 rounded-md font-semibold transition-all hover:scale-105"
                        >
                            Update Bio
                        </button>
                    </form>
                ) : (
                    <p className="text-base text-gray-200 mt-1">
                        {userData?.bio || "No bio available. Click the pen icon to add one!"}
                    </p>
                )}
            </div>
        </div>
    );
};

export default EditBio;
