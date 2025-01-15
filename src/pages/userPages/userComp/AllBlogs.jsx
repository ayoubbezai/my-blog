import { useEffect } from "react"
import { useAuth } from "../../../context/AuthContext"
const AllBlogs = () => {
    const { blogs ,getAllBlog } = useAuth()

    useEffect(() => {
        getAllBlog()
    }, [])

    return (
        <>
            {blogs.length === 0 ? <h1 className="text-2xl font-bold self-center">No blogs found</h1> : <h1 className="text-4xl font-bold text-center text-secondary">Blogs</h1>
            }
            <div className="grid grid-cols-3 gap-12 p-12 ">

                {blogs.map(blog => (
                    <div key={blog.id} className="bg-white p-4 rounded-md shadow-md flex flex-col gap-4">

                        <h1 className="text-2xl font-bold self-center"> <span className="font-bold text-primary">Title:</span> {blog.title}</h1>
                        <p className="text-sm text-gray-500"> <span className="font-bold text-primary">Description:</span> {blog.description}</p>
                        <p className="text-sm text-gray-500"> <span className="font-bold text-primary">Big Description:</span> {blog.bigDescription}</p>

                    </div>
                ))}
            </div>
        </>
    )
}

export default AllBlogs