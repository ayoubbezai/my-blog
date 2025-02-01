import { useAuth } from "../../../context/AuthContext";
import { useParams, Link } from "react-router-dom";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import anonymous from "../../../assets/anonymous.png";
import NavBarUser from "../userComp/NavBar";
import NavBarAdmin from "../../adminPages/adminComp/Navbar";
import { createPortal } from 'react-dom';
import AllComments from "../userComp/AllComments";
const BlogDetails = () => {
    const { currentUser } = useAuth();
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [commentState, setCommentState] = useState("");
    const [liked, setLiked] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef(null);

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
                userId: currentUser.uid
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
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen]);
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
        <div className="flex flex-col md:flex-row min-h-screen  bg-primary">
            {user.role === "admin" && <NavBarAdmin />}
            {user.role === "user" && <NavBarUser />}
            <div className="flex-1  md:p-16 bg-primary shadow-lg  md:h-screen md:overflow-y-auto">
                <div className="max-w-4xl w-full md:w-2/3 mx-auto my-6 bg-gray-800 rounded-lg shadow-lg p-6 py-4">
                    <div className="flex items-center gap-4 mb-2">
                        <img
                            src={blog.createdBy?.photo || anonymous}
                            alt="Author"
                            className="w-10 h-10 rounded-full border-2 border-gray-300"
                        />
                        <div>
                            <p className="text-gray-100 text-sm font-semibold">{blog.createdBy?.name || "Unknown Author"}</p>
                            <p className="text-gray-400 text-sm">{blog.createdAt}</p>
                        </div>
                    </div>
                    <img
                        src={blog.imageUrl}
                        alt="Blog Visual"
                        className="rounded-md w-full h-64 object-cover mb-6"
                    />
                    <h1 className="text-lg text-white font-bold mb-4">{blog.title}</h1>
                    <p className="text-gray-300 text-sm  mb-2 break-words">{blog.bigDescription}</p>
                    <div className="pt-4  mb-4">
                        {blog.tags && blog.tags.map((b, index) => (
                            <div key={index} className="inline-block m-2 p-[2px] rounded-lg bg-gradient-to-r from-secondary to-green-500">
                                <span className="block px-2 py-1 text-white font-semibold rounded-lg bg-gray-800">{b}</span>
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
                    <div className="bg-gray-700 px-4 py-2 rounded-md mb-4">
                        {blog.comments && blog.comments.length > 0 ? (
                            blog.comments.slice(0, 3).map((comment, index) => (
                                <div key={index} className="flex items-start gap-4 p-2 bg-gray-700  border-b-2 border-gray-600">
                                    <img
                                        src={comment.picture || anonymous}
                                        alt="profile"
                                        className="w-10 h-10 rounded-full border-2 border-blue-500"
                                    />
                                    <div>
                                        {comment.userId ? <Link to={`/profile/${comment.userId}`} className="text-sm text-gray-300 font-semibold hover:underline">{comment.name}</Link> : <p className="text-sm text-gray-300 font-semibold ">{comment.name}</p>}

                                        <p className="text-sm text-gray-400 mt-1">{comment.content}</p>
                                    </div>
                                </div>

                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic text-center">
                                No comments yet. Be the first to comment!
                            </p>
                        )}
                        {blog.comments && blog.comments.length > 4 && (<button onClick={() => setIsOpen(true)} className=" self-center w-full  text-center pt-2 text-white text-sm font-medium">See all Comments</button>)}
                        {isOpen && createPortal(
                            <div className="fixed inset-0 flex   justify-center bg-black bg-opacity-50 z-50">
                                <div ref={modalRef} className="bg-white overflow-auto w-[90%] my-2 md:w-1/2  p-6 pb-0 rounded-lg shadow-lg relative">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold">All comments</h2>
                                        <button onClick={() => setIsOpen(false)} className="text-xl">X</button>
                                    </div>
                                    <AllComments blog={blog} />
                                </div>
                            </div>,
                            document.body
                        )}
                    </div>
                    <form onSubmit={addComment} className="flex gap-4">
                        <input
                            value={commentState}
                            onChange={(e) => setCommentState(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full p-2 md:p-3 rounded-md bg-gray-800 border border-gray-700 text-gray-300"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 px-4 py-1 text-white rounded-md hover:bg-blue-600"
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
