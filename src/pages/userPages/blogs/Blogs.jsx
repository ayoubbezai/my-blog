import Navbar from "../userComp/Navbar"
import AllBlogs from "../userComp/AllBlogs"
const Blogs = () => {
  return (
    <div className="bg-primary">
      <Navbar hoverd={3} />
      <AllBlogs />
    </div>
  )
}

export default Blogs