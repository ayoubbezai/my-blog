
import { useAuth } from "../../../context/AuthContext";
import { getFirestore, doc, collection, updateDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import NavbarAdmin from "../../adminPages/adminComp/Navbar";
import NavbarUser from "../../userPages/userComp/NavBar";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';


const db = getFirestore()
const data2 = collection(db, "users")
const Profile = () => {
    const navigate = useNavigate()
    const { logout, currentUser, fetchUserData, userData, abvName } = useAuth()

    const [image, setImage] = useState(null)
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false)
    const nameRef = useRef()


    const addPic = async (e) => {
        e.preventDefault()
        const picData = new FormData();
        picData.append("file", image);
        picData.append("upload_preset", "my-blog");
        picData.append("cloud_name", "dbjoo9sww");
        try {
            setLoading(true)
            if (image === null) {
                return toast.error("Please Upload image")
            }

            const res = await fetch('https://api.cloudinary.com/v1_1/dbjoo9sww/image/upload', {
                method: "POST",
                body: picData
            })

            const cloudData = await res.json();
            setUrl(cloudData.url);

            await updateDoc(doc(data2, currentUser.uid), { profile: cloudData.url })
            toast.success("Name updated successfully")


        } catch {
            console.log("error")
        } finally {
            setImage(null)
            setLoading(false)
            fetchUserData()
        }

    }


    const handleLogout = async () => {
        await logout()
        navigate("/login")
    }

    const updateName = async (e) => {
        e.preventDefault()
        const name = nameRef.current.value
        await updateDoc(doc(data2, currentUser.uid), { name: name })
        nameRef.current.value = ""
        toast.success("Name updated successfully")
        fetchUserData()

    }

    const deletePicture = async () => {
        try {
            setLoading(true)
            await updateDoc(doc(data2, currentUser.uid), { profile: "" })
        } catch {
            console.log("faild deleting picture")
        }
        setImage(null)
        setLoading(false)
        toast.success("Picture Deleted successfully")
        fetchUserData()


    }
    useEffect(() => {

        fetchUserData()
    }, [])
    return (
        <div className="bg-primary md:flex ">
            {userData.role === "admin" && (
                <NavbarAdmin hoverd={3} />
            )}
            {userData.role === "user" && (
                <NavbarUser hoverd={4} />
            )}

            <div className="flex-1 justify-center items-center w-full py-12 px-4  md:h-screen md:overflow-auto  ">
                <div className=" pt-8 w-2/3 lg:w-1/2 mx-auto ">
                    <div className="">

                        <div className="flex flex-col items-center gap-4 bg-white rounded-xl shadow-lg py-12">
                            <h1 className="text-3xl font-bold text-center mb-6 text-primary">Profile</h1>
                            {userData.profile ? <img className="max-h-32 aspect-square max-w-32  rounded-full" src={userData.profile} alt="profile" /> : <p className="text-lg font-medium p-4 text-white bg-primary rounded-full px-5 "> {abvName}</p>}
                            <p className="text-lg font-medium"> <span className="text-primary font-bold">Name:</span> {userData.name}</p>
                            <p className="text-lg font-medium"> <span className="text-primary font-bold">Email:</span> {userData.email}</p>
                            <p className="text-lg font-medium"> <span className="text-primary font-bold">Role:</span> {userData.role}</p>

                            <button
                                onClick={handleLogout}
                                className=" bg-secondary text-white px-6 py-2 rounded-md text-lg font-semibold mt-4 transition-all md:hover:scale-105"
                            >
                                Logout
                            </button>

                        </div>


                        <div className=" flex flex-col items-center mt-20    p-2 gap-6 justify-between  bg-white rounded-xl shadow-lg w-full  pb-5 ">
                            <form onSubmit={updateName} className="flex flex-col justify-between items-center gap-4 mt-12    ">
                                <h2 className="text-xl font-bold mb-2"> <span className="text-primary text-2xl">Update Name:</span> </h2>
                                <div className="flex justify-center items-center gap-4 w-full">
                                    <input
                                        className="border-2 border-primary rounded-md p-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-primary"
                                        type="text"
                                        placeholder="Enter your new name"
                                        ref={nameRef}
                                    />
                                    <button
                                        className=" bg-primary text-white px-6 py-2 rounded-md text-lg font-semibold transition-all md:hover:scale-105" type="submit"
                                    >
                                        Update
                                    </button>
                                    <Toaster />

                                </div>
                            </form >
                            <h2 className="text-xl font-bold mt-3"> <span className="text-primary text-2xl">{userData.profile ? "Update picture :" : "Add picture : "}</span></h2>

                            <form className="flex flex-col gap-4  p-4 rounded-md w-1/2  " onSubmit={addPic}>

                                <div className="input flex justify-center mb-4">
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer"
                                    >
                                        {image ? (
                                            <img
                                                className="w-40 h-32 lg:w-96 max-w-32  rounded-full"
                                                src={URL.createObjectURL(image)}
                                                alt="Preview"
                                            />
                                        ) : (
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/128/1665/1665680.png"
                                                className="max-h-20 aspect-square max-w-20"
                                                alt="Upload Icon"
                                            />
                                        )}
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => setImage(e.target.files[0])}
                                    />
                                </div>



                                <button
                                    className={`bg-secondary text-white  p-2 rounded-md text-center font-bold ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Loading..." : `${userData.profile ? "Update" : "Add"} Picture`}
                                </button>


                            </form>
                            <button
                                className={`bg-red-500 text-white p-2 rounded-md text-center font-bold ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                type="submit"
                                disabled={loading}
                                onClick={deletePicture}
                            >
                                {loading ? "Loading..." : `Remove Picture`}
                            </button>
                            <Toaster />
                        </div>



                    </div>
                </div>
            </div >
        </div >
    )
}

export default Profile
