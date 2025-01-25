const PenIcon = ({ onClick }) => {
    return (
        <button onClick={onClick} className="text-secondary hover:text-secondary-light">
            {/* SVG Pen Icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 inline"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 20h9"></path>
                <path d="M17 3l4 4-9 9-4-4L17 3z"></path>
            </svg>
        </button>
    );
};

export default PenIcon;
