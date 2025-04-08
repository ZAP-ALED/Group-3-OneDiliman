import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./Sidebar.css";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../FirebaseConfig';

function Sidebar({ orgs = [], toggleFollowed }) {
  const [followedOrgs, setFollowedOrgs] = useState([]);
  const [isUserAGuest, setIsUserAGuest] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore(app);

    // Check if the user is authenticated and fetch followed organizations
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (auth.currentUser?.isAnonymous) {
          setIsUserAGuest(true);
        } else {
          setIsUserAGuest(false);

          // Fetch followed organizations from Firestore
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFollowedOrgs(userData.followedOrgs || []);
          }
        }
      } else {
        setIsUserAGuest(true);
      }
    });
  }, []);

  const handleFollowClick = (orgId) => {
    toggleFollowed(orgId);
  };

  return (
    <div
      className="offcanvas offcanvas-start Sidebar"
      data-bs-scroll="true"
      data-bs-backdrop="false"
      tabIndex={-1}
      id="sidebar"
      aria-labelledby="sidebarLabel"
    >
      {isUserAGuest ? (
        <div className="sidebar-header">Sign up to access</div>
      ) : (
        <>
          <div className="sidebar-header">Followed Organizations</div>
          <div>
            {followedOrgs.map((orgId, index) => {
              const org = orgs.find((o) => o.orgId === orgId); // Find the organization details
              if (!org) return null; // Skip if organization details are not found

              return (
                <div className="followed-org-entry row" key={index}>

                  {/* Organization name */}
                  <Link to={`/dashboard/${org.orgId}`} className="org-name">
                    {org.orgName}
                  </Link>
                  </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Sidebar;