import React, { useState, useContext, useEffect } from "react"
import PropTypes from 'prop-types';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

const authContext = React.createContext()

export function useAuth() {
    return useContext(authContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [role, setRole] = useState(null)

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
        })
        return unsubscribe
    }, [])
    const value = {
        currentUser,
        signup,
        login,
        setRole,
        role,
        logout
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