import { useAuth } from "../../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { getFirestore, doc, collection, updateDoc, query, limit, startAfter, getDocs, getDoc } from "firebase/firestore";
import { useEffect, useState, useMemo, useRef } from "react";
import anonymous from "../../../assets/anonymous.png";
import { motion } from 'framer-motion';

const AllBlogs = () => {
    const { currentUser } = useAuth();
    const nav = useNavigate()
    const searchRef = useRef("")
    const [loading, setLoading] = useState(false);
    const [blogLoading, setBlogLoading] = useState(false);
    const [user, setUser] = useState({});
    const [totalBlogs, setTotalBlogs] = useState(false);
    const [blogsLoaded, setBlogsLoaded] = useState(3);
    const [lastVisible, setLastVisible] = useState(null);
    const [liked, setLiked] = useState([]);
    const [commentState, setCommentState] = useState({});
    const [limitBlogs, setLimitBlogs] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const memoizedBlogs = useMemo(() => limitBlogs, [limitBlogs]);
    const memoizedLastVisible = useMemo(() => lastVisible, [lastVisible]);

    const db = getFirestore();
    const collectionRef = collection(db, "blogs");
    const collectionRef2 = collection(db, "users");

    // Function to fetch the total blog count
    const fetchTotalBlogsCount = async () => {
        const snapshot = await getDocs(collectionRef);
        return snapshot.size;
    };

    // Function to fetch limited data from a collection
    const fetchLimitData = async (collectionName, limitCount, startDoc = null) => {
        try {
            const collectionRef3 = collection(db, collectionName);
            let q = query(collectionRef3, limit(limitCount));
            if (startDoc) {
                q = query(q, startAfter(startDoc));
            }
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

            return { data, lastVisibleDoc };
        } catch (error) {
            console.error("Error fetching limited data:", error);
        }
    };

    // Function to fetch more blogs
    const fetchMoreBlogs = async () => {
        setBlogLoading(true);

        const { data, lastVisibleDoc } = await fetchLimitData("blogs", 3, memoizedLastVisible);

        setLimitBlogs(prevBlogs => [...prevBlogs, ...data]);

        const blogNumber = data.length + limitBlogs.length;

        setBlogsLoaded(blogNumber);

        if (blogNumber >= totalBlogs) {
            setHasMore(false)
        } else {
            setHasMore(true)
        }

        setLastVisible(lastVisibleDoc);

        setBlogLoading(false);
    };

    // Function to fetch user data
    const fetchUser = async (id) => {
        try {
            const userRef = doc(db, "users", id);
            const userData = await getDoc(userRef);
            setUser(userData.data());
        } catch {
            console.log("error");
        }
    };

    // Function to fetch a specific blog data
    const fetchoneBlog = async (id) => {
        try {
            const blogRef = doc(db, "blogs", id);
            const blogSnapshot = await getDoc(blogRef);
            if (blogSnapshot.exists()) {
                const blogData = blogSnapshot.data();
                setLimitBlogs(prevBlogs => {
                    const updatedBlogs = prevBlogs.map(blog =>
                        blog.id === id ? { ...blog, ...blogData } : blog
                    );
                    return updatedBlogs;
                });
            } else {
                console.log("No such blog found!");
            }
        } catch (error) {
            console.error("Error fetching the blog:", error);
        }
    };

    // Function to handle liking a blog
    const like = async (id) => {
        setLoading(true);
        const likedBlogs = user.likedBlogs;
        const blog = memoizedBlogs.find((b) => b.id === id);

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
        fetchoneBlog(id);
        fetchUser(currentUser.uid);
        setLoading(false);
    };

    // Function to handle adding a comment
    const comments = async (id, e) => {
        e.preventDefault();
        setLoading(true);
        const blog = memoizedBlogs.find((b) => b.id === id);
        const prevComments = blog.comments || [];
        const newComment = {
            "name": user.name,
            "content": commentState[id],
            "picture": user.profile,
        }

        if (!newComment.content.trim()) {
            setLoading(false);
            return;
        }

        try {
            await updateDoc(doc(collectionRef, id), {
                comments: [...prevComments, newComment],
            });
        } catch (error) {
            console.log("Error updating comments:", error);
        }

        setLoading(false);
        fetchUser(currentUser.uid);
        fetchoneBlog(id);
        setCommentState(prevState => ({ ...prevState, [id]: "" }));
    };

    useEffect(() => {
        // Fetch user data and blogs count on initial load
        fetchUser(currentUser.uid);
        fetchTotalBlogsCount().then(count => setTotalBlogs(count));

        const fetchData = async () => {
            const { data, lastVisibleDoc } = await fetchLimitData("blogs", 3);
            setLimitBlogs(data);
            setLastVisible(lastVisibleDoc);
            setHasMore(true)
        };
        fetchData();
    }, [currentUser.uid]);

    useEffect(() => {
        if (user) {
            setLiked(user.likedBlogs || []);
        }

    }, [user, blogsLoaded, totalBlogs]);

    const handleSearch = (e) => {
        e.preventDefault(); // Fix typo
        const query = searchRef.current.value.trim(); // Trim whitespace
        if (query) {
            nav(`/blogs/${query}`); // Ensure the route is correct
        } else {
            console.log("Search query is empty"); // Provide feedback if empty
        }
    };


    return (
        <div className="md:flex-1 md:flex-col md:h-screen md:overflow-auto">
            <div className="flex justify-center items-center my-8">
                <form onSubmit={handleSearch} className="relative w-full max-w-lg">
                    <input
                        ref={searchRef}
                        type="text"
                        placeholder="Explore inspiring blogs..."
                        className="w-full px-4 py-2 text-lg rounded-full border-2 border-transparent shadow-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    />
                    <button
                        type="submit"
                        className="absolute right-0 top-0 bottom-0 px-4 py-2 bg-gradient-to-r from-secondary to-green-500 text-white font-bold rounded-full hover:shadow-lg hover:from-green-500 hover:to-secondary transition-all duration-300"
                    >
                        🔍
                    </button>
                </form>
            </div>
            {memoizedBlogs.length === 0 ? (
                <h1 className="text-lg md:text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-secondary to-green-500 animate-pulse">
                    No blogs found, but don`t stop exploring!
                </h1>
            ) : (
                <h1 className="text-lg mt-8 md:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-secondary to-green-500">
                    Discover the Latest Stories ✨
                </h1>
            )}
            <div className="flex flex-col gap-12 md:px-8 py-12 md:p-12 md:mx-12">
                {memoizedBlogs.map((blog) => (
                    <div key={blog.id} className="  border-2 border-gray-600 bg-gray-800 shadow-2xl md:rounded-lg">
                        <div className="flex justify-between items-center px-6 bg-gray-600">
                            <div className="flex flex-row items-center gap-2  p-2 ">
                                {blog.createdBy?.name ? <Link to={`/profile/${blog.createdBy?.userId}`} className="text-gray-100 text-sm md:text-base font-semibold flex  align-middle justify-center items-center gap-3 hover:underline transition-all duration-150 ease-in ">
                                    <img
                                        src={blog.createdBy?.photo || anonymous}
                                        alt="photo"
                                        className="w-10 h-10 rounded-full border-2 border-gray-300"
                                    />
                                    <p>{blog.createdBy?.name || 'Unknown User'}</p></Link> : <div className="text-gray-100 text-sm md:text-base font-semibold flex  align-middle justify-center items-center gap-3">
                                    <img
                                        src={blog.createdBy?.photo || anonymous}
                                        alt="photo"
                                        className="w-10 h-10 rounded-full border-2 border-gray-300"
                                    />
                                    <p>{blog.createdBy?.name || 'Unknown User'}</p></div>}
                            </div>
                            <p className="text-gray-200 text-sm md:text-base font-semibold">{blog.createdAt}</p>
                        </div>
                        <div className="relative  p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-8 md:gap-16">
                            <div className="flex-1 flex md:gap-2  flex-col w-full ">
                                <h1 className="text-lg md:text-2xl font-bold text-white mb-4">{blog.title}</h1>
                                <img
                                    src={blog.imageUrl}
                                    alt="Blog visual"
                                    className="rounded-md w-full h-64 object-cover"
                                />
                                <p className="text-sm md:text-base text-white font-medium mt-4 break-words">
                                    {blog.bigDescription.substring(0, 250)}...
                                </p>
                                <div className="pt-4 my-3">
                                    {blog.tags && blog.tags.map((b, index) => (
                                        <div key={index} className="inline-block m-2 p-[2px] rounded-lg bg-gradient-to-r from-secondary to-green-500">
                                            <span className="block px-3  py-1 text-white font-semibold rounded-lg bg-gray-800">{b}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    className="mt-4 font-semibold text-base md:text-lg text-secondary hover:underline"
                                    to={`/blog/${blog.id}`}
                                >
                                    Read More
                                </Link>
                            </div>
                            <div className="flex flex-col justify-center gap-4 md:w-1/3 md:mb-20 ">
                                <div className="flex items-center justify-between text-white">
                                    <p>{blog.likes} Likes</p>
                                    <button
                                        onClick={() => like(blog.id)}
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
                                <div className="bg-gray-800 p-4 rounded-md shadow-inner max-h-40 overflow-y-auto mb-4">
                                    {blog.comments && blog.comments.length > 0 ? (
                                        blog.comments.map((comment, index) => (
                                            <div key={index} className="flex items-start gap-4 p-3 bg-gray-700 rounded-lg mb-3 shadow-sm">
                                                <img
                                                    src={comment.picture || anonymous}
                                                    alt="profile"
                                                    className="w-10 h-10 rounded-full border-2 border-blue-500"
                                                />
                                                <div>
                                                    <p className="text-sm text-gray-300 font-semibold">{comment.name}</p>
                                                    <p className="text-sm text-gray-400 mt-1">{comment.content}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 italic text-center">
                                            No comments yet. Be the first to comment!
                                        </p>
                                    )}

                                </div>
                                <form className="flex items-center gap-4" onSubmit={(e) => comments(blog.id, e)}>
                                    <textarea
                                        className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        rows="1"
                                        placeholder="Write your comment..."
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
                        </div>
                    </div>
                ))}
                {blogLoading ? (
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full mx-auto animate-spin"
                        />
                    </div>
                ) : hasMore ? (
                    <div className="text-center">
                        <button
                            onClick={fetchMoreBlogs}
                            className="text-white bg-blue-500 px-4 py-2 rounded-md mt-8 hover:bg-blue-600 focus:outline-none transition-colors duration-300"
                        >
                            Load More Blogs
                        </button>
                    </div>
                ) : (
                    <p className="text-white text-center mt-8">No more blogs to load</p>
                )}
            </div>
        </div >
    );
};

export default AllBlogs;
