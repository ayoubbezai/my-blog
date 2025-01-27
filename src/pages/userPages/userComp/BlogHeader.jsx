import anonymous from "../../../assets/anonymous.png";
import { Link } from "react-router-dom";

const BlogHeader = ({blog}) => {
    return (
        <div className="flex justify-between items-center px-6 bg-gray-600">
            <div className="flex flex-row items-center gap-2  p-2 ">
                {blog.createdBy?.name ? <Link to={`/profile/${blog.createdBy?.userId}`} className="text-gray-100 text-sm md:text-base font-semibold flex  align-middle justify-center items-center gap-3 hover:underline transition-all duration-150 ease-in ">
                    <img
                        src={blog.createdBy?.photo || anonymous}
                        alt="photo"
                        className="w-10 h-10 rounded-full border-2 border-gray-300"
                    />
                    <p>{blog.createdBy?.name || 'Unknown User'}</p></Link> : <div className="text-gray-100 text-sm md:text-base font-semibold flex  align-middle justify-center items-center gap-3">
                    <img
                        src={blog.createdBy?.photo || anonymous}
                        alt="photo"
                        className="w-10 h-10 rounded-full border-2 border-gray-300"
                    />
                    <p>{blog.createdBy?.name || 'Unknown User'}</p></div>}
            </div>
            <p className="text-gray-200 text-sm md:text-base font-semibold">{blog.createdAt}</p>
        </div>
)
}

export default BlogHeader