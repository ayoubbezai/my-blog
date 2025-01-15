import { useAuth } from "../../context/AuthContext";
import Admin from "../adminPages/main/Admin";
import User from "../userPages/main/User";
import { getFirestore, doc, getDoc } from "firebase/firestore";


const Dashboard = () => {

    const { currentUser, setRole, role } = useAuth()
    const db = getFirestore()
    async function getRole() {
        const userRef = doc(db, "users", currentUser.uid)
        const userDoc = await getDoc(userRef)
        const userData = userDoc.data()
        setRole(userData.role)
    }


    getRole()

    return (
        <div>
            {role === "admin" && <Admin />}
            {role === "user" && <User />}
        </div>
    )
}
export default Dashboard