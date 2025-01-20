import { doc, getFirestore, deleteDoc } from "firebase/firestore"
import { useEffect } from "react"
import { useAuth } from "../../../context/AuthContext"
import toast, { Toaster } from 'react-hot-toast';

const EditBlog = () => {
    const db = getFirestore()
    const { getAllBlog, blogs } = useAuth()


    const remove = async (id) => {
        const dataRef = doc(db, "blogs", id)
        await deleteDoc(dataRef)
        getAllBlog()
        toast.success("Blog deleted successfully")
    }

    useEffect(() => {
        getAllBlog()
    }, [])




    return (
        <>
            {blogs.length === 0 ? <h1 className="text-2xl font-bold self-center">No blogs found</h1> : <h1 className="text-2xl mt-4 md:text-4xl font-bold text-center text-secondary">Remove Blogs</h1>
            }
            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-12 p-12 relative  ">

                {blogs.map(blog => (
                    <div key={blog.id} className="relative bg-white p-4 rounded-md shadow-md flex flex-col gap-4">

                        <h1 className="text-2xl  font-semibold self-center"> <span className="font-bold text-primary">Title:</span> {blog.title}</h1>
                        <img src={blog.imageUrl} alt="" />
                        
                        <p className="text-base text-gray-800 font-medium mb-16"> <p className="font-bold text-black text-center text-lg my-4 "> Description:</p> {blog.bigDescription}</p>

                        <button className=" absolute  bottom-3 w-1/2 mx-auto text-center right-0 left-0 bg-red-500 text-white p-2 rounded-md" onClick={() => remove(blog.id)}>Delete</button>
                        <Toaster />

                    </div>
                ))}
            </div>
        </>
    )
}

export default EditBlog