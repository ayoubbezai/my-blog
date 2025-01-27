import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { fetchTotalBlogsCount, fetchLimitData, fetchMoreBlogs } from "../../../utils/helpers";
import OneBlog from "./OneBlog";
import LikeAndComments from "./LikeAndComments";
import BlogHeader from "./BlogHeader";
import Search from "./Search";

const AllBlogs = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const searchRef = useRef(null); // Fixed: Added `searchRef` declaration

    const [searchValue, setSearchValue] = useState("");
    const [blogLoading, setBlogLoading] = useState(false);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [lastVisible, setLastVisible] = useState(null);
    const [limitBlogs, setLimitBlogs] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const memoizedBlogs = useMemo(() => limitBlogs, [limitBlogs]);

    // Fetch more blogs when "Load More" is clicked
    const handleFetchMoreBlogs = async () => {
        setBlogLoading(true);
        try {
            await fetchMoreBlogs(
                lastVisible,
                totalBlogs,
                limitBlogs,
                setLimitBlogs,
                setLastVisible,
                setHasMore
            );
        } catch (error) {
            console.error("Error fetching more blogs:", error);
        } finally {
            setBlogLoading(false);
        }
    };

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        const query = searchValue.trim();
        if (query) {
            navigate(`/blogs/${query}`);
        } else {
            console.log("Search query is empty");
        }
    };

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const count = await fetchTotalBlogsCount();
                setTotalBlogs(count);

                const { data, lastVisibleDoc } = await fetchLimitData(3);
                setLimitBlogs(data);
                setLastVisible(lastVisibleDoc);
                setHasMore(true);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        fetchInitialData();
    }, [currentUser?.uid]); // Ensure `currentUser.uid` is included as a dependency

    return (
        <div className="md:flex-1 md:flex-col md:h-screen md:overflow-auto">
            {/* Search Bar */}
            {/* Search Bar */}
            <Search
                handleSearch={handleSearch}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />
            {/* Heading */}
            {memoizedBlogs.length === 0 ? (
                <h1 className="text-lg md:text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-secondary to-green-500 animate-pulse">
                    No blogs found, but don’t stop exploring!
                </h1>
            ) : (
                <h1 className="text-lg mt-8 md:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-secondary to-green-500">
                    Discover the Latest Stories ✨
                </h1>
            )}

            {/* Blog List */}
            <div className="flex flex-col gap-12 md:px-8 py-12 md:p-12 md:mx-12">
                {memoizedBlogs.map((blog) => (
                    <div key={blog.id} className="border-2 border-gray-600 bg-gray-800 shadow-2xl md:rounded-lg">
                        <BlogHeader blog={blog} />
                        <div className="relative p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-8 md:gap-16">
                            {/* Right Side */}
                            <OneBlog blog={blog} />
                            {/* Left Side */}
                            <LikeAndComments
                                blog={blog}
                                setLimitBlogs={setLimitBlogs}
                                memoizedBlogs={memoizedBlogs}
                            />
                        </div>
                    </div>
                ))}

                {/* Loading Spinner */}
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
                    /* Load More Button */
                    <div className="text-center">
                        <button
                            onClick={handleFetchMoreBlogs}
                            className="text-white bg-blue-500 px-4 py-2 rounded-md mt-8 hover:bg-blue-600 focus:outline-none transition-colors duration-300"
                        >
                            Load More Blogs
                        </button>
                    </div>
                ) : (
                    /* No More Blogs Message */
                    <p className="text-white text-center mt-8">No more blogs to load</p>
                )}
            </div>
        </div>
    );
};

export default AllBlogs;
