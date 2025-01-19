import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { getFirestore, doc, collection, updateDoc } from "firebase/firestore";

const AllBlogs = () => {
    const { blogs, getAllBlog, currentUser, getAllUsers, users } = useAuth();
    const [loading, setLoading] = useState(false);
    const [liked, setLiked] = useState([]);
    const [commentState, setCommentState] = useState({}); // Object to hold comments for each blog

    const db = getFirestore();
    const collectionRef = collection(db, "blogs");
    const collectionRef2 = collection(db, "users");

    const user = users.find((b) => b.id === currentUser.uid);

    const comments = async (id, e) => {
        e.preventDefault();
        setLoading(true);

        const blog = blogs.find((b) => b.id === id);
        const prevComments = blog.comments || [];  // Ensure it's an array
        const newComment = user.name + " :  " + commentState[id] || ""; // Get the comment from state for the specific blog

        if (!newComment.trim()) {
            setLoading(false);
            return;
        }

        try {
            await updateDoc(doc(collectionRef, id), {
                comments: [...prevComments, newComment],
            });

            getAllBlog(); // Refresh blogs after comment update
        } catch (error) {
            console.log("Error updating comments:", error);
        }

        setLoading(false);
        getAllUsers();

        setCommentState(prevState => ({ ...prevState, [id]: "" })); // Clear the comment input for the specific blog
    };

    const like = async (id) => {
        setLoading(true);
        const likedBlogs = user.likedBlogs;
        const blog = blogs.find((b) => b.id === id);

        if (likedBlogs.includes(id)) {
            await updateDoc(doc(collectionRef2, currentUser.uid), {
                likedBlogs: likedBlogs.filter((b) => b !== id),
            });
            setLiked(likedBlogs.filter((b) => b !== id));
            await updateDoc(doc(collectionRef, id), { likes: blog.likes - 1 });
        } else {
            await updateDoc(doc(collectionRef2, currentUser.uid), {
                likedBlogs: [...likedBlogs, id],
            });
            setLiked([...likedBlogs, id]);
            await updateDoc(doc(collectionRef, id), { likes: blog.likes + 1 });
        }
        getAllUsers();
        getAllBlog();
        setLoading(false);
    };

    useEffect(() => {
        getAllBlog();
        getAllUsers();
    }, []);

    return (
        <>
            {blogs.length === 0 ? (
                <h1 className="text-2xl font-bold self-center">No blogs found</h1>
            ) : (
                <h1 className="text-2xl mt-8 md:text-4xl font-bold text-center text-secondary">ALL Blogs</h1>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 p-12 relative">
                {blogs.map((blog) => (
                    <div key={blog.id} className="relative bg-white py-4 px-8 rounded-md shadow-md flex flex-col gap-4">
                        <h1 className="text-2xl font-bold self-center">{blog.title}</h1>
                        <img
                            src={blog.imageUrl}
                            alt="Blog visual"
                            className="rounded-md w-full h-56 object-cover"
                        />

                        <p className="text-base text-gray-800 font-medium">{blog.bigDescription.substring(0, 250)}</p>
                        <Link
                            className="mt-2 font-semibold text-lg self-center hover:underline"
                            to={`/blog/${blog.id}`}
                        >
                            Read More
                        </Link>
                        {/* Like Button Section */}
                        <div className="flex justify-between items-center text-base mt-4">
                            <div className="flex gap-3">
                                <p>{blog.likes}</p>
                                <button
                                    onClick={() => like(blog.id)}
                                    disabled={loading}
                                    className={`flex items-center gap-2 text-base ${liked.includes(blog.id) ? "text-[#2563EB]" : "text-gray-600"}
                                        hover:text-blue-500 focus:outline-none transition-colors duration-300`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill={`${liked.includes(blog.id) ? "#2563EB" : "none"}`}
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                    <span className="font-semibold">Like</span>
                                </button>
                            </div>

                            {/* Comments Section Display */}
                            <span className="text-gray-500">
                                Comments: <span className="font-semibold">{blog.comments ? blog.comments.length : 0}</span>
                            </span>
                        </div>


                        {/* Comments and Text Area Section */}
                        < div className="mt-6 " >
                            <h2 className="text-lg font-semibold text-gray-700 mb-2 ml-2">Comments</h2>
                            {/* Comment List & Text Area (Grouped Together) */}
                            <div div className="bg-gray-100 p-4 rounded-md shadow-inner max-h-40 overflow-y-auto mb-4" >
                                <div className="space-y-2">
                                    {blog.comments && blog.comments.length > 0 ? (
                                        blog.comments.map((comment, index) => (
                                            <p key={index} className="text-sm text-gray-800 font-medium">
                                                {comment}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No comments yet. Be the first to comment!</p>
                                    )}
                                </div>
                            </div>

                            {/* Text Area for New Comment (Inside the same container as Comments) */}
                            <form className="flex items-center gap-4 " onSubmit={(e) => comments(blog.id, e)}>
                                <textarea
                                    className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    rows="2"
                                    placeholder="Write your comment here..."
                                    value={commentState[blog.id] || ""}
                                    onChange={(e) =>
                                        setCommentState((prevState) => ({
                                            ...prevState,
                                            [blog.id]: e.target.value,
                                        }))
                                    }
                                    required
                                ></textarea>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none transition-colors duration-300"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                    </svg>
                                </button>
                            </form>
                        </div >

                        {/* Read More Button */}

                    </div >
                ))}
            </div >
        </>
    );
};

export default AllBlogs;
