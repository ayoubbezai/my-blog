import { useAuth } from "../../context/AuthContext";
import Admin from "../adminPages/Admin";
import User from "../userPages/User";


const Dashboard = () => {
    const { role } = useAuth()


    return (
        <div>
            {role === "admin" ? <Admin /> : <User />}
        </div>
    )
}
export default Dashboard