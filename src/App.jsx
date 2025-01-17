import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Use Routes and Route in v6
import { AuthProvider } from "./context/AuthContext";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Home from "./pages/home/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import Blogs from "./pages/userPages/blogs/Blogs";
import ProtectedRouteUser from "./utils/ProtectedUser";
import ProtectedRouteAdmin from "./utils/ProtectedAdmin";
import BlogsEdit from "./pages/adminPages/blogsedit/BlogsEdit";
import Profile from "./pages/commonPages/profile/Profile";
import BlogDetails from "./pages/userPages/blogDetails/BlogDetails"
function App() {
  return (
    < Router >
      <   AuthProvider>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />


          </Route>
          <Route element={<ProtectedRouteUser />}>
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog/:id" element={<BlogDetails />} />

          </Route>
          <Route element={<ProtectedRouteAdmin />}>
            <Route path="/blogsedit" element={<BlogsEdit />} />

          </Route>

        </Routes>
      </AuthProvider>


    </Router >
  );
}

export default App;