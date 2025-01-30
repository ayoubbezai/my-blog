import { useEffect, useState, useRef } from "react";
import { like, comments, fetchoneBlog, fetchUser } from "../../../utils/helpers"
import { useAuth } from "@/context/AuthContext";
import anonymous from "../../../assets/anonymous.png";
import { Link } from "react-router-dom"
import { createPortal } from 'react-dom';
import AllComments from "./AllComments";


const LikeAndComments = ({ blog, setLimitBlogs, limitBlogs }) => {

    const modalRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [liked, setLiked] = useState([]);
    const [commentState, setCommentState] = useState({});
    const [user, setUser] = useState({});
    const { currentUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);


    const handlelike = async (id) => {
        setLoading(true);
        try {
            await like(id, currentUser, limitBlogs, user, setUser, setLiked, setLimitBlogs)
        } catch (error) {
            console.error("error", error)
        } finally {
            setLoading(false);
        }

    }

    const handleComments = async (e, id) => {
        e.preventDefault();
        setLoading(true);
        try {
            await comments(id, limitBlogs, currentUser, user, commentState, setCommentState)
        } catch (error) {
            console.error("Error adding comment:", error)
        } finally {
            setLoading(false);
            fetchoneBlog(id, setLimitBlogs);

        }
    };


    useEffect(() => {
        fetchUser(currentUser.uid, setUser);

        if (user) {
            setLiked(user.likedBlogs || []);
        }
    }, [user]);

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
    return (
        <div className="flex flex-col self-start mt-8 justify-center gap-4 w-full lg:w-2/5">
            <div className="flex items-center justify-between text-white">
                <p>{blog.likes} Likes</p>
                <button
                    onClick={() => handlelike(blog.id)}
                    disabled={loading}
                    className={`flex items-center gap-2 ${liked.includes(blog.id) ? "text-[#159cdf]" : "text-white"} 
                                        hover:text-blue-500 focus:outline-none transition-colors duration-300`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={`${liked.includes(blog.id) ? "#159cdf" : "none"}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="font-semibold">Like</span>
                </button>
            </div>
            <div className="text-white">Comments: <span className="font-semibold">{blog.comments ? blog.comments.length : 0}</span></div>
            <div className="flex flex-col ">
                <div className="bg-gray-800 pr-2 rounded-md shadow-inner max-h-48 overflow-y-auto ">
                    {blog.comments && blog.comments.length > 0 ? (
                        blog.comments.slice(0, 4).map((comment, index) => (
                            <div key={index} className="flex items-start gap-4 p-2 bg-gray-700 rounded-lg mb-3 shadow-sm">
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
                    {blog.comments && blog.comments.length > 4 && (<button onClick={() => setIsOpen(true)} className=" self-center w-full  text-center text-white text-sm font-medium">See all Comments</button>)}
                    {isOpen && createPortal(
                        <div className="fixed inset-0 flex   justify-center bg-black bg-opacity-50 z-50">
                            <div ref={modalRef} className="bg-white overflow-auto w-[90%] my-2 md:w-1/2 p-6 pb-0 rounded-lg shadow-lg relative">
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
            </div>
            <form className="flex items-center gap-4" onSubmit={(e) => handleComments(e, blog.id)}>
                <textarea
                    className="w-full p-2 text-xs md:text-sm  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="1"
                    placeholder="Write comment..."
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </button>
            </form>
        </div>
    )
}

export default LikeAndComments