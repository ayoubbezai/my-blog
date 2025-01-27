import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../userComp/NavBar";
import OneBlog from "../userComp/OneBlog";
import BlogHeader from "../userComp/BlogHeader";
import Search from "../userComp/Search";

const SearchBlog = () => {
    const { query: initialQuery } = useParams();
    const { blogs, getAllBlog } = useAuth();
    const [filtredBlogs, setFiltredBlogs] = useState([]);
    const [searchValue, setSearchValue] = useState(""); 

    const navigate = useNavigate();

    useEffect(() => {
        getAllBlog(); // Fetch all blogs initially
    }, [getAllBlog]);

    useEffect(() => {
        // Update filtered blogs when the query or blogs change
        if (initialQuery) {
            setFiltredBlogs(filterBlogs(blogs, searchValue));
        }
    }, [initialQuery, blogs]);

    const filterBlogs = (blogs, query) => {
        const lowerCaseQuery = query.trim().toLowerCase();
        return blogs.filter(blog => {
            const matchesTitle = blog.title?.toLowerCase().includes(lowerCaseQuery);
            const matchesTags = blog.tags?.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
            return matchesTitle || matchesTags;
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/blogs/${searchValue}`); 
        setFiltredBlogs(filterBlogs(blogs, searchValue)); 
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-primary">
            <NavBar />
            <div className="flex-1 md:px-16 bg-primary shadow-lg md:h-screen md:overflow-y-auto">
                {/* Search Bar */}
                <Search
                    handleSearch={handleSearch}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                />

                {/* Search Results */}
                <h1 className="text-lg md:text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-secondary to-green-500 animate-pulse mb-6">
                    Search Results for "{searchValue}"
                </h1>
                {filtredBlogs.length > 0 ? (
                    filtredBlogs.map((blog) => (
                        <div key={blog.id} className="border-2 border-gray-600 bg-gray-800 shadow-2xl md:rounded-lg mb-8">
                            <BlogHeader blog={blog} />
                            <div className="relative p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-8 md:gap-16">
                                <OneBlog blog={blog} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-white text-center">No blogs found matching "{searchValue}"</p>
                )}
            </div>
        </div>
    );
};

export default SearchBlog;
