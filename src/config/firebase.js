import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_31MnK_8sqhEruu7AlyxfJDCGfBp2Bpw",
  authDomain: "my-blog-2e7a8.firebaseapp.com",
  projectId: "my-blog-2e7a8",
  storageBucket: "my-blog-2e7a8.firebasestorage.app",
  messagingSenderId: "64688434916",
  appId: "1:64688434916:web:6aced2fb7339aab96806f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
