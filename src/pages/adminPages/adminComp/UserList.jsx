import { useEffect, useState } from "react";
import { getFirestore, collection, query, orderBy, limit, startAfter, getDocs, doc, deleteDoc, updateDoc, where } from "firebase/firestore";
import { removeUser, changeUserRole } from "@/utils/helpers"; // Assuming these helpers exist

const UserList = () => {
    const db = getFirestore();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]); // To store users after filtering
    const [searchTerm, setSearchTerm] = useState(""); // To handle the search term
    const [lastDoc, setLastDoc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true); // Track if there's more data to fetch
    const pageSize = 10; // Users per page

    useEffect(() => {
        fetchUsers(); // Load first page of users on mount
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            // If there's no search term, display all users
            setFilteredUsers(users);
        } else {
            // Filter users by name and email
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(lowercasedSearchTerm) ||
                user.email.toLowerCase().includes(lowercasedSearchTerm) ||
                user.role.toLowerCase().includes(lowercasedSearchTerm)
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, users]);

    // 🔹 Fetch Initial Users (First Page)
    const fetchUsers = async () => {
        setLoading(true);
        const userQuery = query(collection(db, "users"), orderBy("name"), limit(pageSize));
        const snapshot = await getDocs(userQuery);

        if (!snapshot.empty) {
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]); // Store last document
            setHasMore(snapshot.docs.length === pageSize); // If the snapshot is full, assume more data exists
        } else {
            setHasMore(false); // No data fetched, so there are no more users
        }

        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
    };

    // 🔹 Fetch More Users when "See More" is clicked
    const fetchNextPage = async () => {
        if (!lastDoc || loading || !hasMore) return; // Don't fetch if loading or no more data

        setLoading(true);

        const nextQuery = query(collection(db, "users"), orderBy("name"), startAfter(lastDoc), limit(pageSize));
        const snapshot = await getDocs(nextQuery);

        if (!snapshot.empty) {
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]); // Update last document
            setHasMore(snapshot.docs.length === pageSize); // If the snapshot is full, assume more data exists
        } else {
            setHasMore(false); // No more data if snapshot is empty
        }

        // Append new users to the existing list
        const newUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(prevUsers => [...prevUsers, ...newUsers]);
        setLoading(false);
    };

    // 🔹 Remove User by ID
    const handleRemoveUser = async (userId) => {
        try {
            await removeUser(userId); // Helper function to remove the user from Firestore
            setUsers(users.filter(user => user.id !== userId)); // Remove from local state
        } catch (error) {
            console.error("Error removing user:", error);
        }
    };

    // 🔹 Change User Role
    const handleChangeRole = async (userId, currentRole) => {
        const newRole = currentRole === "user" ? "admin" : "user"; // Toggle between "user" and "admin"

        try {
            await changeUserRole(userId, newRole); // Helper function to update the user's role
            setUsers(users.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            )); // Update role in local state
        } catch (error) {
            console.error("Error changing role:", error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-center text-secondary mb-6">User List</h1>

            {/* Search Bar */}
            <div className="mb-6 w-full max-w-xl mx-auto">
                <input
                    type="text"
                    placeholder="Search by name, email or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 w-full border rounded-md"
                />
            </div>

            {/* Table on Desktop */}
            <div className="hidden xl:block">
                <div className="overflow-x-auto shadow-lg max-h-96 rounded-lg">
                    <table className="min-w-full bg-gray-800 text-left rounded-lg">
                        <thead>
                            <tr className="bg-secondary text-white">
                                <th className="py-3 px-6">Name</th>
                                <th className="py-3 px-6">Email</th>
                                <th className="py-3 px-6">Role</th>
                                <th className="py-3 px-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && users.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-4 text-white">Loading...</td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-700">
                                        <td className="py-3 px-6 text-white">{user.name}</td>
                                        <td className="py-3 px-6 text-white">{user.email}</td>
                                        <td className="py-3 px-6 text-white capitalize">{user.role}</td>
                                        <td className="py-3 px-6 text-white">
                                            {/* Action Buttons */}
                                            <button
                                                onClick={() => handleRemoveUser(user.id)}
                                                className="px-2 py-1 text-sm font-semibold bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                            <button
                                                onClick={() => handleChangeRole(user.id, user.role)}
                                                className="ml-2 px-2 py-1 bg-secondary text-sm font-semibold text-white rounded hover:bg-secondary"
                                            >
                                                {user.role === "user" ? "Make Admin" : "Make User"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Grid on Mobile */}
            <div className="grid grid-cols-1 xl:hidden gap-4">
                {loading && users.length === 0 ? (
                    <div className="col-span-1 text-center py-4 text-white">Loading...</div>
                ) : (
                    filteredUsers.map((user) => (
                        <div key={user.id} className="bg-gray-800 text-white p-4 rounded-lg">
                            <div className="mb-2">
                                <span className="font-bold">Name:</span> {user.name}
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">Email:</span> {user.email}
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">Role:</span> {user.role}
                            </div>
                            <div className="mt-2 flex justify-between">
                                {/* Action Buttons */}
                                <button
                                    onClick={() => handleRemoveUser(user.id)}
                                    className="px-2 py-1 text-sm font-semibold bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Remove
                                </button>
                                <button
                                    onClick={() => handleChangeRole(user.id, user.role)}
                                    className="ml-2 px-2 py-1 bg-secondary text-sm font-semibold text-white rounded hover:bg-secondary"
                                >
                                    {user.role === "user" ? "Make Admin" : "Make User"}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* See More Button */}
            <div className="text-center mt-4">
                <button
                    onClick={fetchNextPage}
                    disabled={!hasMore || loading}
                    className={`px-4 py-2 rounded-md font-semibold ${!hasMore ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"} text-white`}
                >
                    {loading ? "Loading..." : "See More"}
                </button>
            </div>
        </div>
    );
};

export default UserList;
