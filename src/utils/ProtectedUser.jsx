import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedUser() {
    const { role } = useAuth()
    return role === "user" ? <Outlet /> : <Navigate to="/login" />
}