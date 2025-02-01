import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import NavBar from "../userComp/NavBar";
import { fetchBlogsByIds } from "../../../utils/helpers";
import OneBlog from "../userComp/OneBlog";

const MyBlogs = () => {
    const { fetchUserData, userData } = useAuth();
    const myBlogsId = userData?.myBlogs;
    const [myBlogs, setMyBlogs] = useState([]);

    useEffect(() => {
        fetchUserData(); // Fetch user data to get liked blogs
        const getBlog = async () => {
            try {
                const fetchedBlogs = await fetchBlogsByIds(myBlogsId, "newBlogs");
                setMyBlogs(fetchedBlogs);
            } catch (error) {
                console.log("Error fetching liked blogs:", error);
            }
        };
        if (myBlogsId?.length) {
            getBlog();
        }
    }, [fetchUserData, myBlogsId]);

    // Status style mapping
    const statusStyles = {
        pending: "bg-yellow-500 text-yellow-900",
        accepted: "bg-green-500 text-green-900",
        refused: "bg-red-500 text-red-900",
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-primary">
            <NavBar hoverd={4} />
            <div className="flex-1 p-8 md:p-16 bg-primary shadow-lg md:h-screen md:overflow-y-auto">
                <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-secondary to-green-500 text-transparent bg-clip-text mb-10">
                    {myBlogs.length > 0 ? "My Blogs" : "You don't publish any blog"}
                </h1>

                {/* Liked Blogs Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-8">
                    {myBlogs.map((b) => (
                        <div
                            key={b.id}
                            className="py-4 bg-gray-800 flex flex-col items-center gap-4 rounded-lg border-2 border-transparent shadow-lg hover:shadow-xl transition-shadow duration-300 sm:w-full px-6 md:px-4 lg:px-0 lg:w-[85%] mx-auto"
                        >
                            <OneBlog blog={b} />

                            {/* Status Badge */}
                            <span className={`px-4 py-1 rounded-full text-sm font-semibold ${statusStyles[b?.status] || "bg-gray-500 text-gray-900"}`}>
                                {b?.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyBlogs;
