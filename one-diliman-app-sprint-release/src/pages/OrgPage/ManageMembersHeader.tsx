import { Link } from "react-router-dom";
import LeftIcon from "../AdminPage/icons/LeftIcon";

interface headerProps {
  orgId?: string;
  orgName?: string;
}
const ManageMembersHeader = ({ orgId, orgName }: headerProps) => {
  return (
    <div className="manage-title-container">
      <div className="manage-title">
        <div className="manage-title-text">{orgName}</div>
        <Link to={`/dashboard/${orgId}`}>
          <button className="btn">
            <LeftIcon />
            Back to Org Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ManageMembersHeader;
