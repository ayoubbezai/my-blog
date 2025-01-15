import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to Home</h1>
            <div className="flex space-x-4">
                <Link
                    to="/signup"
                    className="px-6 py-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Signup
                </Link>
                <Link
                    to="/login"
                    className="px-6 py-3 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                    Login
                </Link>
            </div>
        </div>
    );
};

export default Home;
