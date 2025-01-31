import { useAuth } from "../../context/AuthContext";
import Admin from "../adminPages/main/Admin";
import User from "../userPages/main/User";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const Dashboard = () => {
    const { currentUser, setRole, role } = useAuth();
    const db = getFirestore();

    async function getRole() {
        try {
            const userRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setRole(userData.role);
            } else {
                console.error("User document does not exist");
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
        }
    }

    getRole();

    return (
        <div>
            {role === "admin" && <Admin />}
            {role === "user" && <User />}
        </div>
    );
};

export default Dashboard;
