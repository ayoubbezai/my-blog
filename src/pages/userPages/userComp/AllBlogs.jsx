import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { fetchTotalBlogsCount, fetchLimitData, fetchMoreBlogs } from "../../../utils/helpers";
import OneBlog from "./OneBlog";
import LikeAndComments from "./LikeAndComments";
import BlogHeader from "./BlogHeader";
import Search from "./Search";
import { createPortal } from 'react-dom';
import AddBlog from "../../adminPages/adminComp/AddBlog";

const Button = ({ onClick, children, className = "" }) => (
    <button
        className={`text-white font-semibold rounded-lg shadow-lg p-2 px-5 bg-gradient-to-r from-secondary to-green-500 hover:opacity-90 transition ${className}`}
        onClick={onClick}
    >
        {children}
    </button>
);

const AllBlogs = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const modalRef = useRef(null);

    const [searchValue, setSearchValue] = useState("");
    const [blogLoading, setBlogLoading] = useState(false);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [lastVisible, setLastVisible] = useState(null);
    const [limitBlogs, setLimitBlogs] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFetchMoreBlogs = async () => {
        setBlogLoading(true);
        try {
            await fetchMoreBlogs(lastVisible, totalBlogs, limitBlogs, setLimitBlogs, setLastVisible, setHasMore);
        } catch (error) {
            setErrorMessage("Failed to load more blogs. Please try again.", error);
        } finally {
            setBlogLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            navigate(`/blogs/${searchValue}`);
        } else {
            setErrorMessage("Search query cannot be empty.");
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
                setHasMore(data.length > 0);
            } catch (error) {
                setErrorMessage("Error fetching initial blog data.", error);
            }
        };
        fetchInitialData();
    }, [currentUser?.uid]);

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
        <div className={`md:flex-1  relative  md:h-screen md:overflow-auto ${isOpen ? 'overflow-hidden' : ''}`}>

            <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-center w-2/3 mx-auto ">
                <Search handleSearch={handleSearch} searchValue={searchValue} setSearchValue={setSearchValue} />
                <Button onClick={() => setIsOpen(true)} className="lg:mr-8 w-1/2 lg:w-32 mx-auto">Add Blog</Button>
            </div>

            {errorMessage && (
                <div className="text-center text-red-500 mt-2">{errorMessage}</div>
            )}

            {isOpen && createPortal(
                <div className="fixed inset-0 flex   justify-center bg-black bg-opacity-50 z-50">
                    <div ref={modalRef} className="bg-white overflow-auto w-[90%] my-2 md:w-2/3 p-6 pb-0 rounded-lg shadow-lg relative">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Add a New Blog</h2>
                            <Button onClick={() => setIsOpen(false)} className="text-xl">X</Button>
                        </div>
                        <AddBlog />
                    </div>
                </div>,
                document.body
            )}

            {limitBlogs.length === 0 ? (
                <h1 className="text-lg md:text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-secondary to-green-500 animate-pulse">
                    No blogs found, but don’t stop exploring!
                </h1>
            ) : (
                <h1 className="text-lg mt-8 md:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-secondary to-green-500">
                    Discover the Latest Stories ✨
                </h1>
            )}

            <div className="flex flex-col gap-12 md:px-8 py-12 md:p-12 md:mx-12">
                {limitBlogs.map((blog) => (
                    <div key={blog.id} className="border-2 border-gray-600 bg-gray-800 shadow-2xl md:rounded-lg w-full lg:w-4/5 mx-auto">
                        <BlogHeader blog={blog} />
                        <div className="relative p-6 rounded-lg gap-6 shadow-lg flex flex-col lg:flex-row">
                            <div className="flex flex-col  lg:w-2/3">
                                <OneBlog blog={blog} />
                            </div>
                            <LikeAndComments blog={blog} setLimitBlogs={setLimitBlogs} limitBlogs={limitBlogs} />
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
                        <Button onClick={handleFetchMoreBlogs} className="mt-8 px-4 py-2 bg-blue-500 hover:bg-blue-600">
                            Load More Blogs
                        </Button>
                    </div>
                ) : (
                    <p className="text-white text-center mt-8">No more blogs to load</p>
                )}
            </div>
        </div>
    );
};

export default AllBlogs;
