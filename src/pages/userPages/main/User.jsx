import NavBar from "../userComp/NavBar"
import Hero from "../userComp/Hero"
import RecentBlogs from "../userComp/RecentBolgs"

const User = () => {
  return (
    <div className="bg-primary md:flex flex-row ">
      <NavBar hoverd={1} />
      <div className="h-screen flex-1 overflow-auto">
        <Hero />
        <RecentBlogs />
      </div>
    </div>
  )
}

export default User