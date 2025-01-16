import AddBlog from "../adminComp/AddBlog"
import Navbar from "../adminComp/Navbar"
import EditBlog from "../adminComp/EditBlog"
const BlogsEdit = () => {
    return (
        <div className="bg-primary">
            <Navbar hoverd={2} />
            <AddBlog />
            <EditBlog />
        </div>
    )
}

export default BlogsEdit