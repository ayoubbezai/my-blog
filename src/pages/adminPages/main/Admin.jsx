import NavBar from '../adminComp/Navbar'
import UserBlogNumber from '../adminComp/UserBlogNumber'
import LatestBlogs from '../adminComp/LatestBlogs'
import MostEngagedBlogs from '../adminComp/MostEngagedBlogs'

const Admin = () => {
  return (
    <div className="flex flex-col  md:flex-row min-h-screen bg-primary">
      <NavBar hoverd={1} />
      <div className="flex-1 md:px-16 bg-primary shadow-lg md:h-screen md:overflow-y-auto">
        <UserBlogNumber />
        <div className='flex  mt-10 flex-col lg:flex-row gap-2  justify-between '>

          <MostEngagedBlogs />
          <LatestBlogs />
        </div>

      </div>
    </div>
  )
}

export default Admin