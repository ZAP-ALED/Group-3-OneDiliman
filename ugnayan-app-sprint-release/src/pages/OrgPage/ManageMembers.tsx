import {
  fetchUserData,
  fetchOrgData,
  deleteOrg,
  addOrgData,
  editOrgDescription,
  updateRoles,
  fetchOrgMembers,
  fetchOrgApplicants,
  fetchOrgAspiringApplicants,
  promoteAspiringToApplicant,
  kickMember,
  promoteApplicantToMember,
} from "../../components/FirebaseConnection";
import Navbar from "../../components/Navbar/Navbar";
import "./ManageMembers.css";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../../FirebaseConfig";
import ManageMembersHeader from "./ManageMembersHeader";
import SearchIcon from "../AdminPage/icons/SearchIcon";
import UpIcon from "../AdminPage/icons/UpIcon";
import BinIcon from "./ManageMembersIcons/BinIcon";

export default function ManageMembers() {
  const views = [
    "Aspiring Applicants",
    "Official Applicants",
    "Official Members",
  ];
  const [org, setOrg] = useState({});
  const [apps, setApps] = useState([]);
  const [aspiringApps, setAspiringApps] = useState([]);
  const [filteredAspiringApps, setFilteredAspiringApps] = useState([]);
  const [members, setMembers] = useState([]);

  const params = useParams();

  const [searchQuery, setSearchQuery] = useState("");

  const [sortUserOrder, setSortUserOrder] = useState<"asc" | "desc">("asc");

  const handleAspiringPromotion = (uid: string, orgId: string) => {
    promoteAspiringToApplicant(uid, orgId);
    console.log("User has been promoted")
  }
  
  const handleApplicantPromotion = (uid: string, orgId: string) => {
    promoteApplicantToMember(uid, orgId);
    console.log("User has been promoted")
  }

  const handleKick = (uid: string, orgId: string) => {
    kickMember(uid, orgId);
    console.log("User has been removed")
  }


  const handleSortByName = () => {
      const sortedApps = [...aspiringApps];
      sortedApps.sort((a, b) => {
        if (sortUserOrder === "asc") {
          return a.lastName.localeCompare(b.lastName);
        } else {
          return b.lastName.localeCompare(a.lastName);
        }
      });

      console.log(aspiringApps)
      setAspiringApps(sortedApps); // Update the state with the sorted array
      setSortUserOrder(sortUserOrder === "asc" ? "desc" : "asc"); // Toggle sort order
  };


  useEffect(() => {
    const filteredAspiringApps = aspiringApps.filter((applicant) =>
      `${applicant.lastName}, ${applicant.firstName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()));

    setFilteredAspiringApps(filteredAspiringApps);
  }, [searchQuery, aspiringApps])

  

  useEffect(() => {
    setOrg({}); // Clear existing data before fetching new data
    fetchOrgData()
      .then((data) => {
        const newData = data.map((item) => ({ ...item, starred: false, id: item.id }));

        // Find the organization with the same ID as params
        const orgWithParamsId = newData.find(
          (org) => org.orgId === params.orgId
        );

        // Update state with the organization matching the ID
        if (orgWithParamsId) {
          setOrg(orgWithParamsId);
          fetchOrgMembers(orgWithParamsId.id).then((mems) => {
            setMembers(mems);
            console.log(`mems: ${mems}`)
          });
          fetchOrgApplicants(orgWithParamsId.id).then((applicants) => {
            setApps(applicants);
            console.log(`apps: ${applicants}`)
          });
          fetchOrgAspiringApplicants(orgWithParamsId.id).then((aspiringApplicants) => {
            setAspiringApps(aspiringApplicants);
            console.log(`app*: ${aspiringApplicants}`)
          });
        } else {
          console.log("Organization not found with the given ID");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); // Dependency array including params.orgId to re-run the effect when params.orgId changes


  console.log(aspiringApps);
  return (
    <div>
       <Navbar currentPage={"dashboard"}></Navbar>
      <ManageMembersHeader orgId={org.orgId} orgName={org.orgName} />
      <div className="container">
        <div className="row justify-content-between align-items-end">
          <div className="col-4 header-left">
            <div className="view-type">{params.view?.replace(/_/g, " ")}</div>
            <div className="dropdown ">
              <button
                type="button"
                className="btn dropdown-toggle change-view"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
              ></button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                {views.map((viewItem) => (
                  <li key={viewItem}>
                    <Link
                      to={`/dashboard/${
                        org.orgId
                      }/manageMembers/${viewItem.replace(/ /g, "_")}`}
                      className="dropdown-item"
                    >
                      {viewItem}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col header-right">
            <div className="search-container">
            <SearchIcon className="col-auto" />
            <input
              placeholder="Search from list"
              className="col"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col table-container">
            <div className="container ">
              <div className="row row-col-4 manage-table-row manage-row-header ">
                <div className="col-md-3 manage-row-start manage-row-start-header">
                  Name
                  <button className="a-toggle-button" onClick={handleSortByName}>
                    <UpIcon />
                  </button>
                </div>
                <div className="col-auto manage-row-mid ">Email Address</div>
                <div className="col-auto manage-row-mid ">Student Number</div>

                <div className="col-3 manage-row-end "></div>
              </div>
              {params.view === "Aspiring_Applicants" && filteredAspiringApps.map((applicant) => (
                <div className="row row-col-3 manage-table-row ">
                <div className="col-md-3 manage-row-start ">
                  <input type="checkbox" />
                  <div className="manage-table-name">{`${applicant.lastName}, ${applicant.firstName}`}</div>
                </div>
                <div className="col-auto manage-row-mid manage-row-mid-body">
                {`${applicant.email}`}
                </div>
                
                <div className="col-auto manage-row-mid ">{`${applicant.studentId}`}</div>
                <div className="col-3 manage-row-end">
                  <button className="a-toggle-button">
                    <BinIcon />
                  </button>
                  <button className="manage-row-end-button" onClick={() => handleAspiringPromotion(applicant.id, org.id)}>CONFIRM</button>
                </div>
              </div>
              ))}
              {params.view === "Official_Applicants" && apps.map((applicant) => (
                <div className="row row-col-3 manage-table-row ">
                <div className="col-md-3 manage-row-start ">
                  <input type="checkbox" />
                  <div className="manage-table-name">{`${applicant.lastName}, ${applicant.firstName}`}</div>
                </div>
                <div className="col-auto manage-row-mid manage-row-mid-body">
                {`${applicant.email}`}
                </div>
                
                <div className="col-auto manage-row-mid ">{`${applicant.studentId}`}</div>
                <div className="col-3 manage-row-end">
                  <button className="a-toggle-button">
                    <BinIcon />
                  </button>
                  <button className="manage-row-end-button" onClick={() => handleApplicantPromotion(applicant.id, org.id)}>ACCEPT</button>
                </div>
              </div>
              ))}
              {params.view === "Official_Members" && members.map((member) => (
                <div className="row row-col-3 manage-table-row ">
                <div className="col-md-3 manage-row-start ">
                  <input type="checkbox" />
                  <div className="manage-table-name">{`${member.lastName}, ${member.firstName}`}</div>
                </div>
                <div className="col-auto manage-row-mid manage-row-mid-body">
                {`${member.email}`}
                </div>
                
                <div className="col-auto manage-row-mid ">{`${member.studentId}`}</div>
                <div className="col-3 manage-row-end">
                  <button className="a-toggle-button">
                    <BinIcon />
                  </button>
                  <button className="manage-row-end-button" onClick={() => handleKick(member.id, org.id)} style={{ backgroundColor: '#8d021f'}}>KICK</button>
                </div>
              </div>
              ))}
              
            </div>
          </div>
        </div>
      </div>

      {false && (
        <div className="no-permission">
          {" "}
          You have no permission to access this page
        </div>
      )}
    </div>
  );
}
