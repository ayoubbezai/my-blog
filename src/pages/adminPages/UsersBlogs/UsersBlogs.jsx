import NavBar from "../adminComp/Navbar"
import PendingBlog from "../adminComp/PenddingBlog"
const UsersBlogs = () => {
    return (
        <div className="flex flex-col  md:flex-row min-h-screen bg-primary">
            <NavBar hoverd={4} />
                < PendingBlog />
        </div>
    )
}

export default UsersBlogs
