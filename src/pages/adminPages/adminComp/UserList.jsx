import { useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import Navbar from '../adminComp/Navbar'

const UserList = () => {
    const { users, getAllUsers } = useAuth();
    useEffect(() => {
        getAllUsers();
    }, []);

    const db = getFirestore();

    const removeUser = async (id) => {
        try {
            await deleteDoc(doc(db, "users", id));
            alert("User removed successfully");
            getAllUsers();
        } catch (error) {
            console.log(error);
        }
    };

    const editUserRole = async (id) => {
        try {
            const user = users.find((user) => user.id === id);
            if (user.role === "admin") {
                await updateDoc(doc(db, "users", id), { role: "user" });
            } else {
                await updateDoc(doc(db, "users", id), { role: "admin" });
            }
            alert("User role updated successfully");
            getAllUsers();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="">
            <Navbar hoverd={1} />

            <h1 className="text-4xl font-bold text-center text-secondary my-4">User List</h1>
            <div className="overflow-x-auto md:overflow-hidden p-4 md:mx-12">
                <table className="min-w-full table-auto text-left ">
                    <thead>
                        <tr className="bg-secondary">
                            <th className="text-white font-bold py-2 px-4">Name</th>
                            <th className="text-white font-bold py-2 px-4">Email</th>
                            <th className="text-white font-bold py-2 px-4">Role</th>
                            <th className="text-white font-bold py-2 px-4 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-t border-gray-300">
                                <td className="py-2 px-4 text-white">{user.name}</td>
                                <td className="py-2 px-4 text-white">{user.email}</td>
                                <td className="py-2 px-4 text-white">{user.role}</td>
                                <td className="py-2 px-4 flex justify-evenly items-center text-center space-x-2">
                                    <button
                                        className="  bg-red-500 text-sm text-white  px-4 py-2 rounded-md font-semibold"
                                        onClick={() => removeUser(user.id)}
                                    >
                                        Remove User
                                    </button>
                                    <button
                                        className={`${user.role === "admin" ? "bg-primary px-6 " : "bg-secondary"} text-sm text-white px-4 py-2 rounded-md font-semibold`}
                                        onClick={() => editUserRole(user.id)}
                                    >
                                        {user.role === "admin" ? "Make User" : "Make Admin"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
