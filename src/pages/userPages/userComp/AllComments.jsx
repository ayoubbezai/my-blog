import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";
import anonymous from "../../../assets/anonymous.png";
import { fetchUser } from "@/utils/helpers";

const db = getFirestore();

const AllComments = ({ blog }) => {
    const [visibleCount, setVisibleCount] = useState(4);
    const [loading, setLoading] = useState(false);
    const [commentState, setCommentState] = useState("");
    const [user, setUser] = useState(null);
    const { currentUser } = useAuth();
    const [blogDetails, setBlogDetails] = useState(blog || {});

    useEffect(() => {
        const loadUser = async () => {
            if (currentUser?.uid) {
                setBlogDetails(blog);
                try {
                    const userData = await fetchUser(currentUser.uid); // Fetch user data
                    if (userData) {
                        setUser(userData); // Set user state
                    }
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            }
        };

        loadUser();
    }, [currentUser, blog]);

    const addComment = async (e) => {
        e.preventDefault();
        if (!commentState.trim() || !blogDetails || !user) return;

        setLoading(true);
        try {
            const newComment = {
                name: user?.name || "Anonymous",
                content: commentState,
                picture: user?.profile || anonymous,
                userId: currentUser?.uid || "unknown",
            };

            // **Update Firestore**
            await updateDoc(doc(db, "blogs", blog.id), {
                comments: arrayUnion(newComment),
            });

            // **Immediately update the state to show the new comment**
            setBlogDetails((prevDetails) => ({
                ...prevDetails,
                comments: [...prevDetails.comments, newComment], // Add new comment to the existing list
            }));

            setCommentState("");

            // **Increase Visible Count**
            setVisibleCount((prev) => prev + 1);

        } catch (error) {
            console.error("Error adding comment:", error);
        }
        setLoading(false);
    };

    return (
        <div>
            <div className="mt-4 max-h-80  md:max-h-96 overflow-auto  bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-3">
                    Comments ({blogDetails.comments?.length || 0})
                </h2>
                <div className="space-y-3">
                    {blogDetails.comments?.slice(0, visibleCount).map((comment, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                            <img
                                src={comment.picture || "https://via.placeholder.com/40"}
                                alt="User"
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                {comment.userId ? (
                                    <Link to={`/profile/${comment.userId}`} className="text-sm font-semibold text-blue-600 hover:underline">
                                        {comment.name}
                                    </Link>
                                ) : (
                                    <p className="text-sm font-semibold">{comment.name}</p>
                                )}
                                <p className="text-sm text-gray-700">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {visibleCount < (blogDetails.comments?.length || 0) && (
                    <button
                        onClick={() => setVisibleCount((prev) => prev + 3)}
                        className="mt-3 w-full text-center text-blue-600 hover:text-blue-800 font-semibold text-sm"
                    >
                        See More
                    </button>
                )}
            </div>
            <form onSubmit={addComment} className="flex flex-col md:flex-row gap-4 mt-4">
                <input
                    value={commentState}
                    onChange={(e) => setCommentState(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-2 md:p-3 rounded-md bg-white border border-gray-300 text-gray-800"
                />
                <button
                    type="submit"
                    disabled={loading || !user} // Disable until user is loaded
                    className="bg-blue-500 px-4 py-2 text-white rounded-md hover:bg-blue-600"
                >
                    {loading ? "Posting..." : "Comment"}
                </button>
            </form>
        </div>
    );
};

export default AllComments;
