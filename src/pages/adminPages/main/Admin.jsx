import NavBar from '../adminComp/Navbar'
import UserBlogNumber from '../adminComp/UserBlogNumber'
import LatestBlogs from '../adminComp/LatestBlogs'
import MostEngagedBlogs from '../adminComp/MostEngagedBlogs'
import LikeEngagement from '../adminComp/LikesEngagement'
import UsersBlogsCircle from '../adminComp/UsersBlogsCircle'

const Admin = () => {
  return (
    <div className="flex flex-col  md:flex-row min-h-screen bg-primary">
      <NavBar hoverd={1} />
      <div className="flex-1  bg-primary shadow-lg md:h-screen md:overflow-y-auto">
        <UserBlogNumber />

          <div className='flex flex-col lg:flex-row w-full items-center mt-8  justify-evenly'>
            <LikeEngagement />
            <UsersBlogsCircle />
          </div>

        <div className='flex flex-col md:flex-row my-8 gap-8  items-center'>
            <MostEngagedBlogs />
            <LatestBlogs />
        </div>

      </div>
    </div>
  )
}

export default Admin