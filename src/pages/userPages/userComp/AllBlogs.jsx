import { useParams, Link } from 'react-router-dom';
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";
import { getFirestore, updateDoc, doc } from "firebase/firestore";
import NavBar from '../userComp/NavBar';

function BlogDetails() {
    const { getAllBlog, blogs, currentUser, getAllUsers, users } = useAuth();
    const [loading, setLoading] = useState(false);
    const [liked, setLiked] = useState(false);
    const [commentState, setCommentState] = useState("");

    const db = getFirestore();
    const { id } = useParams();
    const blog = blogs.find((b) => b.id.toString() === id);

    const user = users.find((b) => b.id === currentUser.uid);

    useEffect(() => {
        getAllBlog();
        getAllUsers();
        if (user && blog) {
            setLiked(user.likedBlogs?.includes(blog.id));
        }
    }, [user, blog, getAllBlog, getAllUsers]);

    const like = async () => {
        setLoading(true);
        const likedBlogs = user.likedBlogs || [];

        try {
            if (liked) {
                await updateDoc(doc(db, "users", currentUser.uid), {
                    likedBlogs: likedBlogs.filter((b) => b !== blog.id),
                });
                await updateDoc(doc(db, "blogs", blog.id), { likes: blog.likes - 1 });
            } else {
                await updateDoc(doc(db, "users", currentUser.uid), {
                    likedBlogs: [...likedBlogs, blog.id],
                });
                await updateDoc(doc(db, "blogs", blog.id), { likes: blog.likes + 1 });
            }
            setLiked(!liked);
        } catch (error) {
            console.log("Error updating likes:", error);
        }
        setLoading(false);
        getAllUsers();
        getAllBlog();
    };

    const addComment = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!commentState.trim()) {
            setLoading(false);
            return;
        }

        try {
            const prevComments = blog.comments || [];
            const newComment = `${user.name}: ${commentState}`;

            await updateDoc(doc(db, "blogs", blog.id), {
                comments: [...prevComments, newComment],
            });
            setCommentState("");
        } catch (error) {
            console.log("Error adding comment:", error);
        }

        setLoading(false);
        getAllBlog();
    };

    if (!blog) {
        return <h2 className="text-center text-secondary text-xl">Blog not found</h2>;
    }

    return (
        <div className='flex flex-col md:flex-row '>
            <NavBar />
            <div className="flex flex-col items-center bg-primary p-4 md:w-full md:h-screen md:overflow-y-auto">
                <div className="border-2 border-white rounded-lg shadow-lg p-6 max-w-lg w-full">
                    <img src={blog.imageUrl} alt="Blog" className="w-full rounded-md mt-2 mb-6" />
                    <h1 className="text-2xl font-bold text-white mb-4">{blog.title}</h1>
                    <p className="text-white text-lg mb-6">{blog.bigDescription}</p>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-white">{blog.likes} Likes</p>
                        <button
                            onClick={like}
                            disabled={loading}
                            className={`px-4 py-2 rounded-md text-white font-semibold ${liked ? 'text-[#159cdf]' : 'text-white'} hover:scale-105 transition-all`}
                        >
                            {liked ? "Unlike" : "Like"}
                        </button>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-md mb-4 max-h-40 overflow-y-auto">
                        <h3 className="font-bold text-white mb-2">Comments:</h3>
                        {blog.comments && blog.comments.length > 0 ? (
                            blog.comments.map((comment, index) => (
                                <p key={index} className="text-sm text-white mb-1">{comment}</p>
                            ))
                        ) : (
                            <p className="text-sm text-gray-300">No comments yet. Be the first to comment!</p>
                        )}
                    </div>

                    <form onSubmit={addComment} className="flex flex-col gap-4">
                        <textarea
                            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows="2"
                            placeholder="Write your comment here..."
                            value={commentState}
                            onChange={(e) => setCommentState(e.target.value)}
                        ></textarea>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:scale-105 transition-all"
                        >
                            Add Comment
                        </button>
                    </form>

                    <Link
                        className="block mt-6 text-center bg-black text-white px-6 py-3 rounded-md font-semibold hover:scale-105 transition-all"
                        to="/blogs"
                    >
                        Back To Blogs
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default BlogDetails;
