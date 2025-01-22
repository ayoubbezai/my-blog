import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, getDocs, query, limit } from "firebase/firestore";

const db = getFirestore();

const RecentBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch limited blog data from Firestore
    const fetchLimitedData = async (collectionName, limitCount) => {
        try {
            const collectionRef = collection(db, collectionName);
            const q = query(collectionRef, limit(limitCount));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            return data;
        } catch (error) {
            console.error("Error fetching blogs:", error.message);
            return [];
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await fetchLimitedData("blogs", 4);
            setBlogs(data);
            setLoading(false);
        };

        fetchData();
    }, []);

    // Helper function to truncate text
    const truncateText = (text, length) => {
        return text.length > length ? `${text.substring(0, length)}...` : text;
    };

    return (
        <div>
            {/* Title */}
            {blogs.length === 0 ? (
                <h1 className="text-xl font-semibold text-center mt-6 text-white">
                    No blogs found
                </h1>
            ) : (
                <h1 className="text-2xl md:text-3xl font-bold text-center text-white mt-6">
                    Recent Blogs
                </h1>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center text-white mt-4">
                    Loading...
                </div>
            )}

            {/* Blog List */}
            {!loading && (
                <div className="py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6">
                        {blogs.length > 1 ? (
                            <>
                                {/* Featured Blog */}
                                <div className="col-span-1 row-span-2 p-4 flex flex-col gap-3 shadow-lg bg-primary rounded-lg">
                                    <h2 className="text-lg sm:text-base md:text-2xl mb-2 font-bold leading-snug text-white">
                                        {blogs[0]?.title}
                                    </h2>
                                    <div className="flex flex-col gap-4">
                                        <img
                                            src={blogs[0]?.imageUrl}
                                            alt={blogs[0]?.title}
                                            className="h-56 md:h-64 object-cover rounded-lg"
                                        />
                                        <p className="text-sm sm:text-base md:text-base leading-loose text-white mt-3">
                                            {truncateText(blogs[0]?.bigDescription, 200)}
                                        </p>
                                        <Link
                                            to={`/blog/${blogs[0]?.id}`}
                                            className="text-secondary text-base md:text-lg font-bold hover:underline mt-4"
                                        >
                                            Read more
                                        </Link>
                                    </div>
                                </div>

                                {/* Other Blogs */}
                                {blogs.slice(1, 3).map((blog) => (
                                    <div
                                        key={blog.id}
                                        className="col-span-1 row-span-1 p-4 flex flex-col lg:flex-row gap-6 shadow-lg bg-primary rounded-lg"
                                    >
                                        <img
                                            src={blog.imageUrl}
                                            alt={blog.title}
                                            className="w-full lg:w-2/5 h-32 md:h-40 object-cover rounded-lg"
                                        />
                                        <div className="flex flex-col gap-3 lg:w-3/5">
                                            <h2 className="text-sm sm:text-base md:text-xl font-bold leading-snug text-white">
                                                {blog.title}
                                            </h2>
                                            <p className="text-xs sm:text-base md:text-sm leading-loose text-white mt-2">
                                                {truncateText(blog.bigDescription, 150)}
                                            </p>
                                            <Link
                                                to={`/blog/${blog.id}`}
                                                className="text-secondary text-base md:text-lg font-semibold hover:underline mt-2"
                                            >
                                                Read more
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <h2 className="col-span-2 text-center text-gray-400">
                                Not enough blogs to display.
                            </h2>
                        )}
                    </div>

                    {/* Additional Blog Row */}
                    {blogs.length > 3 && (
                        <div className="grid grid-cols-1 gap-6 p-6">
                            <div className="col-span-1 p-4 flex flex-col lg:flex-row gap-20 shadow-lg bg-primary rounded-lg w-full">
                                <img
                                    src={blogs[3]?.imageUrl}
                                    alt={blogs[3]?.title}
                                    className="w-full lg:w-1/3 h-40 md:h-48 object-cover rounded-lg"
                                />
                                <div className="flex flex-col gap-3 lg:w-2/3">
                                    <h2 className="text-sm sm:text-base md:text-xl font-bold leading-snug text-white">
                                        {blogs[3]?.title}
                                    </h2>
                                    <p className="text-sm sm:text-base md:text-base leading-loose w-[90%] text-white mt-3">
                                        {truncateText(blogs[3]?.bigDescription, 300)}
                                    </p>
                                    <Link
                                        to={`/blog/${blogs[3]?.id}`}
                                        className="text-secondary text-base md:text-lg font-bold hover:underline mt-2"
                                    >
                                        Read more
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* View All Blogs Button */}
            <div className="flex justify-center pb-8">
                <Link to="/blogs">
                    <button className="bg-primary text-white px-6 py-3 rounded-md text-lg font-bold transition-transform duration-300 hover:scale-105">
                        View All Blogs
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default RecentBlogs;
