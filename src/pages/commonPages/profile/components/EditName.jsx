import { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useAuth } from "../../../../context/AuthContext";
import { getFirestore, collection } from "firebase/firestore";
import PenIcon from "./PenIcon"; // Import the PenIcon component

const db = getFirestore();
const data2 = collection(db, "users");

const EditName = ({ fetchUserData, userData }) => {
    const { currentUser } = useAuth();

    // State to manage visibility of the input field and name value
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");

    const startEditing = () => {
        // Initialize name state when editing starts
        setName(userData?.name || "");
        setIsEditing(true);
    };

    const updateName = async (e) => {
        e.preventDefault();
        if (!name) {
            return toast.error("Name cannot be empty.");
        }
        try {
            await updateDoc(doc(data2, currentUser.uid), { name });
            toast.success("Name updated successfully.");
            setIsEditing(false); // Hide the input after updating
            fetchUserData(); // Refresh user data
        } catch (error) {
            console.error("Error updating name:", error);
            toast.error("Failed to update name. Please try again.");
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between">
                <h1 className="text-xl md:text-2xl font-bold text-white">
                    User Name
                </h1>
                <PenIcon
                    onClick={startEditing} // Initialize name and set editing mode
                    className="cursor-pointer hover:text-secondary transition"
                />
            </div>

            <div className="my-4">
                {isEditing ? (
                    <form onSubmit={updateName} className="w-full mt-4">
                        <textarea
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name..."
                            className="w-full border-2 border-secondary rounded-md p-2 h-12 resize-none focus:outline-none focus:ring-2 focus:ring-secondary"
                        ></textarea>
                        <button
                            type="submit"
                            className="bg-secondary text-white px-6 py-2 rounded-md font-semibold transition-all hover:scale-105 mt-4"
                        >
                            Update
                        </button>
                    </form>
                ) : (
                    <h2 className="text-lg md:text-xl font-medium text-gray-200">
                        {userData?.name || "Loading..."}
                    </h2>
                )}
            </div>
        </div>
    );
};

export default EditName;
