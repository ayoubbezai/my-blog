import { useEffect } from "react"
import { useAuth } from "../../../context/AuthContext"
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore"




const UserList = () => {
    const { users, getAllUsers } = useAuth()
    useEffect(() => {
        getAllUsers()
    }, [])

    const db = getFirestore()

    const removeUser = async (id) => {
        try {

            await deleteDoc(doc(db, "users", id))

            alert("User removed successfully")
            getAllUsers()
        } catch (error) {
            console.log(error)
        }
    }

    const editUserRole = async (id) => {
        try {
            const user = users.find(user => user.id === id)
            if(user.role === "admin"){
                await updateDoc(doc(db, "users", id),{ role: "user" })
            }else{
                await updateDoc(doc(db, "users", id),{ role: "admin" })
            }
            alert("User role updated successfully")
            getAllUsers()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="bg-primary h-screen">
            <h1 className="text-4xl font-bold text-center text-secondary my-4">User List</h1>
            <div className="flex flex-col gap-4 p-12">
            <table className="w-full">
                            <tr className="">
                                <td className="text-white font-bold py-2">Name</td>
                                <td className="text-white font-bold py-2">Email</td>
                                <td className="text-white font-bold py-2">Role</td>
                                <td className="text-white font-bold py-2 text-center">Action</td>
                            </tr>

                {users.map(user => (
                            <tr key={user.id} className=" ">
                                <td className="py-2 text-white  "> {user.name}</td>
                                <td className="py-2 text-white"> {user.email}</td>
                                <td className="py-2 text-white"> {user.role}</td>
                                <td className="py-2 flex justify-evenly items-center self-center text-center"> <button className="bg-secondary text-sm text-white px-2 py-1  rounded-md self-center font-semibold" onClick={() => removeUser(user.id)}>Remove User</button>
                                <button className="bg-secondary text-sm text-white px-2 py-1  rounded-md self-center font-semibold" onClick={() => editUserRole(user.id)}>{user.role === "admin" ? "Make User" : "Make Admin"}</button>
                                
                                </td>

                            </tr>
                ))}
            </table>
            </div>
        </div>
    )
}

export default UserList