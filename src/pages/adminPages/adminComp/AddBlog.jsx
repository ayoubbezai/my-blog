import { getFirestore } from "firebase/firestore"
import { useRef } from "react"
import { addDoc, collection } from "firebase/firestore"
import { useAuth } from "../../../context/AuthContext"
import { useState, useEffect } from "react"

const AddBlog = () => {

    const titleRef = useRef("")
    const descRef = useRef("")
    const bigDescRef = useRef("")
    const [loading, setLoading] = useState(false)
    const { getAllBlog } = useAuth()



    const db = getFirestore()
    const data = collection(db, "blogs")
    const addBlog = async () => {
        const blogdata = {
            "title": titleRef.current.value,
            "description": descRef.current.value,
            "bigDescription": bigDescRef.current.value,
        }
        setLoading(true)
        try {
            await addDoc(data, blogdata)
            titleRef.current.value = ""
            descRef.current.value = ""
            bigDescRef.current.value = ""
            getAllBlog()

        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        addBlog()
    }
    useEffect(() => {
        getAllBlog()
    }, [])

    return (
        <div className="flex flex-col justify-start mt-10 items-center h-[80vh] bg-primary gap-4 ">
            <h1 className="text-4xl font-bold text-center text-secondary">Add Blog</h1>
            <form className="flex flex-col gap-4  p-4 rounded-md w-1/2" onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" className="w-full p-2 rounded-md border-2 " ref={titleRef} required />
                <input type="text" placeholder="Description" className="w-full p-2 rounded-md border-2 " ref={descRef} required />
                <textarea type="text" placeholder="big description" className="w-full p-2 rounded-md border-2   " ref={bigDescRef} required />


                <button className="bg-secondary text-white p-2 rounded-md text-center font-bold" type="submit" disabled={loading}>{loading ? "Loading..." : "Add Blog"}</button>
            </form>

        </div>
    )
}

export default AddBlog