import { useEffect } from "react"
import { useAuth } from "../../../context/AuthContext"
import { Link } from "react-router-dom"

const AllBlogs = () => {
    const { blogs, getAllBlog } = useAuth()

    useEffect(() => {
        getAllBlog()
    }, [])

    return (
        <>
            {blogs.length === 0 ? <h1 className="text-2xl font-bold self-center">No blogs found</h1> : <h1 className="text-2xl mt-8 md:text-4xl font-bold text-center text-secondary">ALL Blogs</h1>
            }
            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-12 p-12 relative  ">

                {blogs.map(blog => (
                    <div key={blog.id} className=" relative bg-white p-4 rounded-md shadow-md flex flex-col gap-4">

                        <h1 className="text-2xl font-bold self-center"> <span className="font-bold text-primary"></span> {blog.title}</h1>
                        <img src={blog.imageUrl} alt="" />

                        <p className="text-base text-gray-800 font-medium mb-12"> <span className="font-bold text-primary"></span> {blog.description}</p>


                        <Link className="  absolute bottom-2 mb-2  font-semibold text-lg self-center hover:underline"
                            to={`/blog/${blog.id}`}>Read More</Link>



                    </div>
                ))}
            </div >
        </>
    )
}

export default AllBlogs