import { Link } from "react-router-dom"
const OneBlog = ({ blog }) => {
    return (
        <div className="flex-1 flex md:gap-2  flex-col w-full ">
            <h1 className="text-lg md:text-2xl font-bold text-white mb-4">{blog.title}</h1>
            <img
                src={blog.imageUrl}
                alt="Blog visual"
                className="rounded-md w-full h-64 object-cover"
            />
            <p className="text-sm md:text-base text-white font-medium mt-4 break-words">
                {blog.bigDescription.substring(0, 250)}...
            </p>
            <div className="pt-4 my-3">
                {blog.tags && blog.tags.map((b, index) => (
                    <div key={index} className="inline-block m-2 p-[2px] rounded-lg bg-gradient-to-r from-secondary to-green-500">
                        <span className="block px-3  py-1 text-white font-semibold rounded-lg bg-gray-800">{b}</span>
                    </div>
                ))}
            </div>

            <Link
                className="mt-4 font-semibold text-base md:text-lg text-secondary hover:underline"
                to={`/blog/${blog.id}`}
            >
                Read More
            </Link>
        </div>)
}

export default OneBlog