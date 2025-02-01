import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { doc, getFirestore, updateDoc } from 'firebase/firestore'; // Firebase methods
import toast from 'react-hot-toast';

const AdminComments = ({ chosenBlog, setIsOpenComments, modalRefComments, fetchBlog, fetchBlogs }) => {
    const [visibleCount, setVisibleCount] = useState(4);
    const db = getFirestore(); // Firestore instance

    // Function to delete the comment
    const deleteComment = async (index) => {
        try {
            // Remove the comment by filtering it out based on the index
            const updatedComments = chosenBlog.comments.filter((_, i) => i !== index);

            // Get the reference to the blog document in Firestore
            const blogRef = doc(db, 'blogs', chosenBlog.id);

            // Update the blog document to reflect the new list of comments
            await updateDoc(blogRef, {
                comments: updatedComments,
            });

            // Display a success toast message
            toast.success('Comment deleted successfully!');
            fetchBlog(chosenBlog.id)
            fetchBlogs();

        } catch (error) {
            // If something goes wrong, show an error toast
            toast.error('Failed to delete comment');
        }
    };

    return createPortal(
        <div>
            <div className="fixed inset-0 flex justify-center bg-black bg-opacity-50 z-50">
                <div ref={modalRefComments} className="bg-white overflow-auto w-[90%] my-2 md:w-1/2 p-6 pb-0 rounded-lg shadow-lg relative">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">All comments</h2>
                        <button onClick={() => setIsOpenComments(false)} className="text-xl">X</button>
                    </div>
                    <div className="mt-4 max-h-96 overflow-auto bg-gray-200 p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-3">
                            Comments ({chosenBlog?.comments?.length || 0})
                        </h2>
                        <div className="space-y-3">
                            {chosenBlog?.comments?.slice(0, visibleCount).map((comment, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                                    <img
                                        src={comment.picture || "https://via.placeholder.com/40"}
                                        alt="User"
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        {comment.userId ? (
                                            <Link to={`/profile/${comment.userId}`} className="text-sm font-semibold text-blue-600 hover:underline">
                                                {comment.name}
                                            </Link>
                                        ) : (
                                            <p className="text-sm font-semibold">{comment.name}</p>
                                        )}
                                        <p className="text-sm text-gray-700">{comment.content}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteComment(index)}  // Delete comment on button click
                                        className="bg-red-500 text-white p-2 rounded-lg ml-auto"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                        {visibleCount < (chosenBlog?.comments?.length || 0) && (
                            <button
                                onClick={() => setVisibleCount((prev) => prev + 3)}
                                className="mt-3 w-full text-center text-blue-600 hover:text-blue-800 font-semibold text-sm"
                            >
                                See More
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AdminComments;
