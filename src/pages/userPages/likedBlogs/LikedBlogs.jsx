import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import NavBar from "../userComp/NavBar";
import { fetchBlogsByIds } from "../../../utils/helpers";
import OneBlog from "../userComp/OneBlog";

const LikedBlogs = () => {
    const { fetchUserData, userData } = useAuth();
    const likedBlogsId = userData?.likedBlogs || [];
    const [likedBlogs, setLikedBlogs] = useState([]);
    const memorizedBlogs = useMemo(() => likedBlogs, [likedBlogs]);

    useEffect(() => {
        fetchUserData(); // Fetch user data to get liked blogs
        const getBlog = async () => {
            try {
                const fetchedBlogs = await fetchBlogsByIds(likedBlogsId, "blogs");
                setLikedBlogs(fetchedBlogs);
            } catch (error) {
                console.log("Error fetching liked blogs:", error);
            }
        };
        if (likedBlogsId.length) {
            getBlog();
        }
    }, [fetchUserData, likedBlogsId]);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-primary">
            <NavBar hoverd={3} />
            <div className="flex-1 p-8 md:p-16 bg-primary shadow-lg md:h-screen md:overflow-y-auto">
                <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-secondary to-green-500 text-transparent bg-clip-text mb-10">
                    {memorizedBlogs.length > 0 ? "Liked Blogs" : "No Liked Blogs Yet"}
                </h1>

                {/* Total Likes Section */}
                <div className="flex justify-center items-center mb-10">
                    <div className="flex items-center gap-4 bg-gray-800 text-white px-6 py-4 rounded-lg shadow-lg">
                        <p className="text-lg font-semibold">Total Likes:</p>
                        <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
                            {likedBlogs.length}
                        </span>
                    </div>
                </div>

                {/* Liked Blogs Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8">

                    {memorizedBlogs.map((b) => (
                        <div
                            key={b.id}
                            className="py-4 bg-gray-800 flex flex-col items-center gap-2 rounded-lg border-2 border-transparent shadow-lg hover:shadow-xl transition-shadow duration-300 sm:w-full px-6 md:px-4  mx-auto w-full lg:w-4/5 "
                        >
                            <OneBlog blog={b} />

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LikedBlogs;
