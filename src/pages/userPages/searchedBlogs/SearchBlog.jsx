import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import NavBar from "../userComp/NavBar";
import anonymous from "../../../assets/anonymous.png";

const SearchBlog = () => {
    const { query: initialQuery } = useParams();
    const { blogs, getAllBlog } = useAuth();
    const [filtredBlogs, setFiltredBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState(initialQuery || "");
    const navigate = useNavigate();

    const getFiltredBlogs = () => {
        if (!searchQuery) return;
        const lowerCaseQuery = searchQuery.toLowerCase();

        const filtredBlogs = blogs.filter((blog) => {
            const matchesTitle = blog.title?.toLowerCase().includes(lowerCaseQuery);
            const matchesTags = blog.tags?.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
            return matchesTitle || matchesTags;
        });

        setFiltredBlogs(filtredBlogs);
    };

    useEffect(() => {
        getAllBlog(); // Fetch all blogs initially
    }, []);

    useEffect(() => {
        getFiltredBlogs(); // Filter blogs whenever the blogs or query changes
    }, [blogs, searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/blogs/${searchQuery}`); // Update the route to include the new search query
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-primary">
            <NavBar />
            <div className="flex-1 md:px-16 bg-primary shadow-lg md:h-screen md:overflow-y-auto">
                {/* Search Bar */}
                <div className="flex justify-center items-center my-8">
                    <form onSubmit={handleSearch} className="relative w-full max-w-lg">
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} type="text"
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

                {/* Search Results */}
                <h1 className="text-lg md:text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-secondary to-green-500 animate-pulse mb-6">
                    Search Results for "{searchQuery}"
                </h1>
                {filtredBlogs.length > 0 ? (
                    filtredBlogs.map((blog) => (
                        <div key={blog.id} className="border-2 border-gray-600 bg-gray-800 shadow-2xl md:rounded-lg mb-8">
                            <div className="flex justify-between items-center px-6 bg-gray-600">
                                <div className="flex flex-row items-center gap-2 p-2">
                                    <img
                                        src={blog.createdBy?.photo || anonymous}
                                        alt="User profile"
                                        className="w-10 h-10 rounded-full border-2 border-gray-300"
                                    />
                                    <p className="text-gray-100 text-sm md:text-base font-semibold">{blog.createdBy?.name || "Unknown User"}</p>
                                </div>
                                <p className="text-gray-200 text-sm md:text-base font-semibold">{blog.createdAt}</p>
                            </div>
                            <div className="relative p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-8 md:gap-16">
                                <div className="flex-1 flex md:gap-2 flex-col">
                                    <h2 className="text-lg md:text-2xl font-bold text-white mb-4">{blog.title}</h2>
                                    <img src={blog.imageUrl} alt="main" className="rounded-md w-full h-64 object-cover"
                                    />
                                    <p className="text-sm md:text-base text-white font-medium mt-4">
                                        {blog.bigDescription?.substring(0, 250)}...
                                    </p>
                                    <div className="pt-4 my-3">
                                        {blog.tags && blog.tags.map((tag, index) => (
                                            <div key={index} className="inline-block m-2 p-[2px] rounded-lg bg-gradient-to-r from-pink-500 to-purple-500">
                                                <span className="block px-3 py-1 text-white font-semibold rounded-lg bg-gray-800">{tag}</span>
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
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-white text-center">No blogs found matching "{searchQuery}"</p>
                )}
            </div>
        </div>
    );
};

export default SearchBlog;
