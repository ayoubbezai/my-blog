import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext"
import { Alert } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
    const nameRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const confirmPasswordRef = useRef("");
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const { signup, setRole } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        const name = nameRef.current.value
        const email = emailRef.current.value
        const password = passwordRef.current.value
        const confirmPassword = confirmPasswordRef.current.value

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }
        try {
            setLoading(true)
            setError("")
            const userCredential = await signup(email, password)
            const user = userCredential.user
            console.log(user)
            setMessage("account created succesfully")
            setRole("user")
            const userRef = doc(db, "users", user.uid)
            await setDoc(userRef, {
                name,
                email,
                role: "user"
            })
            navigate("/dashboard")

        } catch (error) {
            setError(error.message.split("/")[1])
        }
        setLoading(false)

    }



    return (


        <div className="mx-auto max-w-sm space-y-6 my-8 ">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Create an account </h1>
                <p className="text-gray-500 dark:text-gray-400">Enter your information to create an account</p>
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

                    <Label htmlFor="name">Name</Label>
                    <Input ref={nameRef} placeholder="Enter your name" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input placeholder="Enter your email" ref={emailRef} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" ref={passwordRef} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input type="password" ref={confirmPasswordRef} required />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Loading..." : "Sign Up"}</Button>
            </form>
            <div className="space-y-2 text-sm">
                <p className="text-center text-gray-500 dark:text-gray-400">
                    Already have an account?
                    <Link to="/login" className="underline" prefetch={false}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Signup
