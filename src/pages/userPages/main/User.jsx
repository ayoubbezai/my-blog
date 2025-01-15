import NavBar from "../userComp/NavBar"
import Hero from "../userComp/Hero"
import RecentBlogs from "../userComp/RecentBolgs"

const User = () => {
  return (
    <div className="bg-primary">
      <NavBar hoverd={1} />
      <Hero />
      <RecentBlogs />
    </div>
  )
}

export default User