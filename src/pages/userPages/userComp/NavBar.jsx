import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";




const NavBar = ({ hoverd }) => {
  const { logout, userData, fetchUserData, abvName } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);


  useEffect(() => {
    fetchUserData()
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };





  return (
    <div className="flex  md:flex-col bg-black text-white justify-between  items-center p-4  md:px-20 ">
      <div className={`flex items-center gap-2 ${menuOpen && "hidden md:flex"}`}>
        <h1 className="text-2xl font-bold text-secondary tracking-widest uppercase">BLOG</h1>
      </div>



      <div className={`md:flex items-center gap-6 ml-12 md:ml-0 hidden `}>
        <ul className="flex md:flex-col items-center gap-6">
          <Link
            to="/dashboard"
            className={`text-base font-bold text-center hover:text-secondary ${hoverd === 1 ? "text-secondary" : ""
              }`}
          >
            Dashboard
          </Link>
          <Link
            to="/blogs"
            className={`text-base font-bold text-center hover:text-secondary ${hoverd === 2 ? "text-secondary" : ""
              }`}
          >
            All Blogs
          </Link>
          <Link
            to="/likedblogs"
            className={`text-base font-bold text-center hover:text-secondary ${hoverd === 3 ? "text-secondary" : ""
              }`}
          >
            Liked Blogs
          </Link>


          <Link
            to="/myblogs"
            className={`text-base font-bold text-center hover:text-secondary ${hoverd === 4 ? "text-secondary" : ""
              }`}
          >
            My Blogs
          </Link>

          <Link
            to="/profile"
            className={`text-base font-bold text-center hover:text-secondary ${hoverd === 5 ? "text-secondary" : ""
              }`}
          >
            Profile
          </Link>
        </ul>
      </div>

      <div className={`flex md:flex-col  items-center gap-2 md:gap-3 ${menuOpen && "hidden md:flex"}`}>

        {userData.profile ? <img src={userData.profile} alt="profile" className="max-w-12 max-h-12 rounded-full aspect-square" /> : <p className="text-xl font-bold text-center bg-white rounded-full w-10 h-10 flex items-center justify-center text-primary mr-4"> {abvName} </p>}

        <div className="flex flex-col md:gap-3  items-center ">
          <p className="text-sm font-bold text-center">{userData.name}</p>
          <button
            onClick={handleLogout}
            className="text-sm font-bold text-center text-secondary hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
      {!menuOpen && <div className="md:hidden flex items-center  ">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl text-white focus:outline-none"
        > <span>&#9776;</span>
        </button>
      </div>}


      {menuOpen && < div className="flex flex-col   bg-black gap-8 md:hidden justify-between items-center w-full " >
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl text-white focus:outline-none"
        ><span className="text-3xl mr-4">&times; </span>
        </button>
        <Link
          to="/dashboard"
          className={`text-sm font-bold text-center hover:text-secondary ${hoverd === 1 ? "text-secondary" : ""
            }`}
        >
          Dashboard
        </Link>
        <Link
          to="/blogs"
          className={`text-sm font-bold text-center hover:text-secondary ${hoverd === 2 ? "text-secondary" : ""
            }`}
        >
          All Blogs
        </Link>
        <Link
          to="/likedblogs"
          className={`text-sm font-bold text-center hover:text-secondary ${hoverd === 3 ? "text-secondary" : ""
            }`}
        >
          Liked Blogs
        </Link>
        <Link
          to="/myblogs"
          className={`text-sm font-bold text-center hover:text-secondary ${hoverd === 4 ? "text-secondary" : ""
            }`}
        >
          My Blogs
        </Link>
        <Link
          to="/profile"
          className={`text-sm font-bold text-center hover:text-secondary ${hoverd === 5 ? "text-secondary" : ""
            }`}
        >
          Profile
        </Link>
      </div >
      }

    </div>
  );
};

export default NavBar;
