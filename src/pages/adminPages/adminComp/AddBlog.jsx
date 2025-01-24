import { getFirestore } from "firebase/firestore"
import { useRef } from "react"
import { addDoc, collection } from "firebase/firestore"
import { useAuth } from "../../../context/AuthContext"
import { useState, useEffect } from "react"
import toast, { Toaster } from 'react-hot-toast';

const AddBlog = () => {

    const titleRef = useRef("")
    const bigDescRef = useRef("")
    const tagRef = useRef("")
    const [loading, setLoading] = useState(false)
    const { getAllBlog, fetchUserData, userData, currentUser } = useAuth()
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState('');

    const db = getFirestore()
    const data = collection(db, "blogs")
    const addBlog = async () => {

        const dataImage = new FormData();
        dataImage.append("file", image);
        dataImage.append("upload_preset", "my-blog");
        dataImage.append("cloud_name", "dbjoo9sww");

        try {
            setLoading(true)

            if (image === null) {
                return toast.error("Please Upload image")
            }

            const res = await fetch('https://api.cloudinary.com/v1_1/dbjoo9sww/image/upload', {
                method: "POST",
                body: dataImage
            })

            const cloudData = await res.json();
            setUrl(cloudData.url);
            console.log(cloudData.url);
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate() + 1).padStart(2, '0')}`;
            fetchUserData()

            const tags = tagRef.current.value.split(",")

            const blogdata = {
                "title": titleRef.current.value,
                "bigDescription": bigDescRef.current.value,
                "imageUrl": cloudData.url,
                "likes": 0,
                "createdAt": formattedDate,
                "createdBy": {
                    "name": userData.name,
                    "photo": userData.profile,
                    "userId": currentUser.uid
                },
                "tags": tags
            }

            await addDoc(data, blogdata)
            titleRef.current.value = ""
            bigDescRef.current.value = ""
            setUrl("")
            setImage("")
            toast.success("blog Upload Successfully")
            getAllBlog()

        } catch (error) {
            console.log("error", error)

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
        <div className="flex flex-col justify-start my-10 mb-26 items-center   gap-4 ">
            <h1 className="text-4xl font-bold text-center text-secondary">Add Blog</h1>
            <form className="flex flex-col gap-4  p-4 rounded-md w-1/2" onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" className="w-full p-2 rounded-md border-2 " ref={titleRef} required />
                <textarea type="text" placeholder="big description" className="w-full p-2 rounded-md border-2   " ref={bigDescRef} required />

                <input type="text" placeholder="enter tags u wanna do ',' between them" className="w-full p-2 rounded-md border-2 " ref={tagRef} required />

                <div className="input flex justify-center mb-5">
                    <label
                        htmlFor="file-upload"
                        className="custom-file-upload">
                        {image
                            ? <img
                                className=" w-72 lg:w-96  rounded-xl"
                                src={image ? URL.createObjectURL(image) : ""}
                                alt="img"
                            />
                            : <img
                                src="https://cdn-icons-png.flaticon.com/128/1665/1665680.png"
                                className="h-20 w-20"
                                alt="uplaod"
                            />}
                    </label>
                    <input
                        id="file-upload"
                        className=' text-white hidden'
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])} />
                </div>


                <button className="bg-secondary text-white p-2 rounded-md text-center font-bold" type="submit" disabled={loading}>{loading ? "Loading..." : "Add Blog"}</button>
                <Toaster />

            </form>

        </div>
    )
}

export default AddBlog