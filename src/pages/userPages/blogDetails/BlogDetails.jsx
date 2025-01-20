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
            <div className="flex-1 flex-col  items-center py-12  bg-primary md:p-4   md:w-full md:h-screen md:overflow-y-auto  ">
                <div className=" border-2 border-white md:rounded-lg shadow-lg p-6 w-full md:w-1/2 mx-auto">
                    <img src={blog.imageUrl} alt="Blog" className="w-full rounded-md mt-2 mb-6 aspect-video" />
                    <h1 className="text-2xl font-bold text-white mb-4">{blog.title}</h1>
                    <p className="text-white text-lg mb-6">{blog.bigDescription}</p>
                    <div className="flex flex-col justify-center gap-4 ">
                        {/* Like Button */}
                        <div className="flex items-center justify-between  text-white">
                            <p>{blog.likes} Likes</p>
                            <button
                                onClick={() => like()}
                                disabled={loading}
                                className={`flex items-center gap-2 ${liked ? "text-[#159cdf]" : "text-white"} 
                                        hover:text-blue-500 focus:outline-none transition-colors duration-300`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill={`${liked ? "#159cdf" : "none"}`}
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <span className="font-semibold">Like</span>
                            </button>
                        </div>



                        <h3 className="font-bold text-white mb-2">Comments: <span className="font-semibold mx-2">{blog.comments ? blog.comments.length : 0}</span></h3>
                        <div className=" bg-gray-800  p-4 rounded-md mb-4 max-h-40 overflow-y-auto">
                            {blog.comments && blog.comments.length > 0 ? (
                                blog.comments.map((comment, index) => (
                                    <p key={index} className="text-sm text-white mb-1">{comment}</p>
                                ))
                            ) : (
                                <p className="text-sm text-gray-300">No comments yet. Be the first to comment!</p>
                            )}
                        </div>
                    </div>


                    <form onSubmit={addComment} className="flex flex-col gap-4">
                        <textarea
                            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                            rows="2"
                            placeholder="Write your comment here..."
                            value={commentState}
                            onChange={(e) => setCommentState(e.target.value)}
                        ></textarea>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-secondary text-white px-6 py-3 rounded-md font-semibold hover:scale-105 transition-all"
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
