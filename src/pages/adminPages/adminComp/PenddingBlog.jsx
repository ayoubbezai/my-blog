import { useEffect, useState } from "react"; // Import React hooks
import { getFirestore, query, where, collection, getDocs, updateDoc, doc, addDoc } from "firebase/firestore"; // Firestore query functions
import OneBlog from "../../userPages/userComp/OneBlog";


const db = getFirestore(); // Firestore instance
const PendingBlog = () => {
    const [myBlogs, setMyBlogs] = useState([]); // Initialize state for blogs

    useEffect(() => {
        const getBlog = async () => {
            try {
                // Firestore query to get all blogs with a pending status
                const q = query(
                    collection(db, "newBlogs"),
                    where("status", "==", "pending")
                );

                // Fetch the filtered blogs from Firestore
                const querySnapshot = await getDocs(q);
                const pendingBlogs = [];

                querySnapshot.forEach((doc) => {
                    pendingBlogs.push({ id: doc.id, ...doc.data() }); // Add the blog data to the array
                });

                // Set the state with the pending blogs
                setMyBlogs(pendingBlogs);
            } catch (error) {
                console.log("Error fetching pending blogs:", error);
            }
        };

        // Run the getBlog function when the component is mounted
        getBlog();
    }, []); // Empty dependency array means it runs once when the component mounts

    // Approve Blog: Update the status to accepted and move it to the "blogs" collection
    const approve = async (id) => {
        try {
            // Firestore query to update the status of the blog to accepted
            await updateDoc(doc(db, "newBlogs", id), {
                status: "accepted",
            });

            // Add the approved blog to the "blogs" collection
            await addDoc(collection(db, "blogs"), myBlogs.find((b) => b.id === id));

            // Remove the blog from the pending list
            setMyBlogs((prev) => prev.filter((b) => b.id !== id));
        } catch (error) {
            console.log("Error approving blog:", error);
        }
    };

    // Refuse Blog: Update the status to refused
    const refuse = async (id) => {
        try {
            // Firestore query to update the status of the blog to refused
            await updateDoc(doc(db, "newBlogs", id), {
                status: "refused",
            });

            // Remove the blog from the pending list
            setMyBlogs((prev) => prev.filter((b) => b.id !== id));
        } catch (error) {
            console.log("Error refusing blog:", error);
        }
    };

    const statusStyles = {
        pending: "bg-yellow-500 text-yellow-900",
        accepted: "bg-green-500 text-green-900",
        refused: "bg-red-500 text-red-900",
    };

    return (
        <div className="flex-1 p-8 md:p-16 bg-primary shadow-lg md:h-screen md:overflow-y-auto">
            <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-secondary to-green-500 text-transparent bg-clip-text mb-10">
                {myBlogs.length > 0 ? "My Pending Blogs" : "You don't have any pending blogs"}
            </h1>

            {/* Blogs Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-8">
                {myBlogs.map((b) => (
                    <div
                        key={b.id}
                        className="py-4 bg-gray-800 flex flex-col items-center gap-2 rounded-lg border-2 border-transparent shadow-lg hover:shadow-xl transition-shadow duration-300 sm:w-full px-6 md:px-4  mx-auto w-full lg:w-4/5 "
                    >
                        <OneBlog blog={b} />

                        {/* Status Badge */}
                        <span
                            className={`px-4 py-1 rounded-full text-sm font-semibold ${statusStyles[b?.status] || "bg-gray-500 text-gray-900"}`}
                        >
                            {b?.status}
                        </span>

                        {/* Approve and Refuse Buttons */}
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => approve(b.id)}
                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => refuse(b.id)}
                                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Refuse
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PendingBlog;
