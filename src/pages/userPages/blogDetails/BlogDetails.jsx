import { useAuth } from "../../../context/AuthContext";
import { useParams } from "react-router-dom";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import anonymous from "../../../assets/anonymous.png";
import NavBar from "../userComp/NavBar";

const BlogDetails = () => {
    const { currentUser } = useAuth();
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [commentState, setCommentState] = useState("");
    const [liked, setLiked] = useState(false);

    const db = getFirestore();

    const fetchBlog = async (blogId) => {
        try {
            const blogRef = doc(db, "blogs", blogId);
            const blogSnapshot = await getDoc(blogRef);
            if (blogSnapshot.exists()) {
                const blogData = blogSnapshot.data();
                setBlog({ id: blogId, ...blogData });
            } else {
                console.error("Blog not found");
            }
        } catch (error) {
            console.error("Error fetching blog:", error);
        }
    };

    const fetchUser = async (userId) => {
        try {
            const userRef = doc(db, "users", userId);
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                setUser(userData);
                setLiked(userData.likedBlogs?.includes(id));
            } else {
                console.error("User not found");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const likeBlog = async () => {
        setLoading(true);
        if (!user || !blog) return;

        try {
            const updatedLikes = liked
                ? user.likedBlogs.filter((blogId) => blogId !== id)
                : [...(user.likedBlogs || []), id];

            await updateDoc(doc(db, "users", currentUser.uid), {
                likedBlogs: updatedLikes,
            });

            await updateDoc(doc(db, "blogs", id), {
                likes: liked ? blog.likes - 1 : blog.likes + 1,
            });

            setLiked(!liked);
            fetchBlog(id); // Refresh the blog data
        } catch (error) {
            console.error("Error liking blog:", error);
        }
        setLoading(false);
    };

    const addComment = async (e) => {
        e.preventDefault();
        if (!commentState.trim() || !blog) return;

        setLoading(true);
        try {
            const newComment = {
                name: user.name,
                content: commentState,
                picture: user.profile || anonymous,
            };

            await updateDoc(doc(db, "blogs", id), {
                comments: [...(blog.comments || []), newComment],
            });

            setCommentState("");
            fetchBlog(id); // Refresh comments
        } catch (error) {
            console.error("Error adding comment:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (currentUser?.uid) {
            fetchUser(currentUser.uid);
        }
        if (id) {
            fetchBlog(id);
        }
    }, [currentUser, id]);

    if (!blog) {
        return <p className="text-white text-center mt-8">Loading Blog Details...</p>;
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-primary">
            <NavBar />
            <div className="flex-1  md:p-16 bg-primary shadow-lg md:h-screen md:overflow-y-auto">
                <div className="max-w-4xl mx-auto my-8 bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <img
                            src={blog.createdBy?.photo || anonymous}
                            alt="Author"
                            className="w-12 h-12 rounded-full border-2 border-gray-300"
                        />
                        <div>
                            <p className="text-gray-100 text-sm md:text-base font-semibold">{blog.createdBy?.name || "Unknown Author"}</p>
                            <p className="text-gray-400 text-sm">{blog.createdAt}</p>
                        </div>
                    </div>
                    <img
                        src={blog.imageUrl}
                        alt="Blog Visual"
                        className="rounded-md w-full h-64 object-cover mb-6"
                    />
                    <h1 className="text-3xl text-white font-bold mb-4">{blog.title}</h1>
                    <p className="text-gray-300 mb-6">{blog.bigDescription}</p>
                    <div className="pt-4 my-3 mb-10">
                        {blog.tags && blog.tags.map((b, index) => (
                            <div key={index} className="inline-block m-2 p-[2px] rounded-lg bg-gradient-to-r from-pink-500 to-purple-500">
                                <span className="block px-3 py-1 text-white font-semibold rounded-lg bg-gray-800">{b}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between text-white mb-4">
                        <p>{blog.likes} Likes</p>
                        <button
                            onClick={likeBlog}
                            disabled={loading}
                            className={`flex items-center gap-2 ${liked ? "text-[#159cdf]" : "text-white"} 
                                        hover:text-blue-500 focus:outline-none transition-colors duration-300`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={`${liked ? "#159cdf" : "none"}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span className="font-semibold">Like</span>
                        </button>
                    </div>

                    <h2 className="text-xl text-white font-semibold mb-4">Comments</h2>
                    <div className="bg-gray-700 p-4 rounded-md mb-4">
                        {blog.comments?.length > 0 ? (
                            blog.comments.map((comment, index) => (
                                <div key={index} className="flex items-start gap-4 mb-3">
                                    <img
                                        src={comment.picture || anonymous}
                                        alt="Comment Author"
                                        className="w-10 h-10 rounded-full border-2 border-blue-500"
                                    />
                                    <div>
                                        <p className="text-gray-300 font-semibold">{comment.name}</p>
                                        <p className="text-gray-400">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No comments yet.</p>
                        )}
                    </div>
                    <form onSubmit={addComment} className="flex gap-4">
                        <textarea
                            value={commentState}
                            onChange={(e) => setCommentState(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-gray-300"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 px-4 py-2 text-white rounded-md hover:bg-blue-600"
                        >
                            Comment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
