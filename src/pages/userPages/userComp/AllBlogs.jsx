import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { fetchTotalBlogsCount, fetchLimitData, fetchMoreBlogs } from "../../../utils/helpers";
import OneBlog from "./OneBlog";
import LikeAndComments from "./LikeAndComments";
import BlogHeader from "./BlogHeader";
import Search from "./Search";
import { createPortal } from 'react-dom';
import AddBlog from "../../adminPages/adminComp/AddBlog"

const AllBlogs = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [searchValue, setSearchValue] = useState("");
    const [blogLoading, setBlogLoading] = useState(false);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [lastVisible, setLastVisible] = useState(null);
    const [limitBlogs, setLimitBlogs] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const memoizedBlogs = useMemo(() => limitBlogs, [limitBlogs]);

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

    const handleSearch = (e) => {
        e.preventDefault();
        const query = searchValue.trim();
        if (query) {
            navigate(`/blogs/${query}`);
        } else {
            console.log("Search query is empty");
        }
    };

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
    }, [currentUser?.uid]);

    return (
        <div className={`md:flex-1 relative md:flex-col md:h-screen md:overflow-auto ${isOpen ? 'overflow-hidden' : ''}`}>

            <div className="flex justify-evenly items-center">
                <Search handleSearch={handleSearch} searchValue={searchValue} setSearchValue={setSearchValue} />

                <button
                    className="text-white font-semibold rounded-lg shadow-lg p-2 mr-8 bg-gradient-to-r from-secondary to-green-500"
                    onClick={() => setIsOpen(true)}
                >
                    Add Blog
                </button>
            </div>


            {isOpen && createPortal(
                <div className="fixed inset-0 flex my-4 h-full   justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white w-2/3  p-6 pb-0 overflow-auto rounded-lg shadow-lg relative">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Add a New Blog</h2>
                            <button
                                className=" "
                                onClick={() => setIsOpen(false)}
                            >
                                ✖
                            </button>
                        </div>
                        <AddBlog />
                    </div>
                </div>,
                document.body
            )}

            {memoizedBlogs.length === 0 ? (
                <h1 className="text-lg md:text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-secondary to-green-500 animate-pulse">
                    No blogs found, but don’t stop exploring!
                </h1>
            ) : (
                <h1 className="text-lg mt-8 md:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-secondary to-green-500">
                    Discover the Latest Stories ✨
                </h1>
            )}

            <div className="flex flex-col gap-12 md:px-8 py-12 md:p-12 md:mx-12">
                {memoizedBlogs.map((blog) => (
                    <div key={blog.id} className="border-2 border-gray-600 bg-gray-800 shadow-2xl md:rounded-lg w-full lg:w-4/5 mx-auto">
                        <BlogHeader blog={blog} />
                        <div className="relative p-6 rounded-lg shadow-lg flex flex-col lg:flex-row">
                            <div className="flex flex-col lg:w-2/3">
                                <OneBlog blog={blog} />
                            </div>
                            <LikeAndComments blog={blog} setLimitBlogs={setLimitBlogs} memoizedBlogs={memoizedBlogs} />
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
                            onClick={handleFetchMoreBlogs}
                            className="text-white bg-blue-500 px-4 py-2 rounded-md mt-8 hover:bg-blue-600 focus:outline-none transition-colors duration-300"
                        >
                            Load More Blogs
                        </button>
                    </div>
                ) : (
                    <p className="text-white text-center mt-8">No more blogs to load</p>
                )}
            </div>
        </div>
    );
};

export default AllBlogs;
