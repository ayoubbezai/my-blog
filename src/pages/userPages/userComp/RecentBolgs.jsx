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
            {blogs.length === 0 ? <h1 className="text-2xl font-bold self-center">No blogs found</h1> : <h1 className="text-4xl font-bold text-center text-secondary">Recent Blogs</h1>
            }
            <div className="grid grid-cols-3 gap-12 p-12 ">

                {blogs.slice(0, 3).map(blog => (
                    <div key={blog.id} className="bg-white p-4 rounded-md shadow-md flex flex-col gap-4">

                        <h1 className="text-2xl font-bold self-center"> <span className="font-bold text-primary">Title:</span> {blog.title}</h1>
                        <p className="text-sm text-gray-500"> <span className="font-bold text-primary">Description:</span> {blog.description}</p>
                        <p className="text-sm text-gray-500"> <span className="font-bold text-primary">Big Description:</span> {blog.bigDescription}</p>

                    </div>
                ))}
                <div className="flex justify-center col-span-3">
                    <Link to="/blogs" >
                        <button className="bg-primary  p-2 rounded-md self-center text-center w-full mt-4 mx-auto text-secondary transition-all duration-300 hover:underline">View All Blogs</button>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default RecentBlogs