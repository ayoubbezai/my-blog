import NavBar from "../userComp/NavBar"
import AllBlogs from "../userComp/AllBlogs"
const Blogs = () => {
  return (
    <div className="bg-primary min-h-screen  md:flex flex-col md:flex-row ">
      <NavBar hoverd={2} />
      <AllBlogs />
    </div>
  )
}

export default Blogs