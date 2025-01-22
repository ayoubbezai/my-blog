import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import NavBar from "../userComp/NavBar";
import { Link } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const LikedBlogs = () => {
    const { fetchUserData, userData } = useAuth();
    const likedBlogsId = userData.likedBlogs
    const [likedBlogs, setLikedBlogs] = useState([])
    const memorizedBlogs = useMemo(() => likedBlogs, [likedBlogs])

    useEffect(() => {
        fetchUserData();
        try {
            const getBlog = async () => {
                const likedBlogs = await fetchBlogsByIds(likedBlogsId)
                setLikedBlogs(likedBlogs)
            }
            getBlog()

        } catch {
            console.log("error")
        }
    }, [fetchUserData, likedBlogsId]);

    console.log(memorizedBlogs)

    const fetchBlogsByIds = async (ids) => {
        const db = getFirestore();

        // Fetch all blogs by their IDs
        try {
            const blogPromises = ids.map((id) => getDoc(doc(db, "blogs", id)));
            const blogSnapshots = await Promise.all(blogPromises);

            // Filter out any undefined blogs or invalid IDs
            const blogs = blogSnapshots
                .filter(snapshot => snapshot.exists()) // Ensure the document exists
                .map(snapshot => ({ id: snapshot.id, ...snapshot.data() })); // Convert snapshot to data

            return blogs;
        } catch (error) {
            console.error("Error fetching blogs by IDs:", error);
        }
    };
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-primary">
            <NavBar hoverd={3} />
            <div className="flex-1 p-8 md:p-16 bg-primary shadow-lg md:h-screen md:overflow-y-auto">
                <h1 className="text-3xl font-semibold text-center text-secondary mb-8">
                    {memorizedBlogs ? "Liked Blogs" : "There are no liked blogs"}
                </h1>

                <div className=" grid grid-cols-1 md:grid-cols-2  2xl:grid-cols-3 gap-y-8">
                    {memorizedBlogs.map((b) => (
                        <div
                            key={b.id}
                            className="p-6 bg-primary rounded-lg border-2 border-secondary shadow-md hover:shadow-xl transition-shadow duration-300 sm:w-full lg:w-[80%] mx-auto"
                        >
                            <img
                                src={b.imageUrl}
                                alt={b.title}
                                className="w-full h-64 object-cover rounded-md mb-4 aspect-video"
                            />
                            <h3 className="text-xl font-semibold text-white">{b.title}</h3>
                            <p className="text-base text-white mt-2 break-words">
                                {(b.bigDescription || "No description available.").substring(0, 150)}...
                            </p>
                            <Link
                                to={`/blog/${b.id}`}
                                className="inline-block mt-4 bg-secondary text-primary px-6 py-2 rounded-md hover:bg-secondary-dark transition-colors duration-300"
                            >
                                Read More
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LikedBlogs;
