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
import { DocumentData, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../../FirebaseConfig";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

import NotificationButton from "./NotificationButton";

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

  const [name, setName] = useState("Loading...");
  const [profile, setProfile] = useState<DocumentData | null>(null);
  const [role, setRole] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");
  const [editableCollege, setEditableCollege] = useState("");
  const [editableCourse, setEditableCourse] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  // Define college and course options
  const collegeCourses = {
    "College of Architecture": [
      "BS Landscape Architecture",
      "BS Architecture",
    ],
    "College of Arts and Letters": [
      "BA Art Studies",
      "BA Comparative Literature",
      "BA Creative Writing",
      "BA English Studies",
      "BA European Languages",
      "BA Araling Pilipino",
      "BA Filipino",
      "BA Malikhaing Pagsulat sa Filipino",
      "BA Speech Communication",
      "BA Theatre Arts",
    ],
    "Asian Institute of Tourism": ["BS Tourism"],
    "College of Business Administration": [
      "BS Business Administration",
      "BS Business Administration & Accountancy",
    ],
    "School of Economics": ["BS Business Economics", "BS Economics"],
    "College of Education": ["BS Elementary Education", "BS Secondary Education"],
    "College of Engineering": [
      "BS Civil Engineering",
      "BS Chemical Engineering",
      "BS Computer Science",
      "BS Computer Engineering",
      "BS Electrical Engineering",
      "BS Electronics & Communications Engineering",
      "BS Geodetic Engineering",
      "BS Industrial Engineering",
      "BS Mechanical Engineering",
      "BS Materials Engineering",
      "BS Metallurgical Engineering",
      "BS Mining Engineering",
    ],
    "College of Fine Arts": [
      "BFA Painting",
      "BFA Sculpture",
      "BFA Art Education",
      "BFA Art History",
      "BFA Industrial Design",
      "BFA Visual Communication",
    ],
    "College of Home Economics": [
      "BS Interior Design",
      "BS Clothing Technology",
      "BS Family Life & Child Development",
      "BS Community Nutrition",
      "BS Food Technology",
      "BS Home Economics",
      "BS Hotel, Restaurant & Institution Management",
    ],
    "College of Human Kinetics": ["BS Physical Education", "BS Sports Science"],
    "School of Library and Information Studies": ["BS Library & Information Science"],
    "College of Mass Communication": [
      "BA Broadcast Communication",
      "BA Communication Research",
      "BA Film",
      "BA Journalism",
    ],
    "College of Music": ["BM Music"],
    "National College of Public Administration & Governance": ["BA Public Administration"],
    "College of Science": [
      "BS Biology",
      "BS Chemistry",
      "BS Mathematics",
      "BS Molecular Biology & Biotechnology",
      "BS Geology",
      "BS Applied Physics",
      "BS Physics",
    ],
    "College of Social Sciences and Philosophy": [
      "BA Anthropology",
      "BS Geography",
      "BA History",
      "BA Linguistics",
      "BA Philosophy",
      "BA Political Science",
      "BA Psychology",
      "BS Psychology",
      "BA Sociology",
    ],
    "College of Social Work and Community Development": [
      "BS Community Development",
      "BS Social Work",
    ],
    "School of Statistics": ["BS Statistics"],
  };

  // Get the list of colleges for the dropdown
  const collegeOptions = Object.keys(collegeCourses);

  // Get the courses for the selected college
  const getCoursesForCollege = (college: string) => {
    return college ? collegeCourses[college] || [] : [];
  };

  const handleSaveChanges = async () => {
    if (!profile) return;
    
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) return;
    
    try {
      const db = getFirestore(app);
      const userDocRef = doc(db, "users", user.uid);
      
      await updateDoc(userDocRef, {
        college: editableCollege,
        course: editableCourse
      });
      
      setIsEditing(false);
      handleCloseProfileModal();
      
      // Refresh user data
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      });
      
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  // Update available courses when college selection changes
  useEffect(() => {
    if (isEditing && editableCollege) {
      // If the current course is not in the new college's course list, reset it
      const coursesForCollege = getCoursesForCollege(editableCollege);
      if (!coursesForCollege.includes(editableCourse)) {
        setEditableCourse("");
      }
    }
  }, [editableCollege, isEditing]);

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
              const userData = docSnap.data();
              setName(`${userData.firstName} ${userData.lastName}`)
              setRole(`${userData.role}`)
              setProfile(userData)
              setEmail(userData.email)
              setEditableCollege(userData.college || "")
              setEditableCourse(userData.course || "")
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
  }, []);


  if (currentPage == 'landingpage') {
    return (
    <>
    <div className="container-fluid">
      <a className="navbar-brand" href="#">
        <Link to ="/">
        <img src={logo} alt="" className="d-inline-block align-middle"></img>
        OneDiliman
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
        OneDiliman
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
        OneDiliman
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
        OneDiliman
        </Link>
      </a>

      <form className="d-flex align-buttons">
      <NotificationButton />

      <div>
        {role == "Site Admin" ? 
          <Link to ="/admin/all-users">
          <button className="right-btn">⚙️Admin</button>
          </Link> :

          <></>
        }
      </div>

        <Dropdown>
        <Dropdown.Toggle variant="danger" id="dropdown-basic" className="custom-dropdown-button menu-padding" data-testid="profile-dropdown">
          {name}  
        </Dropdown.Toggle>
      
        <Dropdown.Menu className="aligned-dropdown-menu">
          {/* Conditionally render the Profile option */}
          {role !== "Org Admin" && (
            <Dropdown.Item onClick={handleOpenProfileModal}>
              <FontAwesomeIcon icon={faUser} /> <span style={{ marginLeft: '5px' }}> Profile </span>
            </Dropdown.Item>
          )}
          <Dropdown.Item  onClick={handleLogOut} data-testid="logout-button">
              <FontAwesomeIcon icon={faArrowRightFromBracket} /> <span style={{ marginLeft: '5px' }}> Logout </span></Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
        </form>


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
                  <div className="col-4 profile-name profile-firstname">
                    <div className='profile-label'> First Name </div>
                    {profile?.firstName || ""}
                  </div>
                  <div className="col-3 profile-name profile-middlename">
                    <div className='profile-label'> Middle Name </div>
                    {profile?.middleName || ""}
                  </div>
                  <div className="col-4 profile-name profile-lastname">
                    <div className='profile-label'> Last Name </div>
                    {profile?.lastName || ""}
                  </div>
                  
                  <div className="col-5 profile-name">
                    <div className='profile-label'> Student Number </div>
                    <span>{profile?.studentId || ""}</span>
                  </div>

                  <div className="col-5 profile-name">
                  <div className='profile-label'> UP Mail </div>
                    <span>{profile?.email}</span>
                  </div>
        
                  
                  <div className="col-5 profile-name">
                    <div className='profile-label'> College </div>
                    {isEditing ? (
                      <select
                        className="form-control"
                        value={editableCollege}
                        onChange={(e) => setEditableCollege(e.target.value)}
                      >
                        <option value="">Select College</option>
                        {collegeOptions.map((college) => (
                          <option key={college} value={college}>
                            {college}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{profile?.college || ""}</span>
                    )}
                  </div>
                  
                  <div className="col-6 profile-name profile-course">
                    <div className='profile-label'> Course </div>
                    {isEditing ? (
                      <select
                        className="form-control"
                        value={editableCourse}
                        onChange={(e) => setEditableCourse(e.target.value)}
                        disabled={!editableCollege}
                      >
                        <option value="">Select Course</option>
                        {getCoursesForCollege(editableCollege).map((course) => (
                          <option key={course} value={course}>
                            {course}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{profile?.course || ""}</span>
                    )}
                  </div>
                  

                </div>
              </div>
              </div>
              <div className="modal-footer">
                {isEditing ? (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                    <button type="button" className="btn btn-success" onClick={handleSaveChanges}>Save Changes</button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={handleCloseProfileModal}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                  </>
                )}
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
