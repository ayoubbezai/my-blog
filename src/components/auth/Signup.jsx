import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Alert } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
    const nameRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const confirmPasswordRef = useRef("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { signup, setRole } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            setLoading(true);
            setError("");
            const userCredential = await signup(email, password);
            const user = userCredential.user;
            setMessage("Account created successfully");
            setRole("user");
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                name,
                email,
                role: "user"
            });
            navigate("/dashboard");
        } catch (error) {
            setError(error.message.split("/")[1]);
        }
        setLoading(false);
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-primary to-secondary p-12 ">
            <div className="w-full sm:max-w-md p-4 px-8 bg-white rounded-lg shadow-md">
                <div className="text-center space-y-3 mb-4">
                    <h1 className="text-4xl font-bold text-primary">Create an account</h1>
                    <p className="text-sm text-gray-500">Enter your information to create an account</p>
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

                <form className="space-y-3" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                        <Input
                            ref={nameRef}
                            placeholder="Enter your name"
                            required
                            className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <Input
                            ref={emailRef}
                            placeholder="Enter your email"
                            required
                            className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                        <Input
                            type="password"
                            ref={passwordRef}
                            required
                            className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                        <Input
                            type="password"
                            ref={confirmPasswordRef}
                            required
                            className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-2 text-white bg-primary rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-primary"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Sign Up"}
                    </Button>
                </form>
                <div className="space-y-2 text-sm mt-4">
                    <p className="text-center text-gray-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="underline font-medium text-secondary  hover:text-primary"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
