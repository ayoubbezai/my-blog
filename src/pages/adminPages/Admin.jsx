import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
const Admin = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div>Admin
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Admin