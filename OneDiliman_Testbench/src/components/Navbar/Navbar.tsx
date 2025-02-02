import { Link } from 'react-router-dom';
import logo from "../../assets/logo/Ugnayan Logo circle wo name.png";
import "./Navbar.css";
import "../Sidebar/Sidebar";
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { DisplayName } from '../DisplayName';
import { doSignOut } from '../../firebase/auth';
import { DocumentData, doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../../FirebaseConfig";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";




function DisplayLink({ currentPage }) {
  const handleLogOut = async (event: any) => {
      await doSignOut();
      console.log("Signed out");
    window.location.href = "/";
  };

  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleOpenProfileModal = () => {
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

  const [showFAQModal, setShowFAQModal] = useState(false);

  const handleOpenFAQModal = () => {
    setShowFAQModal(true);
  };

  const handleCloseFAQModal = () => {
    setShowFAQModal(false);
  };

  const courses = ["BS Chemical Engineering", "BS Civil Engineering", "BS Computer Science", "BS Computer Engineering", "BS Electronics Engineering", "BS Electrical Engineering", "BS Geodetic Engineering", "BS Industrial Engineering", "BS Mechanical Engineering", "BS Materials Engineering", "BS Metallurgical Engineering", "BS Mining Engineering"];

  const [name, setName] = useState("Loading...");
  const [profile, setProfile] = useState("");
  const [role, setRole] = useState("Loading...");
  useEffect(() => {
      const auth = getAuth();

      onAuthStateChanged(auth, (user) => {
          if (user) {
              if (auth.currentUser?.isAnonymous) {
                  console.log("Guest")
                  setName("Guest")
              } else {
                  const uid = user.uid;
                  console.log(uid);

                  const db = getFirestore(app);
                  getDoc(doc(db, "users", uid)).then(docSnap => {
                      if (docSnap.exists()) {
                          setName(`${docSnap.data().firstName} ${docSnap.data().lastName}`)
                          setRole(`${docSnap.data().role}`)
                          setProfile(docSnap.data()) 
                      }
                  });
                  getDoc(doc(db, "organizations", uid)).then(docSnap => {
                    if (docSnap.exists()) {
                        setName(`${docSnap.data().orgName}`)
                        setRole("Org Admin")
                    }
                });
              }
          } else {
              setName("Loading...")
          }
      })
    }, [name, role]);


    if (currentPage == 'landingpage') {
      return (
      <>
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <Link to ="/">
          <img src={logo} alt="" className="d-inline-block align-middle"></img>
          UGNAYAN
          </Link>
        </a>

        <form className="d-flex align-buttons">
          <Link to ="/login">
              <button className="left-btn">
                  Log In
              </button>
          </Link> 

          <Link to ="/signup">
              <button className="right-btn">
                  Sign Up
              </button>
          </Link> 
        </form>
      </div>
      </>
      )
    }


    else if (currentPage == 'signin') {
      return (
      <>
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <Link to ="/">
          <img src={logo} alt="" className="d-inline-block align-middle"></img>
          UGNAYAN
          </Link>
        </a>

        <form className="d-flex align-buttons">
          <Link to ="/">
              <button className="left-btn">
                  Back to Home
              </button>
          </Link>

          <Link to ="/login">
              <button className="right-btn">
                  Login
              </button>
          </Link> 
        </form>
      </div>
      </>
      )
    }


    else if (currentPage =='login') {
      return (
      <>
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <Link to ="/">
          <img src={logo} alt="" className="d-inline-block align-middle"></img>
          UGNAYAN
          </Link>
        </a>

        <form className="d-flex align-buttons">
          <Link to ="/">
              <button className="left-btn">
                  Back to Home
              </button>
          </Link>

          <Link to ="/signup">
              <button className="right-btn">
                  Sign Up
              </button>
          </Link> 
          </form>
      </div>
      </>
      )
    }


    else if (currentPage =='dashboard') {
      return (
      <>
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebar" aria-controls="sidebar">
          <span className="navbar-toggler-icon"></span>
        </button>

          <Link to ="/dashboard">
          <img src={logo} alt="" className="d-inline-block align-middle"></img>
          UGNAYAN
          </Link>
        </a>

        <form className="d-flex align-buttons">
          <Dropdown>
          <Dropdown.Toggle variant="danger" id="dropdown-basic" className="custom-dropdown-button no-dropdown-icon">
            <FontAwesomeIcon icon={faBell} />
          </Dropdown.Toggle>

          <Dropdown.Menu className="aligned-dropdown-menu">
            <Dropdown.Item> 
                Notifications</Dropdown.Item>
            <Dropdown.Item href="#/action-2" disabled> 
                You have no notifications.</Dropdown.Item>
          </Dropdown.Menu>
          </Dropdown>

          <div>
            {role == "Site Admin" ? 
              <Link to ="/admin/all-users">
              <button className="right-btn">⚙️Admin</button>
              </Link> :

              <></>
            }
          </div>

          <Dropdown>
          <Dropdown.Toggle variant="danger" id="dropdown-basic" className="custom-dropdown-button menu-padding">
          {/* <DisplayName /> <span style={{ marginRight: '2px' }}></span> */}
            {name}  
            {/* <br></br>
            <div className='role'> {role} </div> */}

          </Dropdown.Toggle>
        
          <Dropdown.Menu className="aligned-dropdown-menu">
          <Dropdown.Item onClick={handleOpenProfileModal}> 
                <FontAwesomeIcon icon={faUser} /> <span style={{ marginLeft: '5px' }}> Profile </span></Dropdown.Item>
            <Dropdown.Item onClick={handleOpenFAQModal}> 
                <FontAwesomeIcon icon={faCircleQuestion} /> <span style={{ marginLeft: '5px' }}> FAQ </span></Dropdown.Item>
            <Dropdown.Item  onClick={handleLogOut}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} /> <span style={{ marginLeft: '5px' }}> Logout </span></Dropdown.Item>
          </Dropdown.Menu>
          </Dropdown>
          </form>

          <div className="modal" tabIndex="-1" role="dialog" style={{ display: showFAQModal ? 'block' : 'none' }}>
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">FAQ</h5>
                  <button type="button" className="close" onClick={handleCloseFAQModal} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                <h4>How to get an organization admin account?  </h4>
             
                <ul> 
                <li> Using your organization’s email address, send an email to <i> upugnayan@gmail.com</i> </li>
                <li> For verification purposes, make sure to use the email your organization has registered to the UP Diliman Office of Student Projects and Activities. </li>
                <li> Wait for an email reply confirming the creation of the Org Admin account specific to your Org. Account details would be sent through the email.</li>
                </ul>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseFAQModal}>Close</button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal" tabIndex="-1" role="dialog" style={{ display: showProfileModal ? 'block' : 'none' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">User Profile</h5>
                  <button type="button" className="close" onClick={handleCloseProfileModal} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                <div className="container">
                  <div className="row">
                    <div className="col-6 profile-name profile-firstname">
                      <div className='profile-label'> First Name </div>
                      {profile.firstName}
                    </div>
                    <div className="col-5 profile-name profile-lastname">
                      <div className='profile-label'> Last Name </div>
                      {profile.lastName}
                    </div>
                    <div className="col-11 profile-name profile-course">
                      <div className='profile-label'> Course</div>
                        <div className="">
                          <select
                            name="course"
                            className="profile-dropdown"
                            required
                            onChange={(e) => {
                                const newRole = e.target.value;
                                // updateCourse(profile.Id, newRole);
                              }}
                            >
                            <option selected="selected">
                              {profile.course}
                            </option>
                            {courses.map((course) => (
                              <option>{course}</option>
                            ))}
                          </select>
                        </div>
                    </div>
                    <div className="col-6 profile-name">
                      <div className='profile-label'> UP Mail </div>
                      ✉ {profile.email}
                    </div>
                    <div className="col-5 profile-name">
                      <div className='profile-label'> Student Number </div>
                      {profile.studentId}
                      </div>
                    </div>
                </div>
                <div className='row'>
                  {/* <form onSubmit={}>
                    <label>
                      Name:
                      <input type="text" value={} onChange={} />
                    </label>
                    <input type="submit" value="Submit" />
                  </form> */}
                </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseProfileModal}>Cancel</button>
                  <button type="button" className="btn btn-success" onClick={handleCloseProfileModal}> Save Changes</button>
                </div>
              </div>
            </div>
          </div>
      </div>
      </>
      )
    }

    return null;
}

export default function Navbar({ currentPage }) {

  return (
    <nav className="navbar navbar-dark sticky-top">
      <DisplayLink currentPage={currentPage}/>
    </nav>
  )
}
