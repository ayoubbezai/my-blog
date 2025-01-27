const Search = ({ handleSearch, searchValue, setSearchValue }) => {
    return (
        <div className="flex justify-center items-center my-8">
            <form onSubmit={handleSearch} className="relative w-full max-w-lg">
                <input
                    type="text"
                    value={searchValue} // Controlled input value
                    onChange={(e) => setSearchValue(e.target.value)} // Update state on input change
                    placeholder="Explore inspiring blogs..."
                    className="w-full px-4 py-2 text-lg rounded-full border-2 border-transparent shadow-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
                <button
                    type="submit"
                    className="absolute right-0 top-0 bottom-0 px-4 py-2 bg-gradient-to-r from-secondary to-green-500 text-white font-bold rounded-full hover:shadow-lg hover:from-green-500 hover:to-secondary transition-all duration-300"
                >
                    🔍
                </button>
            </form>
        </div>
    );
};

export default Search;
