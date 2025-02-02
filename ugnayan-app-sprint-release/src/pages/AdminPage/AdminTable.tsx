import "./AdminTable.css";
import SearchIcon from "./icons/SearchIcon";
import UpIcon from "./icons/UpIcon";
import {
  fetchUserData,
  fetchOrgData,
  fetchOrgAccountData,
  deleteOrg,
  updateRoles,
} from "../../components/FirebaseConnection";

import "./AdminPage.css";
import { useState, useEffect } from "react";
import { getFirestore } from "firebase/firestore";
import { app } from "../../FirebaseConfig";
import { onSnapshot, collection } from "firebase/firestore";
import EditIcon from "./icons/EditIcon";
import ArchiveIcon from "./icons/ArchiveIcon";
import AdminModal from "./AdminModal";
import toast, { Toaster } from 'react-hot-toast';

interface AdminTableProps {
  view: string | undefined;
}

const AdminTable = ({ view }: AdminTableProps) => {
  const [orgs, setOrgs] = useState<
    { orgName: string; orgDescription: string; id: string }[]
  >([]);
  const [users, setUsers] = useState<
    { name: string; role: string; id: string }[]
  >([]);
  const [orgDetails, setOrgDetails] = useState<
    { orgName: string; orgEmail: string; id: string }[]
  >([]);
  const [filteredUsers, setFilteredUsers] = useState<
    { name: string; role: string; id: string }[]
  >([]);

  const [filteredOrgs, setFilteredOrgs] = useState<
    { orgName: string; orgDescription: string; id: string }[]
  >([]);

  const [filteredOrgDetails, setfilteredOrgDetails] = useState<
    { orgName: string; orgEmail: string; id: string }[]
  >([]);

  const [sortUserOrder, setSortUserOrder] = useState<"asc" | "desc">("asc");
  const [sortOrgOrder, setSortOrgOrder] = useState<"asc" | "desc">("asc");

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Filter users based on search query whenever it changes
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredUsers(filtered);

    const filteredOrg = orgs.filter((org) =>
      org.orgName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredOrgs(filteredOrg);

    const filteredOrgDetails = orgDetails.filter(
      (orgDetail) =>
        orgDetail.orgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        orgDetail.orgEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setfilteredOrgDetails(filteredOrgDetails);
  }, [searchQuery, users, orgs, orgDetails]);

  const handleSortByName = () => {
    if (view === "organizations") {
      const sortedOrgs = [...orgs];
      sortedOrgs.sort((a, b) => {
        if (sortOrgOrder === "asc") {
          return a.orgName.localeCompare(b.orgName);
        } else {
          return b.orgName.localeCompare(a.orgName);
        }
      });
      setFilteredOrgs(sortedOrgs);
      setSortOrgOrder(sortOrgOrder === "asc" ? "desc" : "asc");
    } else {
      const sortedUsers = [...filteredUsers];
      sortedUsers.sort((a, b) => {
        if (sortUserOrder === "asc") {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
      setFilteredUsers(sortedUsers);
      setSortUserOrder(sortUserOrder === "asc" ? "desc" : "asc");
    }
  };

  useEffect(() => {
    // Function to fetch initial organization data
    const fetchInitialOrgData = async () => {
      try {
        const data = await fetchOrgData();
        const newData = data.map((org) => ({
          orgName: org.orgName,
          orgDescription: org.orgDescription,
          id: org.id,
        }));
        setOrgs(newData);
      } catch (error) {
        console.error(error);
      }
    };

    // Function to fetch initial user data
    const fetchInitialUserData = async () => {
      try {
        const data = await fetchUserData();
        const newData = data.map((user) => ({
          name: user.lastName.concat(", ", user.firstName),
          role: user.role,
          id: user.id,
        }));
        setUsers(newData);
      } catch (error) {
        console.error(error);
      }
    };

    // Function to fetch initial org-emails data
    const fetchInitialOrgAccountData = async () => {
      try {
        const data = await fetchOrgAccountData();

        const newData = data.map((org) => ({
          orgEmail: org.orgConnectedEmail,
          orgName: org.orgName,
          id: org.id,
        }));

        setOrgDetails(newData);
        console.log(orgDetails);
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch initial data when component mounts
    fetchInitialOrgAccountData();
    fetchInitialOrgData();
    fetchInitialUserData();

    // Set up real-time listener for organizations
    const orgsListener = onSnapshot(
      collection(getFirestore(app), "organizations"),
      (snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
          orgName: doc.data().orgName,
          orgDescription: doc.data().orgDescription,
          id: doc.id,
        }));
        setOrgs(newData);
      }
    );

    // Set up real-time listener for users
    const usersListener = onSnapshot(
      collection(getFirestore(app), "users"),
      (snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
          name: doc.data().lastName.concat(", ", doc.data().firstName),
          role: doc.data().role,
          id: doc.id,
        }));
        setUsers(newData);
      }
    );

    const orgDetailsListener = onSnapshot(
      collection(getFirestore(app), "organization-admins"),
      (snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
          orgName: doc.data().orgName,
          orgEmail: doc.data().orgConnectedEmail,
          id: doc.id,
        }));
        setOrgDetails(newData);
      }
    );

    // Clean up listeners when component unmounts
    return () => {
      orgsListener();
      usersListener();
      orgDetailsListener();
    };
  }, []);

  useEffect(() => {
    if (view === "students") {
      setFilteredUsers(users.filter((user) => user.role === "User"));
    } else if (view === "org-admins") {
      setFilteredUsers(users.filter((user) => user.role === "Org Admin"));
    } else if (view === "site-admins") {
      setFilteredUsers(users.filter((user) => user.role === "Site Admin"));
    } else {
      setFilteredUsers(users);
    }
  }, [view, users]);

  console.log(view);
  console.log(filteredUsers);

  // --------- promises for checking edit success --------------
  function deleteOrgWithPromise(orgId, orgName, orgDescription) {
    return new Promise((resolve, reject) => {
      deleteOrg(orgId, orgName, orgDescription)
        .then(() => {
          resolve('Organization has been archived.');
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  return (
    <div className="container admin-table">
      <Toaster
        toastOptions={{
          success: {
            style: {
              border: '1px solid #005538',
              color: '#005538',
            },
            iconTheme: {
              primary: '#005538',
              secondary: '#FFFAEE',
            },
          },
        }}
      />
      <div className="row row-col-3 admin-table-row admin-row-header ">
        <div className="col-md-3 admin-row-start admin-row-start-header">
          Name
          <button className="a-toggle-button" onClick={handleSortByName}>
            <UpIcon />
          </button>
        </div>
        <div className="col-auto admin-row-mid ">
          {(() => {
            if (view === "organizations") {
              return "Description";
            } else if (view === "org-admins") {
              return "Email";
            } else {
              return "Role";
            }
          })()}
        </div>
        <div className="col-3 admin-row-end ">
          <div className="row admin-search ">
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
      {view !== "organizations" && view !== "org-admins" && (
        <>
          {filteredUsers.map((user) => (
            <div className="row row-col-3 admin-table-row ">
              <div className="col-md-3 admin-row-start ">
                <input type="checkbox" />
                <div className="admin-table-name">{user.name}</div>
              </div>
              <div className="col-auto admin-row-mid admin-row-mid-body">
                {user.role}
                <button
                  type="button"
                  className="btn"
                  data-bs-toggle="modal"
                  data-bs-target={`#staticBackdropEdit${user.id}`}
                >
                  <EditIcon />
                </button>
              </div>
              <div className="col-3 admin-row-end">
              {user.role !== "Org Admin" && (
                  <select
                    className="btn"
                    onChange={(e) => {
                      const newRole = e.target.value;
                      updateRoles(user.id, newRole);
                    }}
                  >
                    <option selected disabled value="">
                      Change Role
                    </option>
                    <option>User</option>
                    <option>Site Admin</option>
                  </select>
              )}
              </div>
              <AdminModal modalType="Edit" view={view} userId={user.id} userName={user.name} />
            </div>
          ))}
        </>
      )}

      {view === "org-admins" && (
        <>
          {filteredOrgDetails.map((orgDetails) => (
            <div className="row row-col-3 admin-table-row ">
              <div className="col-md-3 admin-row-start ">
                <input type="checkbox" />
                <div className="admin-table-name">{orgDetails.orgName}</div>
              </div>
              <div className="col-auto admin-row-mid admin-row-mid-body">
                {orgDetails.orgEmail}
                <button
                  type="button"
                  className="btn"
                  data-bs-toggle="modal"
                  data-bs-target={`#staticBackdropEdit${orgDetails.id}`}
                >
                  <EditIcon />
                </button>
              </div>
              <AdminModal
                modalType="Edit"
                view={view}
                userId={orgDetails.id}
                orgName={orgDetails.orgName}
                orgEmail={orgDetails.orgEmail}
              />
            </div>
          ))}
        </>
      )}
      {view === "organizations" && (
        <>
          {filteredOrgs.map((org) => (
            <div key={org.id} className="row row-col-3 admin-table-row">
              <div className="col-md-3 admin-row-start">
                <input type="checkbox" />
                <div className="admin-table-name">{org.orgName}</div>
              </div>
              <div className="col-auto admin-row-mid admin-row-mid-body">
                <div className="admin-row-mid-text">{org.orgDescription}</div>
                <button
                  type="button"
                  className="btn"
                  data-bs-toggle="modal"
                  data-bs-target={`#staticBackdropEdit${org.id}`}
                >
                  <EditIcon />
                </button>
              </div>
              <div className="col-3 admin-row-end">
                <button
                  className="btn"
                  data-bs-toggle="modal"
                  data-bs-target={`#deleteModal${org.id}`}
                >
                  <ArchiveIcon />
                </button>
                    
                <div
                  className="modal fade"
                  id={`deleteModal${org.id}`}
                  role="dialog"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">
                          Are you sure you want to delete{" "}
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">{org.orgName}</div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() =>
                            deleteOrgWithPromise(org.id, org.orgName, org.orgDescription)
                              .then(message => {
                                toast.success(message);
                              })
                              .catch(error => {
                                toast.error('Failed to archive organization: ' + error.message);
                              })
                          }
                          data-bs-dismiss="modal"
                        >
                          Confirm Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                        
              <AdminModal
                modalType="Edit"
                view={view}
                orgId={org.id}
                orgName={org.orgName}
                orgDescription={org.orgDescription}
              />
            </div>
          ))}

        </>
      )}
    </div>
  );
};

export default AdminTable;
