import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { getFirestore, doc, collection, updateDoc } from "firebase/firestore";

const AllBlogs = () => {
    const { blogs, getAllBlog, currentUser, getAllUsers, users } = useAuth();
    const [loading, setLoading] = useState(false);
    const [Liked, setLiked] = useState([]);
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

        setLiked([]);

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
    }, [Liked]);

    return (
        <>
            {blogs.length === 0 ? (
                <h1 className="text-2xl font-bold self-center">No blogs found</h1>
            ) : (
                <h1 className="text-2xl mt-8 md:text-4xl font-bold text-center text-secondary">ALL Blogs</h1>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 p-12 relative">
                {blogs.map((blog) => (
                    <div key={blog.id} className="relative bg-white p-4 rounded-md shadow-md flex flex-col gap-4">
                        <h1 className="text-2xl font-bold self-center">{blog.title}</h1>
                        <img src={blog.imageUrl} alt="Blog visual" className="rounded-md" />

                        <p className="text-base text-gray-800 font-medium">{blog.description}</p>

                        <div className="flex justify-between items-center text-base ">
                            <div className="flex gap-3">
                                <p>{blog.likes}</p>
                                <button
                                    onClick={() => like(blog.id)}
                                    disabled={loading}
                                    className={`flex text-base items-center gap-2 ${Liked.includes(blog.id) && "text-blue-600"
                                        } hover:text-primary focus:outline-none`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                    </svg>
                                    Like
                                </button>
                            </div>

                            {/* Placeholder for Comments */}
                            <span className="text-gray-500">
                                Comments: <span className="font-semibold">{blog.comments ? blog.comments.length : 0}</span>
                            </span>
                        </div>

                        {/* Styled Comments Section */}
                        <div className="mb-12">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Comments</h2>
                            <div className="bg-gray-100 p-4 rounded-md shadow-inner max-h-40 overflow-y-auto">
                                <div className="space-y-2">
                                    {blog.comments && blog.comments.length > 0 ? (
                                        blog.comments.map((b) => (

                                            <p className="text-sm text-gray-800 font-medium">
                                               {b}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No comments yet. Be the first to comment!</p>
                                    )}
                                </div>
                            </div>

                            {/* Comment Input Section */}
                            <form className="mt-4" onSubmit={(e) => comments(blog.id, e)}>
                                <textarea
                                    className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    rows="2"
                                    placeholder="Write your comment here..."
                                    value={commentState[blog.id] || ""}
                                    onChange={(e) => setCommentState(prevState => ({
                                        ...prevState, [blog.id]: e.target.value
                                    }))}
                                    required
                                ></textarea>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>

                        <Link
                            className="absolute bottom-2 mb-2 font-semibold text-lg self-center hover:underline"
                            to={`/blog/${blog.id}`}
                        >
                            Read More
                        </Link>
                    </div>
                ))}
            </div>
        </>
    );
};

export default AllBlogs;
