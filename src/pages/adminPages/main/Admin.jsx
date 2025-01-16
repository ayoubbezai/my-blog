import Navbar from '../adminComp/Navbar'
import UserList from '../adminComp/UserList'

const Admin = () => {
  return (
    <div className="bg-primary">
      <Navbar hoverd={1} />
      <UserList />
    </div>
  )
}

export default Admin