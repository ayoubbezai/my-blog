import { useAuth } from "../../../context/AuthContext";
import { getFirestore, getDoc, doc, collection, updateDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import NavbarAdmin from "../../adminPages/adminComp/Navbar";
import NavbarUser from "../../userPages/userComp/NavBar";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate()
    const db = getFirestore()
    const { logout, currentUser } = useAuth()
    const [userData, setUserData] = useState({ name: "", email: "", role: "" })

    const nameRef = useRef("")

    const collectionRef = collection(db, "users")
    useEffect(() => {
        const fetchUserData = async () => {
            setUserData({ name: "", email: "", role: "" })
            const userDoc = await getDoc(doc(collectionRef, currentUser.uid))
            console.log(userDoc.data())
            setUserData(userDoc.data())
        }
        fetchUserData()
    }, [])


    const handleLogout = async () => {
        await logout()
        navigate("/login")
    }

    const updateName = async (e) => {
        e.preventDefault()
        const name = nameRef.current.value
        await updateDoc(doc(collectionRef, currentUser.uid), { name: name })
        setUserData({ ...userData, name: name })
        nameRef.current.value = ""
        alert("Name updated successfully")
        fetchUserData()
    }

    return (
        <div className="bg-primary min-h-screen">
            {userData.role === "admin" && (
                <NavbarAdmin hoverd={3} />
            )}
            {userData.role === "user" && (
                <NavbarUser hoverd={3} />
            )}
            <div className="flex justify-center items-center py-12 px-4">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center mb-6 text-primary">Profile</h1>

                    <div className="flex flex-col items-center gap-6">
                        <p className="text-lg font-medium"> <span className="text-primary font-bold">Name:</span> {userData.name}</p>
                        <p className="text-lg font-medium"> <span className="text-primary font-bold">Email:</span> {userData.email}</p>
                        <p className="text-lg font-medium"> <span className="text-primary font-bold">Role:</span> {userData.role}</p>

                        <button
                            onClick={handleLogout}
                            className="bg-primary text-white px-6 py-2 rounded-md text-lg font-semibold mt-4 transition-all hover:bg-primary-dark"
                        >
                            Logout
                        </button>

                        <form onSubmit={updateName} className="flex flex-col items-center gap-4 mt-6">
                            <h2 className="text-xl font-bold"> <span className="text-primary text-2xl">Update Name:</span></h2>
                            <div className="flex justify-center items-center gap-4 w-full">
                                <input
                                    className="border-2 border-primary rounded-md p-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-primary"
                                    type="text"
                                    placeholder="Enter your new name"
                                    ref={nameRef}
                                />
                                <button
                                    className="bg-primary text-white px-6 py-2 rounded-md text-lg font-semibold w-24"
                                    type="submit"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
