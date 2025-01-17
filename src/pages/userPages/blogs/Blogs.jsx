import NavBar from "../userComp/NavBar"
import AllBlogs from "../userComp/AllBlogs"
const Blogs = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary">
      <NavBar hoverd={2} />
      <AllBlogs />
    </div>
  )
}

export default Blogs