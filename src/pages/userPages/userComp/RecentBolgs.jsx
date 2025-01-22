import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFirestore, doc, collection, getDocs, query, limit } from "firebase/firestore"


const db = getFirestore()
const RecentBlogs = () => {

    const [blogs, setBlogs] = useState([])

    const fetchLimiteddata = async (collectionName, limitCount) => {
        try {
            const collectionRef = collection(db, collectionName);
            const q = query(collectionRef, limit(limitCount))
            const querySnapshot = await getDocs(q)
            const data = querySnapshot.docs.map(doc => (
                {
                    id: doc.id,
                    ...doc.data()
                }
            ))
            console.log(data)
            return data;
        } catch {
            console.log("error")
        }


    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchLimiteddata("blogs", 4)
            setBlogs(data)

        }

        fetchData()
    }, []);

    return (
        <div>
            {blogs.length === 0 ? (
                <h1 className="text-xl font-semibold text-center mt-6 text-white">
                    No blogs found
                </h1>
            ) : (
                <h1 className="text-2xl md:text-3xl font-bold text-center text-white mt-6">
                    Recent Blogs
                </h1>
            )}

            <div className="py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6">
                    {blogs.length > 1 ? (
                        <>
                            {/* Featured Blog (full width on small screens) */}
                            <div className="col-span-1 row-span-2 p-4 flex flex-col gap-3 shadow-lg bg-primary rounded-lg">
                                <h2 className="text-lg sm:text-base md:text-2xl mb-2 font-bold leading-snug text-white">
                                    {blogs[0].title}
                                </h2>
                                <div className="flex flex-col gap-4">
                                    {/* Image on top */}
                                    <img
                                        src={blogs[0].imageUrl}
                                        alt={blogs[0].title}
                                        className="h-56 md:h-64 object-cover rounded-lg"
                                    />
                                    {/* Text below */}
                                    <div className="flex flex-col">
                                        <p className="text-sm sm:text-base md:text-base leading-loose text-white mt-3">
                                            {blogs[0].bigDescription.length > 200
                                                ? `${blogs[0].bigDescription.substring(0, 200)}...`
                                                : blogs[0].bigDescription}
                                        </p>
                                        <Link
                                            to={`/blog/${blogs[0].id}`}
                                            className="text-secondary text-base md:text-lg font-bold hover:underline mt-4"
                                        >
                                            Read more
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Other Blogs (equal layout for all screen sizes) */}
                            {blogs.slice(1, 3).map((blog, index) => (
                                <div
                                    key={index}
                                    className="col-span-1 row-span-1 p-4 flex flex-col lg:flex-row gap-6 shadow-lg bg-primary rounded-lg"
                                >
                                    {/* Image on the left */}
                                    <img
                                        src={blog.imageUrl}
                                        alt={blog.title}
                                        className="w-full lg:w-2/5 h-32 md:h-40 object-cover rounded-lg"
                                    />
                                    {/* Text on the right */}
                                    <div className="flex flex-col gap-3 lg:w-3/5">
                                        <h2 className="text-sm sm:text-base md:text-xl font-bold leading-snug text-white">
                                            {blog.title}
                                        </h2>
                                        <p className="text-xs sm:text-base md:text-sm leading-loose text-white mt-2">
                                            {blog.bigDescription.length > 150
                                                ? `${blog.bigDescription.substring(0, 150)}...`
                                                : blog.bigDescription}
                                        </p>
                                        <Link
                                            to={`/blog/${blog.id}`}
                                            className="text-secondary text-base md:text-lg font-semibold hover:underline mt-2"
                                        >
                                            Read more
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <h2 className="col-span-2 text-center text-gray-400">
                            Not enough blogs to display.
                        </h2>
                    )}
                </div>

                {/* New Row with Another Blog (Full Width) */}
                {blogs.length > 3 && (
                    <div className="grid grid-cols-1 gap-6 p-6">
                        <div className="col-span-1 p-4 flex flex-col lg:flex-row gap-20 shadow-lg bg-primary rounded-lg w-full">
                            {/* Image on the left */}
                            <img
                                src={blogs[3].imageUrl}
                                alt={blogs[3].title}
                                className="w-full lg:w-1/3 h-40 md:h-48 object-cover rounded-lg"
                            />
                            {/* Text on the right */}
                            <div className="flex flex-col gap-3 lg:w-2/3">
                                <h2 className="text-sm sm:text-base md:text-xl font-bold leading-snug text-white">
                                    {blogs[3].title}
                                </h2>
                                <p className="text-sm sm:text-base md:text-base leading-loose w-[90%] text-white mt-3">
                                    {blogs[3].bigDescription.length > 300
                                        ? `${blogs[3].bigDescription.substring(0, 300)}...`
                                        : blogs[3].bigDescription}
                                </p>
                                <Link
                                    to={`/blog/${blogs[3].id}`}
                                    className="text-secondary text-base md:text-lg font-bold hover:underline mt-2"
                                >
                                    Read more
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-center pb-8">
                <Link to="/blogs">
                    <button className="bg-primary text-white px-6 py-3 rounded-md text-lg font-bold transition-transform duration-300 hover:scale-105">
                        View All Blogs
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default RecentBlogs;
