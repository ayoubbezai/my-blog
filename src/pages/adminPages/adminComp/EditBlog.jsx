import { doc, getFirestore, deleteDoc, query, collection, startAfter, orderBy, limit, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from 'react-hot-toast';
import { createPortal } from 'react-dom';
import AddBlog from "../../adminPages/adminComp/AddBlog";
import { Link } from 'react-router-dom';

const Button = ({ onClick, children, className = "" }) => (
    <button
        className={`text-white font-semibold rounded-lg shadow-lg p-2 px-5 hover:opacity-90 transition ${className}`}
        onClick={onClick}
    >
        {children}
    </button>
);

const EditBlog = () => {
    const db = getFirestore();
    const { blogs } = useAuth();
    const modalRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [displayedBlogs, setDisplayedBlogs] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);

    const pageSize = 6; // Set number of blogs per page

    const fetchBlogs = async () => {
        setLoading(true);
        const blogQuery = query(
            collection(db, "blogs"),
            orderBy("title"),
            limit(pageSize)
        );
        const snapshot = await getDocs(blogQuery);

        if (!snapshot.empty) {
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // Set the last visible document for pagination
            setDisplayedBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }

        setLoading(false);
    };

    const fetchMoreBlogs = async () => {
        if (!lastVisible) return;
        setLoading(true);

        const blogQuery = query(
            collection(db, "blogs"),
            orderBy("title"),
            startAfter(lastVisible),
            limit(pageSize)
        );
        const snapshot = await getDocs(blogQuery);

        if (!snapshot.empty) {
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // Update last visible document for pagination
            setDisplayedBlogs(prev => [
                ...prev,
                ...snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            ]);
        } else {
            setLastVisible(null);
        }

        setLoading(false);
    };

    const remove = async (id) => {
        const dataRef = doc(db, "blogs", id);
        await deleteDoc(dataRef);
        fetchBlogs(); // Refresh the blog list after deletion
        toast.success("Blog deleted successfully");
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

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
        <>
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-center w-2/3 mx-auto">
                <Button onClick={() => setIsOpen(true)} className=" w-1/2 lg:w-32 mx-auto bg-gradient-to-r from-secondary to-green-500 ">Add Blog</Button>
            </div>
            {isOpen && createPortal(
                <div className="fixed inset-0 flex justify-center bg-black bg-opacity-50 z-50">
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

            {blogs.length === 0 ? (
                <h1 className="text-2xl font-bold self-center">No blogs found</h1>
            ) : (
                <h1 className="text-2xl my-4 md:text-4xl font-bold text-center text-secondary">Remove Blogs</h1>
            )}

            <div className="overflow-x-auto max-h-96  relative shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-800 max-h-96 o dark:bg-gray-800 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Author</th>
                            <th className="px-6 py-3">Image</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Tags</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedBlogs.map(blog => (
                            <tr key={blog.id} className="bg-gray-800 border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4 text-white">{blog.title}</td>
                                <td className="px-6 py-4 text-white">{blog.createdBy?.name || "Unknown Author"}</td>
                                <td className="px-6 py-4">
                                    <img src={blog.imageUrl} alt="Blog visual" className="h-20 w-20 object-cover rounded-md" />
                                </td>
                                <td className="px-6 py-4 text-white">{blog.bigDescription.substring(0, 100)}...</td>
                                <td className="px-6 py-4">
                                    {blog.tags && blog.tags.map((tag, index) => (
                                        <span key={index} className="inline-block m-1 px-2 py-1 text-xs bg-gradient-to-r from-secondary to-green-500 text-white rounded-md">{tag}</span>
                                    ))}
                                </td>
                                <td className="px-6 py-4">
                                    <Link to={`/blog/${blog.id}`} className="text-white font-semibold rounded-lg shadow-lg p-2 px-6 hover:opacity-90 transition bg-secondary my-2">More</Link>
                                    <Button onClick={() => remove(blog.id)} className="bg-red-500 mt-2">Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Load More Button */}
            {lastVisible && (
                <div className="flex justify-center mt-8">
                    <Button onClick={fetchMoreBlogs} className="mb-16 bg-gradient-to-r from-secondary to-green-500">
                        {loading ? "Loading..." : "Load More"}
                    </Button>
                </div>
            )}
            <Toaster />
        </>
    );
};

export default EditBlog;
