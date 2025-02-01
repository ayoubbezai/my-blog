import { doc, getFirestore, deleteDoc, query, collection, startAfter, orderBy, limit, getDocs, getDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from 'react-hot-toast';
import { createPortal } from 'react-dom';
import AddBlog from "../../adminPages/adminComp/AddBlog";
import AllComments from "../../userPages/userComp/AllComments";
import { Link } from "react-router-dom";
import AdminComments from "../adminComp/AdminComments";

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
    const modalRefComments = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenComments, setIsOpenComments] = useState(false);
    const [displayedBlogs, setDisplayedBlogs] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [chosenBlog, setChosenBlog] = useState({});

    const pageSize = 6; // Set number of blogs per page

    // Function to fetch a specific blog by its ID
    const fetchBlog = async (id) => {
        const blogRef = doc(db, "blogs", id);
        const blogSnapshot = await getDoc(blogRef);
        if (blogSnapshot.exists()) {
            setChosenBlog({ id: blogSnapshot.id, ...blogSnapshot.data() });
        } else {
            toast.error("Blog not found!");
        }
    };

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

    const handleOpenComments = (blog) => {
        setIsOpenComments(true);
        setChosenBlog(blog);
        fetchBlog(blog.id); // Fetch the latest blog data
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

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRefComments.current && !modalRefComments.current.contains(event.target)) {
                setIsOpenComments(false); // Fix: Close the comments modal, not the blog modal
            }
        };

        if (isOpenComments) {
            document.addEventListener("mousedown", handleOutsideClick);
        }
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpenComments]);

    return (
        <>
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-center my-12 md:my-0 w-2/3 mx-auto">
                <Button onClick={() => setIsOpen(true)} className=" w-1/2 lg:w-32 mx-auto bg-gradient-to-r from-secondary to-green-500 ">Add Blog</Button>
            </div>
            {isOpen && createPortal(
                <div className="fixed inset-0 flex justify-center bg-black bg-opacity-50 z-50">
                    <div ref={modalRef} className="bg-white overflow-auto w-[90%] my-2 md:w-2/3 p-6 pb-0 rounded-lg shadow-lg relative">
                        <div className="flex justify-between  items-center">
                            <h2 className="text-xl font-bold">Add a New Blog</h2>
                            <Button onClick={() => setIsOpen(false)} className="text-xl">X</Button>
                        </div>
                        <AddBlog />
                    </div>
                </div>,
                document.body
            )}

            {blogs.length === 0 ?
                <h1 className="text-2xl font-bold self-center">No blogs found</h1> :
                <h1 className="text-2xl mt-4 md:text-4xl font-bold text-center text-secondary">Remove Blogs</h1>
            }

            <div className="flex flex-col p-12 relative">
                {displayedBlogs.map(blog => (
                    <div key={blog.id} className="relative my-4 w-full  bg-gray-800 p-4  rounded-md shadow-md flex flex-col gap-4">
                        <div className="flex flex-col  lg:items-center lg:flex-row  text-white  gap-4 lg:gap-8">
                            <div className="flex flex-col  lg:self-start gap-8 lg:gap-8 font-medium text-sm lg:text-base lg:font-semibold">
                                <h2 className="">Created By: {blog?.createdBy?.userId ?
                                    <Link className="text-gray-300 mx-2" to={`/profile/${blog?.createdBy?.userId}`}> {blog?.createdBy?.name}</Link> :
                                    <span className="text-gray-300 ml-2" >Unknown User</span>}
                                    At: <span className="text-gray-300 ml-1">{blog?.createdAt || "Unknown Date"}</span></h2>
                                <img src={blog.imageUrl || "default-image-url.jpg"} alt="" className="max-w-sm" />
                                <div className="flex flex-col gap-4">
                                    <h3>Comments: <span className="ml-1 text-gray-300">{blog?.comments?.length || 0}</span></h3>
                                    <h3>Likes: <span className="ml-1 text-gray-300">{blog?.likes || 0}</span></h3>
                                </div>
                            </div>
                            <div className="text-white flex flex-col lg:gap-4">
                                <h1 className="font-semibold text-lg">{blog.title}</h1>
                                <p className="text-xs lg:text-sm font-medium leading-5 text-white w-4/5  my-4 break-words">{blog.bigDescription.substring(0, 200)}</p>
                                <Link className="bg-secondary px-3 py-[10px] rounded-lg text-center my-4 lg:my-0 " to={`/blog/${blog.id}`}>Read More</Link>
                                <Button onClick={() => remove(blog.id)} className="bg-red-500">Delete</Button>
                                <Button onClick={() => handleOpenComments(blog)} className="bg-green-500 mt-4 md:mt-0">See All comments</Button>
                            </div>
                            {isOpenComments && <AdminComments chosenBlog={chosenBlog} setIsOpenComments={setIsOpenComments} modalRefComments={modalRefComments} fetchBlog={fetchBlog}  fetchBlogs={fetchBlogs} />}
                        </div>
                    </div>
                ))}
            </div>
            <Toaster />

            {/* Load More Button */}
            {lastVisible && (
                <div className="flex justify-center">
                    <Button onClick={fetchMoreBlogs} className="mb-16 bg-gradient-to-r from-secondary to-green-500 ">
                        {loading ? "Loading..." : "Load More"}
                    </Button>
                </div>
            )}
        </>
    );
};

export default EditBlog;
