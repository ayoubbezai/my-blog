import UserList from '../adminComp/UserList'
import NavBar from '../adminComp/Navbar'


const UsersMangment = () => {
  return (
      <div className="flex flex-col  md:flex-row min-h-screen bg-primary">
          <NavBar hoverd={2}/>
          <div className="flex-1 md:px-16 bg-primary shadow-lg md:h-screen md:overflow-y-auto">
              <UserList />
          </div>
      </div>
  )
}

export default UsersMangment
