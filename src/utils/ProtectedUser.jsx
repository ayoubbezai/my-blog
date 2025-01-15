import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute() {
    const { currentUser, role } = useAuth()
    return currentUser && role === "user" ? <Outlet /> : <Navigate to="/dashboard" />
}