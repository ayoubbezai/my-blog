import {
  getFirestore,
  doc,
  collection,
  updateDoc,
  query,
  limit,
  startAfter,
  getDocs,
  getDoc,
} from "firebase/firestore";

const db = getFirestore();
const collectionBlogs = collection(db, "blogs");
const collectionUsers = collection(db, "users");

// Function to fetch the total blog count
export const fetchTotalBlogsCount = async () => {
  const snapshot = await getDocs(collectionBlogs);
  return snapshot.size;
};

// Function to fetch user data
export const fetchUser = async (id, setUser) => {
  try {
    const userRef = doc(db, "users", id);
    const userData = await getDoc(userRef);
    setUser(userData.data());
  } catch {
    console.log("error");
  }
};

// Function to fetch a specific blog data
export const fetchoneBlog = async (id, setLimitBlogs) => {
  try {
    const blogRef = doc(db, "blogs", id);
    const blogSnapshot = await getDoc(blogRef);
    if (blogSnapshot.exists()) {
      const blogData = blogSnapshot.data();
      setLimitBlogs((prevBlogs) => {
        const updatedBlogs = prevBlogs.map((blog) =>
          blog.id === id ? { ...blog, ...blogData } : blog
        );
        return updatedBlogs;
      });
    } else {
      console.log("No such blog found!");
    }
  } catch (error) {
    console.error("Error fetching the blog:", error);
  }
};

// Helper function for updating Firestore
const updateFirestore = async (docRef, data) => {
  try {
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating Firestore:", error);
    throw new Error("Firestore update failed");
  }
};

// Function to handle liking a blog
// Refactored like function using shared updateFirestore helper
export const like = async (
  id,
  currentUser,
  memoizedBlogs,
  user,
  setUser,
  setLiked,
  setLimitBlogs
) => {
  const likedBlogs = user.likedBlogs;
  const blog = memoizedBlogs.find((b) => b.id === id);
  const updatedLikes = likedBlogs.includes(id)
    ? blog.likes - 1
    : blog.likes + 1;

  try {
    // Update the user's likedBlogs array
    await updateFirestore(doc(collectionUsers, currentUser.uid), {
      likedBlogs: likedBlogs.includes(id)
        ? likedBlogs.filter((b) => b !== id)
        : [...likedBlogs, id],
    });

    // Update the blog's likes count
    await updateFirestore(doc(collectionBlogs, id), { likes: updatedLikes });

    // Update state accordingly
    setLiked(
      likedBlogs.includes(id)
        ? likedBlogs.filter((b) => b !== id)
        : [...likedBlogs, id]
    );
    fetchoneBlog(id, setLimitBlogs);
    fetchUser(currentUser.uid, setUser);
  } catch (error) {
    console.error("Error handling like:", error);
  }
};

// Refactored comments function using shared updateFirestore helper
export const comments = async (
  id,
  memoizedBlogs,
  currentUser,
  user,
  commentState,
  setCommentState
) => {
  const blog = memoizedBlogs.find((b) => b.id === id);
  const prevComments = blog.comments || [];
  const newComment = {
    name: user.name,
    content: commentState[id],
    picture: user.profile,
    userId: currentUser.uid,
  };

  if (!newComment.content.trim()) {
    return;
  }

  try {
    // Update the blog's comments array
    await updateFirestore(doc(collectionBlogs, id), {
      comments: [...prevComments, newComment],
    });

    // Clear the comment input after posting
    setCommentState((prevState) => ({ ...prevState, [id]: "" }));
  } catch (error) {
    console.error("Error updating comments:", error);
  }
};

// Function to fetch limited data from a collection
export const fetchLimitData = async (limitCount, startDoc = null) => {
  try {
    let q = query(collectionBlogs, limit(limitCount));
    if (startDoc) {
      q = query(q, startAfter(startDoc));
    }
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { data, lastVisibleDoc };
  } catch (error) {
    console.error("Error fetching limited data:", error);
  }
};

// Function to fetch more blogs
export const fetchMoreBlogs = async (
  memoizedLastVisible,
  totalBlogs,
  limitBlogs,
  setLimitBlogs,
  setLastVisible,
  setHasMore
) => {
  const { data, lastVisibleDoc } = await fetchLimitData(3, memoizedLastVisible);

  setLimitBlogs((prevBlogs) => [...prevBlogs, ...data]);

  const blogNumber = data.length + limitBlogs.length;

  if (blogNumber >= totalBlogs) {
    setHasMore(false);
  } else {
    setHasMore(true);
  }
  setLastVisible(lastVisibleDoc);
};

export const fetchBlogsByIds = async (ids, colloctionName) => {
  try {
    const blogPromises = ids.map((id) => getDoc(doc(db, colloctionName, id)));
    const blogSnapshots = await Promise.all(blogPromises);

    // Filter out any undefined blogs or invalid IDs
    const blogs = blogSnapshots
      .filter((snapshot) => snapshot.exists()) // Ensure the document exists
      .map((snapshot) => ({ id: snapshot.id, ...snapshot.data() })); // Convert snapshot to data
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs by IDs:", error);
  }
};
