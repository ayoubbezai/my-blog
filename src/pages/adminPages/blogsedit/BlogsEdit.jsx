import Navbar from "../adminComp/Navbar"
import EditBlog from "../adminComp/EditBlog"
const BlogsEdit = () => {
    return (
        <div className="flex flex-col md:flex-row min-h-screen  bg-primary">
            <Navbar />
            <div className="flex-1  md:p-16 bg-primary shadow-lg  md:h-screen md:overflow-y-auto">
            <EditBlog />

        </div>
        </div>
    )
}

export default BlogsEdit