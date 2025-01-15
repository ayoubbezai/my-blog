import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext"
import { Alert } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, setRole } = useAuth()
  const navigate = useNavigate()
  async function handleSubmit(e) {
    e.preventDefault()
    const name = nameRef.current.value
    const email = emailRef.current.value
    const password = passwordRef.current.value
    try {
      setLoading(true)
      setError("")
      const userCredential = await login(email, password)
      const user = userCredential.user
      setMessage("account logged in succesfully")
      const userRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userRef)
      const userData = userDoc.data()
      setRole(userData.role)
      navigate("/dashboard")
      console.log(userData.role)

    } catch (error) {
      setError(error.message.split("/")[1])
    }
    setLoading(false)

  }



  return (


    <div className="mx-auto max-w-sm space-y-6 my-8 ">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login to your account </h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your information to login to your account</p>
      </div>

      {error && (
        <Alert variant="destructive" className="text-sm p-2 text-center">
          {error}
        </Alert>
      )}
      {(message && !error) && (
        <Alert variant="success" className="text-sm p-2 text-green-500 text-center">
          {message}
        </Alert>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input placeholder="Enter your email" ref={emailRef} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input type="password" ref={passwordRef} required />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Loading..." : "Login"}</Button>
      </form>
      <div className="space-y-2 text-sm">
        <p className="text-center text-gray-500 dark:text-gray-400">
          Don't have an account?
          <Link to="/signup" className="underline" prefetch={false}>
            Signup
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login