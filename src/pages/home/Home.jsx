import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-primary to-secondary px-4 sm:px-6 md:px-8">
            <h1 className="text-5xl font-extrabold text-white mb-8 text-center">
                Welcome to Our Blog Platform
            </h1>
            <p className="text-lg text-white mb-8 text-center max-w-lg">
                Explore the latest blog posts, learn new things, and stay updated with the best content. Start by either logging in or signing up!
            </p>
            <div className="flex space-x-4 mt-6">
                <Link
                    to="/signup"
                    className="px-8 py-3 text-white bg-primary rounded-lg shadow-lg  focus:outline-none focus:ring-2 focus:ring-offset-2 transform transition-all duration-300 md:hover:scale-105"
                >
                    Signup
                </Link>
                <Link
                    to="/login"
                    className="px-8 py-3 text-white  bg-secondary rounded-lg shadow-lg  focus:outline-none focus:ring-2  focus:ring-offset-2 transform transition-all duration-300 md:hover:scale-105"
                >
                    Login
                </Link>
            </div>
        </div>
    );
};

export default Home;
