import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedAdmin() {
    const { role } = useAuth()
    return role === "admin" ? <Outlet /> : <Navigate to="/login" />
}