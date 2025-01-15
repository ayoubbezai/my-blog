import { Link } from "react-router-dom"
import { useAuth } from "../../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"



const NavBar = ({ hoverd }) => {

    const { logout, getName, name, abvName, getabvName } = useAuth()
    useEffect(() => {
        getName()
        getabvName()
    }, [])

    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate("/login")
    }





    return (
        <div className="  flex  bg-primary text-white justify-between items-center p-4 ">

            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-secondary tracking-widest uppercase">BLOG</h1>
            </div>
            <div className="hidden md:flex items-center gap-6 ml-12">
                <ul className="flex items-center gap-6 ">
                    <Link to="/dashboard" className={`text-sm font-bold text-center text-white hover:text-secondary ${hoverd === 1 ? "text-secondary " : ""} `}>Dashboard</Link>
                    <Link to="/profile" className={`text-sm font-bold text-center text-white hover:text-secondary ${hoverd === 2 ? "text-secondary" : ""}`}>Profile</Link>
                    <Link to="/blogsedit" className={`text-sm font-bold text-center text-white hover:text-secondary ${hoverd === 3 ? "text-secondary" : ""}`}>Blogs Edit</Link>
                </ul>
            </div>
            <div className="flex items-center gap-2">
                <p className="text-xl font-bold text-center bg-white   rounded-full w-10 h-10 flex items-center justify-center  text-primary mr-4  "  >{abvName}</p>
                <div className="flex flex-col">
                    <p className="text-sm font-bold text-center">{name}</p>
                    <button onClick={handleLogout} className="text-sm font-bold text-center text-secondary hover:underline" >Logout</button>
                </div>
            </div>



        </div>
    )
}

export default NavBar