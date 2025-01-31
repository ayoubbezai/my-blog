import NavBar from '../adminComp/Navbar'

const Admin = () => {
  return (
    <div className="flex flex-col  md:flex-row min-h-screen bg-primary">
      <NavBar />
      <div className="flex-1 md:px-16 bg-primary shadow-lg md:h-screen md:overflow-y-auto">     
    </div>
    </div>
  )
}

export default Admin