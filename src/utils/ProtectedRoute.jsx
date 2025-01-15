import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute() {
    const { currentUser } = useAuth()
    return currentUser ? <Outlet /> : <Navigate to="/login" />
}