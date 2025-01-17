import { useEffect } from "react"
import { useAuth } from "../../../context/AuthContext"
import { Link } from "react-router-dom"

const RecentBlogs = () => {
    const { blogs, getAllBlog } = useAuth()

    useEffect(() => {
        getAllBlog()
    }, [])

    return (
        <>
            {blogs.length === 0 ? <h1 className="text-2xl font-bold self-center">No blogs found</h1> : <h1 className="text-2xl md:text-4xl font-bold text-center text-secondary">Recent Blogs</h1>
            }
            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-12 p-12 relative  ">

                {blogs.slice(0, 3).map(blog => (
                    <div key={blog.id} className=" relative bg-white p-4 rounded-md shadow-md flex flex-col gap-4">

                        <h1 className="text-2xl font-bold self-center"> <span className="font-bold text-primary"></span> {blog.title}</h1>
                        <img src={blog.imageUrl} alt="" />

                        <p className="text-base text-gray-800 font-medium mb-12"> <span className="font-bold text-primary"></span> {blog.description}</p>

                        <Link
                            to={`/blog/${blog.id}`}
                            className="  absolute bottom-4  font-semibold text-lg self-center hover:underline">
                            Read more
                        </Link>


                    </div>
                ))}
            </div>
            <div className="flex justify-center pb-12 ">
                <Link to="/blogs" >
                    <button className="bg-primary  p-2 rounded-md self-center text-center w-full mt-4 mx-auto text-white px-8 py-3 text-lg font-bold transition-all duration-300 hover:underline">View All Blogs</button>
                </Link>
            </div>
        </>
    )
}

export default RecentBlogs