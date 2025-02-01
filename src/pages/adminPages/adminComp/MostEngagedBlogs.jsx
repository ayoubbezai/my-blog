import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore";

const db = getFirestore();

const MostEngagedBlogs = () => {
    const [engagedBlogs, setEngagedBlogs] = useState([]);

    // Fetch the most engaged blogs (by likes and comments)
    const getMostEngagedBlogs = async () => {
        try {
            const blogsRef = collection(db, "blogs"); // "blogs" collection
            const q = query(blogsRef, orderBy("likes", "desc"), limit(3));
            const querySnapshot = await getDocs(q);
            const blogs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEngagedBlogs(blogs); // Save the fetched blogs to state
        } catch (error) {
            console.error("Error fetching most engaged blogs: ", error);
        }
    };

    useEffect(() => {
        getMostEngagedBlogs();
    }, []);

    return (
        <div className="mx-auto p-4 bg-gray-800 rounded-lg shadow-lg   w-[90%] md:w-full  lg:w-[40%]">
            <h2 className="text-xl font-semibold text-center text-white mb-4">Most Engaged Blogs</h2>
            {engagedBlogs.length === 0 ? (
                <p className="text-center text-sm text-gray-400">No blogs available.</p>
            ) : (
                <ul className="space-y-3">
                    {engagedBlogs.map(blog => (
                        <li key={blog.id} className="bg-gray-700 py-3 px-4 rounded-lg shadow-sm hover:bg-gray-600 transition-all">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-medium text-indigo-400">
                                    <span className="text-white">By: </span>{blog?.createdBy?.name || "unknown"}
                                </h3>
                                <h4 className="text-base font-semibold text-gray-100">{blog.title}</h4>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                                <p><strong>Likes:</strong> {blog.likes || 0}</p>
                                <p><strong>Comments:</strong> {blog?.comments?.length || 0}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-2"><strong>Published on:</strong> {blog?.createdAt || "unknown"}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MostEngagedBlogs;
