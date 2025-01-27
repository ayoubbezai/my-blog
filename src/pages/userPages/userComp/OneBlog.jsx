import { Link } from "react-router-dom"
const OneBlog = ({ blog }) => {
    return (
        <>
            <h1 className="text-base md:text-xl font-bold text-white mb-2">{blog.title}</h1>
            <img
                src={blog.imageUrl}
                alt="Blog visual"
                className="rounded-md lg:w-4/5 h-52 object-cover"
            />
            <p className="text-xs md:text-sm font-medium leading-5 text-white lg:w-4/5  mt-4 break-words">
                {blog.bigDescription.substring(0, 200)}...
            </p>
            <div className="pt-2 my-2">
                {blog.tags && blog.tags.map((b, index) => (
                    <div key={index} className="inline-block m-1 p-[1px] rounded-lg bg-gradient-to-r from-secondary to-green-500">
                        <span className="block px-2  py-1 text-xs md:text-sm  text-white font-medium rounded-lg bg-gray-800">{b}</span>
                    </div>
                ))}
            </div>

            <Link
                className="mt-4 font-medium text-sm md:text-base text-secondary hover:underline"
                to={`/blog/${blog.id}`}
            >
                Read More
            </Link>
        </>)
}

export default OneBlog