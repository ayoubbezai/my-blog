import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const NavBar = ({ hoverd }) => {
  const { logout, getName, name, abvName, getabvName } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    getName();
    getabvName();
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex  md:flex-row bg-primary/90 text-white justify-between  items-center p-4 px-12">
      <div className={`flex items-center gap-2 ${menuOpen && "hidden"}`}>
        <h1 className="text-2xl font-bold text-secondary tracking-widest uppercase">BLOG</h1>
      </div>



      <div className={`md:flex items-center gap-6 ml-12 hidden `}>
        <ul className="flex items-center gap-6">
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
            Blogs
          </Link>
          <Link
            to="/profile"
            className={`text-base font-bold text-center hover:text-secondary ${hoverd === 3 ? "text-secondary" : ""
              }`}
          >
            Profile
          </Link>
        </ul>
      </div>

      <div className={`flex items-center gap-2 flex-row ${menuOpen && "hidden"}`}>
        <p className="text-xl font-bold text-center bg-white rounded-full w-10 h-10 flex items-center justify-center text-primary mr-4">
          {abvName}
        </p>
        <div className="flex flex-col">
          <p className="text-sm font-bold text-center">{name}</p>
          <button
            onClick={handleLogout}
            className="text-sm font-bold text-center text-secondary hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="md:hidden flex items-center ">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl text-white focus:outline-none"
        >{menuOpen ? <span className="text-3xl mr-4">&times; </span> : <span>&#9776;</span>}
        </button>
      </div>


      {menuOpen && < div className="flex justify-between items-center w-full " >
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
          Blogs
        </Link>
        <Link
          to="/profile"
          className={`text-base font-bold text-center hover:text-secondary ${hoverd === 3 ? "text-secondary" : ""
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
