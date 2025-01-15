import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedAdmin() {
    const { currentUser, role } = useAuth()
    return currentUser && role === "admin" ? <Outlet /> : <Navigate to="/dashboard" />
}