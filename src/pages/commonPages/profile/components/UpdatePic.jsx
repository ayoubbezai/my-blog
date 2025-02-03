import { getFirestore, doc, updateDoc, collection } from "firebase/firestore";
import { useState } from "react";
import toast from 'react-hot-toast';
import { useAuth } from "../../../../context/AuthContext";

const UpdatePic = ({ setIsOpen }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);

    const db = getFirestore();
    const collectionRef = collection(db, "users");

    const addPic = async () => {
        const dataImage = new FormData();
        dataImage.append("file", image);
        dataImage.append("upload_preset", "my-blog");
        dataImage.append("cloud_name", "dbjoo9sww");

        try {
            setLoading(true);

            if (!image) {
                toast.error("Please Upload an image");
                setLoading(false);
                return;
            }

            const res = await fetch('https://api.cloudinary.com/v1_1/dbjoo9sww/image/upload', {
                method: "POST",
                body: dataImage,
            });

            const cloudData = await res.json();
            const docRef = doc(collectionRef, currentUser.uid);
            await updateDoc(docRef, { profile: cloudData.url });

            toast.success("Profile picture updated successfully!");
            setIsOpen(false); // Close modal after successful update

        } catch (error) {
            console.error("Error adding pic:", error);
            toast.error("Error updating profile picture");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col  items-center gap-12 ">
            <div className="input flex justify-center mt-12 ">
                <label htmlFor="file-upload" className="custom-file-upload">
                    {image ? (
                        <img
                            className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover"
                            src={URL.createObjectURL(image)}
                            alt="Uploaded"
                        />
                    ) : (
                        <img
                            src="https://cdn-icons-png.flaticon.com/128/1665/1665680.png"
                            className="h-20 w-20 rounded-full border-4 "
                            alt="Upload"
                        />
                    )}
                </label>
                <input
                    id="file-upload"
                    className="text-white hidden"
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                />
            </div>

            <div className="">
                <button
                    className="bg-secondary text-white p-2 rounded-md self-center   text-center font-bold"
                    onClick={addPic}
                    disabled={loading || !image} // Disable the button if no image is selected
                >
                    {loading ? "Loading..." : "Update Profile Picture"}
                </button>
            </div>
        </div>
    );
};

export default UpdatePic;
