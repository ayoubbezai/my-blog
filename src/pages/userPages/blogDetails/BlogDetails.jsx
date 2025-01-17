import { useParams, Link } from 'react-router-dom';
import { useAuth } from "../../../context/AuthContext";
import { useEffect } from "react";

function BlogDetails() {
    const { getAllBlog, blogs } = useAuth();

    useEffect(() => {
        getAllBlog();
    }, []);

    const { id } = useParams();
    const blog = blogs.find((b) => b.id.toString() === id);

    if (!blog) {
        setTimeout(() => {
            return <h2 className="text-center text-red-500 text-xl">Not found</h2>;
        }, 4000);
        return <h2 className="text-center text-blue-500 text-xl">Loading ...</h2>;
    }

    return (
        <div className="flex  justify-center items-center min-h-screen bg-gradient-to-r from-primary to-secondary  p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full text-center">
                <img src={blog.imageUrl} alt="Blog" className="w-full rounded-md mt-2 mb-6" />
                <h1 className="text-2xl font-bold text-gray-800 mb-6">{blog.title}</h1>
                <p className="text-gray-600 text-lg mb-6">{blog.bigDescription}</p>
                <Link className=" bg-secondary text-white px-6 py-2 rounded-md text-lg font-semibold mt-8 transition-all md:hover:scale-105 "
                    to={`/blogs`}>Back To Blogs</Link>
            </div>
        </div>
    );
}

export default BlogDetails;
