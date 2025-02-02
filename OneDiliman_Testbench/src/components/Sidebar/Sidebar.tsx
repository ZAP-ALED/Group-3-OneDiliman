import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import "./Sidebar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from '../../FirebaseConfig';

function Sidebar({ orgs=[] , toggleStarred }) {

  const starredOrgs = orgs.filter(org => (org.starred));

    const handleStarClick = (orgId) => {
      toggleStarred(orgId);
  };

  const [isUserAGuest, setIsUserAGuest] = useState(true);
  useEffect(() => {
      const auth = getAuth();

      onAuthStateChanged(auth, (user) => {
          if (user) {
              if (auth.currentUser?.isAnonymous) {
                  setIsUserAGuest(true);
              } else {
                setIsUserAGuest(false);
              }
          } else {
            setIsUserAGuest(true);
          }
      })
    }, [isUserAGuest]);


    return (
      <div className="offcanvas offcanvas-start Sidebar" data-bs-scroll="true" data-bs-backdrop="false" tabIndex={-1} id="sidebar" aria-labelledby="sidebarLabel">
        {isUserAGuest ? <div className="sidebar-header"> Sign up to access </div> :
        <>
          <div className="sidebar-header"> My Orgs </div>
  
            {/* just a concept test/not yet functional and responsive */}
            <div className="accordion" id="accordionPanelsStayOpenExample">
              <div className="accordion-item">
                <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                  <button className="accordion-button sidebar-header" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                    Org #1
                    <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: 'auto', color: '#444444', fontSize: '0.8em'}} />
                  </button>
                </h2>
                <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne">
                  <div className="accordion-body">
                    Step Down from Role
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                  <button className="accordion-button sidebar-header" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                    Org #2
                    <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: 'auto', color: '#444444', fontSize: '0.8em'}} />
                  </button>
                </h2>
                <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
                  <div className="accordion-body">
                    Leave Organization
                  </div>
                </div>
              </div>
            </div>

          <div className="sidebar-header"> Starred Orgs </div>
            <div >
                {starredOrgs.map((org, index) => (

                  <div className='starred-org-entry row'>
                    <Link key={index} to={`/dashboard/${org.orgId}`}>
                    {org.orgAcronym}
                    </Link>
                    <div className='favorites-button-sidebar'>
                      <button
                        type="button"
                        className="btn star-button"
                        onClick={() => handleStarClick(org.orgId)}
                        >
                        {org.starred ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="orange" className="bi bi-star-fill" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                          </svg>
                      )}
                      
                      </button>
                  </div>
                      </div>
                ))}
            </div>
        </>
        }
      </div>
    )
}

export default Sidebar