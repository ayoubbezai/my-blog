import React, { useState, useContext, useEffect } from "react"
import PropTypes from 'prop-types';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, getFirestore, collection, getDocs } from "firebase/firestore"
const authContext = React.createContext()

export function useAuth() {
    return useContext(authContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [role, setRole] = useState(null)
    const [abvName, setAbvName] = useState("")
    const [userData, setUserData] = useState({ name: "", email: "", role: "", profile: "" })

    const [blogs, setBlogs] = useState([])
 

    const fetchUserData = async () => {
        const userRef = doc(db, "users", currentUser.uid)
        const userDoc = await getDoc(userRef)
        setUserData(userDoc.data())
        setAbvName(userDoc.data().name.split(" ").map(word => word[0]).join("").slice(0, 2).toUpperCase())
    }

    const getabvName = (name) => {
        setAbvName(name.split(" ").map(word => word[0]).join("").slice(0, 2).toUpperCase())
    }



    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }
    function logout() {
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setLoading(false)
            getAllBlog()
        })
        return unsubscribe
    }, [])


    const db = getFirestore()

  


    const getAllBlog = async () => {
        const dataRef = collection(db, "blogs")
        const data = await getDocs(dataRef)
        const blogs = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setBlogs(blogs)
    }

    const [users, setUsers] = useState([])

    const getAllUsers = async () => {
        const dataRef = collection(db, "users")
        const data = await getDocs(dataRef)
        const users = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setUsers(users)
    }



    const value = {
        currentUser,
        signup,
        login,
        setRole,
        role,
        logout,
        abvName,
        fetchUserData,
        userData, 
        getabvName,
        blogs,
        getAllBlog,
        users,
        getAllUsers,
    }
    return (

        <authContext.Provider value={value}>
            {loading ? <div>Loading...</div> : children}
        </authContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
}; 