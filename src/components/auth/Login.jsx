import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Alert } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, setRole, currentUser } = useAuth();
  const navigate = useNavigate();

  if (currentUser) {
    navigate("/dashboard")
  }



  async function handleSubmit(e) {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    try {
      setLoading(true);
      setError("");
      const userCredential = await login(email, password);
      const user = userCredential.user;
      setMessage("Account logged in successfully");
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      setRole(userData.role);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message.split("/")[1]);
    }
    setLoading(false);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-primary to-secondary p-12">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg ">
        <div className="text-center space-y-4 mb-6">
          <h1 className="text-4xl font-bold text-primary">Login to your account</h1>
          <p className="text-gray-500">Enter your information to login to your account</p>
        </div>

        {error && (
          <Alert variant="destructive" className="text-sm p-2 text-center mb-4">
            {error}
          </Alert>
        )}
        {message && !error && (
          <Alert variant="success" className="text-sm p-2 text-center mb-4 text-green-500">
            {message}
          </Alert>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              placeholder="Enter your email"
              ref={emailRef}
              required
              className="p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Input
              type="password"
              ref={passwordRef}
              required
              className="p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-4 text-white bg-primary rounded-md shadow-lg hover:bg-primary-dark focus:ring-2 focus:ring-primary"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>

        <div className="space-y-3 text-sm mt-6">
          <p className="text-center text-gray-500">
            Don`t have an account?{" "}
            <Link to="/signup" className="underline font-medium text-secondary hover:text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
