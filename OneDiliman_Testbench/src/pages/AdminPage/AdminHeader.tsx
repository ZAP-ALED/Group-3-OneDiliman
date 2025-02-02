import { Link } from "react-router-dom";
import LeftIcon from "./icons/LeftIcon";
const AdminHeader = () => {
  return (
    
    <div className=" admin-title-container">
          <div className="admin-title">
            <div className="admin-title-text">Admin Dashboard</div>
            <Link to="/dashboard">
              <button className="btn">
                <LeftIcon />
                Back to Main Dashboard
              </button>
            </Link>
          </div>
        </div>
  )
}

export default AdminHeader
