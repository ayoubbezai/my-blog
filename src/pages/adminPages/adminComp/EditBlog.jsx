import { doc, getFirestore, deleteDoc, collection, getDocs, updateDoc } from "firebase/firestore"
import { useEffect } from "react"
import { useAuth } from "../../../context/AuthContext"
const EditBlog = () => {
    const db = getFirestore()
    const {getAllBlog , blogs} = useAuth()


    const remove = async (id) => {
        const dataRef = doc(db, "blogs", id)
        await deleteDoc(dataRef)
        getAllBlog()
        alert("Blog deleted successfully")
    }

    useEffect(() => {
        getAllBlog()
    }, [])




    return (
        <>
            {blogs.length === 0 ? <h1 className="text-2xl font-bold self-center">No blogs found</h1> : <h1 className="text-4xl font-bold text-center text-secondary">Remove Blogs</h1>
            }
            <div className="grid grid-cols-3 gap-12 p-12">

                {blogs.map(blog => (
                    <div key={blog.id} className="bg-white p-4 rounded-md shadow-md flex flex-col gap-4">
                        
                        <h1 className="text-2xl font-bold self-center"> <span className="font-bold text-primary">Title:</span> {blog.title}</h1>
                        <p className="text-sm text-gray-500"> <span className="font-bold text-primary">Description:</span> {blog.description}</p>
                        <p className="text-sm text-gray-500"> <span className="font-bold text-primary">Big Description:</span> {blog.bigDescription}</p>
                        <button className="bg-red-500 text-white p-2 rounded-md" onClick={() => remove(blog.id)}>Delete</button>
                        
                    </div>
                ))}
            </div>
        </>
    )
}

export default EditBlog