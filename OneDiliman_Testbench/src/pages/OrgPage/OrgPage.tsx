import { Link } from 'react-router-dom';
import logo from "../../assets/logo/Ugnayan Logo circle wo name.png";
import { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './OrgPage.css';
import { fetchOrgData, fetchUserAspiringApplication } from "../../components/FirebaseConnection";
import Sidebar from "../../components/Sidebar/Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faCakeCandles, faLocationDot, faEnvelope, faGlobe, faHandshakeAngle } from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import Modal from 'react-bootstrap/Modal';
import EditOrgModal from './EditOrgModal';
import OrgApplicationModal from './OrgApplicationModal';
import { onSnapshot, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from '../../FirebaseConfig';

export default function OrgPage() {
  const params = useParams();

  const [isUserAnOrgAdmin, setIsUserAnOrgAdmin] = useState(false);
  const [isUserAGuest, setIsUserAGuest] = useState(true);
  const [uid, setUid] = useState("");
  const [orgId, setOrgId] = useState("");
  const [hasUserApplied, setHasUserApplied] = useState(false);
  const [isUserASiteAdmin, setIsUserASiteAdmin] = useState(false);

  useEffect(() => {
      const auth = getAuth();

      onAuthStateChanged(auth, (user) => {
          if (user) {
              if (auth.currentUser?.isAnonymous) {
                  setIsUserAnOrgAdmin(false);
              } else {
                  const uid = user.uid;
                  setUid(uid);

                  const db = getFirestore(app);
                  setIsUserAGuest(false);
                  
                  getDoc(doc(db, "users", uid)).then(docSnap => {
                    if (docSnap.exists()) {
                        setIsUserASiteAdmin(docSnap.data().role === "Site Admin")
                    }
                });
                  getDoc(doc(db, "organization-admins", uid)).then(docSnap => {
                      if (docSnap.exists()) {
                        if (docSnap.data().orgName === params.orgId.replace(/\_/g, ' ')) { 
                          setIsUserAnOrgAdmin(true);
                        }
                      }
                  });
              }
          } else {
            setIsUserAnOrgAdmin(false);
          }
      })
    }, [isUserAnOrgAdmin, uid]);

  const [orgs, setOrgs] = useState({});
  const [orgPics, setOrgPics] = useState([]);
  const [showEditPage, setshowEditPage] = useState(false);
  const [showApplication, setshowApplication] = useState(false);

  const handleCloseEditPage = () => setshowEditPage(false);
  const handleshowEditPage = () => setshowEditPage(true)  
  const handleCloseApplication = () => setshowApplication(false);
  const handleshowApplication = () => setshowApplication(true)

  const orgLogo = orgs.orgLogo + ".jpg";
  const orgTags = orgs.orgTags;

  const [websiteName, setWebsiteName] = useState('');
  const [facebookName, setFacebookName] = useState('');

  useEffect(() => {
      if (orgs && orgs.orgWebsite) {
          const urlParts = orgs.orgWebsite.split('/');
          const name = urlParts[urlParts.length - 2];
          setWebsiteName(name);
      }
  }, [orgs]);

  useEffect(() => {
      if (orgs && orgs.orgFacebook) {
          const urlParts = orgs.orgFacebook.split('/');
          const name = urlParts[urlParts.length - 2];
          setFacebookName(name);
      }
  }, [orgs]);

  useEffect(() => {
    setOrgs({}); // Clear existing data before fetching new data
    fetchOrgData()
      .then(data => {
        const newData = data.map(item => ({ ...item, starred: false, id: item.id }));
        
        // Find the organization with the same ID as params
        const orgWithParamsId = newData.find(org => org.orgId === params.orgId);
  
        // Update state with the organization matching the ID
        if (orgWithParamsId) {
          setOrgs(orgWithParamsId);
          setOrgId(orgWithParamsId.id);

          fetchUserAspiringApplication(uid, orgWithParamsId.id).then((app) => {
            setHasUserApplied(app);
            console.log("APPLIED")
          });
        
          if (orgWithParamsId.orgPictures && orgWithParamsId.orgPictures.length > 0) {
            setOrgPics(orgWithParamsId.orgPictures);
          }
        } else {
          console.log("Organization not found with the given ID");
        }
      })
      .catch(error => {
        console.error(error);
      });

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

      const orgsListener = onSnapshot(
        collection(getFirestore(app), "organizations"),
        (snapshot) => {
          fetchOrgData()
          .then(data => {
            const newData = data.map(item => ({ ...item, starred: false }));
            
            // Find the organization with the same ID as params
            const orgWithParamsId = newData.find(org => org.orgId === params.orgId);
      
            // Update state with the organization matching the ID
            if (orgWithParamsId) {
              setOrgs(orgWithParamsId);
              if (orgWithParamsId.orgPictures && orgWithParamsId.orgPictures.length > 0) {
                setOrgPics(orgWithParamsId.orgPictures);
              }
            } else {
              console.log("Organization not found with the given ID");
            }
          })
          .catch(error => {
            console.error(error);
          });
        }
      );
        // Clean up listeners when component unmounts
        return () => {
          orgsListener();
          usersListener();
        };
  }, [hasUserApplied]); // Dependency array including params.orgId to re-run the effect when params.orgId changes

  console.log(orgs);
  console.log(hasUserApplied)

  return (
    <div> 
      <Navbar currentPage={"dashboard"}/>
      <Sidebar />

      <div className="container-md org-header-container">
        <Link to ="/dashboard">
          <button className="btn btn-light back-button">
            <FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: '0.5rem' }}/> 
            Back to Search </button>
        </Link>

        <div id="myCarousel" className="carousel slide mb-6 rounded-3" data-bs-ride="carousel">
          <div className="carousel-inner rounded-3">
            {orgPics.map((pic, index) => (
              pic && (
                <div className={`carousel-item${index === 0 ? ' active' : ''}`} key={index}>
                  <div className="carousel-image rounded-3" style={{ 
                    backgroundImage: pic ? `url(\"${pic}` + '.jpg\")' : '',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    width: '100%',
                    height: '100%'
                  }}> </div>
                </div>
              )
            ))}
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div> 

        <div className="org-header-box">
          <div className="row">
            <div className="col-md-auto"><img src={orgLogo} className="logo-img" alt="..."/></div>

            <div className="col-6 org-header-text">
              <h1 className="font-inter custom-grey">{orgs.orgName} ({orgs.orgAcronym})</h1>

              {orgTags && orgTags.length > 0 && (
              <div className='mt-4'> 
                {orgTags.map((tag, index) => {
                  let className = 'org-tags';
                  if (tag === 'non-sectarian') {
                    className += ' org-tags-non-sectarian';
                  } else if (tag === 'academic') {
                    className += ' org-tags-academic';
                  } else if (tag === 'socio-academic') {
                    className += ' org-tags-socio-academic';
                  } else if (tag === 'game-development') {
                    className += ' org-tags-socio-academic';
                  } else if (tag === 'computer science') {
                    className += ' org-tags-computer-science';
                  } else if (tag === 'non-profit') {
                    className += ' org-tags-non-profit';
                  } else if (tag === 'game development' || tag === 'gaming') {
                    className += ' org-tags-gaming';
                  } else {
                    className += ' org-tags-default';
                  }
                  return (
                    <div className={className} key={index}>
                      {tag}
                    </div>
                  );
                })}
              </div>
              )}
            </div>

            <div className="col-md-auto orgpage-options">
            {isUserAnOrgAdmin ? 
              <>
               <Link to={`/dashboard/${orgs.orgId}/manageMembers/Aspiring_Applicants`}>
              <button type="button" className="btn btn-outline-dark org-options-button"> Manage Members </button>
              </Link>


              <button type="button" className="btn btn-outline-dark org-options-button" onClick={handleshowEditPage}> Edit Page </button>
              <Modal
                show={showEditPage}
                onHide={handleCloseEditPage}
                keyboard={false}
                size="lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title id="example-modal-sizes-title-lg">
                    Edit Page
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ paddingBottom: '50px' }}>
                  <EditOrgModal handleCloseEditPage={handleCloseEditPage} />
                </Modal.Body>
              </Modal>
              </> : <></> }
            </div>
          </div>
        </div>
      </div>

      <div className='container-md orgpage-body'>
        <div className="row">
     
          <div className="col col-md-3">
            <div className="card">
              <div className="card-header about-card-header">
                About
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item"> <div className="row">
                  <div className="col-md-2 text-center"><FontAwesomeIcon icon={faCakeCandles}/></div> 
                  <div className="col-md-10 about-info"> Founded {orgs.dateFounded} </div>
                </div></li>
                <li className="list-group-item"> <div className="row">
                  <div className="col-md-2 text-center"><FontAwesomeIcon icon={faLocationDot}/></div>
                  <div className="col-md-10 about-info"> {orgs.orgLocation} </div>
                </div></li>
                <li className="list-group-item"> <div className="row">
                  <div className="col-md-2 text-center"><FontAwesomeIcon icon={faEnvelope}/></div>
                  <div className="col-md-10 about-info"> {orgs.orgEmails} </div>
                </div></li>
                <li className="list-group-item"> <div className="row">
                  <div className="col-md-2 text-center"><FontAwesomeIcon icon={faGlobe}/></div>
                  <div className="col-md-10 about-info"><a href={orgs.orgWebsite} target="_blank" rel="noopener noreferrer"> {websiteName} </a></div>
                </div></li>
                <li className="list-group-item"> <div className="row">
                  <div className="col-md-2 text-center"><FontAwesomeIcon icon={faFacebook}/></div>
                  <div className="col-md-10 about-info"><a href={orgs.orgFacebook} target="_blank" rel="noopener noreferrer"> {facebookName} </a></div>
                </div></li>
                <li className="list-group-item"> <div className="row">
                  <div className="col-md-2 text-center"><FontAwesomeIcon icon={faHandshakeAngle}/></div>
                  <div className="col-md-10 about-info"> Affiliations: {orgs.orgAffiliations} </div>
                </div></li>
              </ul>
            </div>

            {isUserAGuest || isUserAnOrgAdmin || isUserASiteAdmin ? 
              <div className="card text-center mt-3">
                <div className="card-header right-card-header">
                  Your Member Status
                </div>
                <div className="card-body">
                  <p className="card-text"> Sign up as a user to apply to this organization. </p>
                </div>
              </div>
            :
              <div className="card text-center mt-3">
                <div className="card-header right-card-header">
                  Your Member Status
                </div>
                {hasUserApplied ? <div>
                  <div className="card-body">
                    <p className="card-text">You are now an applicant in the organization.</p>
                  </div>
                </div> :
                <div className="card-body">
                  <p className="card-text"> You are not affiliated with this org. </p>
                  {orgs.openForApplications === "Open" ? (
                    <button type="button" className="btn btn-primary col-12 apply-button" onClick={handleshowApplication}> Apply Now </button>
                    // <a href="#" className="btn btn-primary col-12 apply-button"> Apply Now </a>
                  ) : (
                    <button className="btn btn-secondary col-12 apply-button" disabled> Applications Closed </button>
                  )}
                  <p className="card-text"><small className="text-muted"> 
                    {orgs.openForApplications} until Month dd, yyyy </small></p>
                </div>
                }
              </div>
            }
          </div>

          <Modal
                show={showApplication}
                onHide={handleCloseApplication}
                keyboard={false}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>
                    Application Form
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ paddingBottom: '50px' }}>
                  <OrgApplicationModal org={orgs} setHasUserApplied={setHasUserApplied} handleCloseApplication={handleCloseApplication} orgId={orgId} uid={uid}/>
                </Modal.Body>
              </Modal>

          <div className="col-md-7">
            <div className="card org-desc">
              <div className="card-body">
                <p className="card-text"> {orgs.orgDescription} </p>
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <div className="card">
              <div className="card-header right-card-header">
                Addtl. Feature
              </div>
              <div className="card-body">
                <p className="card-text"> Can add more features here (eg. statistics/analytics, members you might know, current EB, images, etc.) </p>
              </div>
            </div>

            <div className="card mt-3">
              <div className="card-header right-card-header">
                Addtl. Feature
              </div>
              <div className="card-body">
                <p className="card-text"> Can add more features here (eg. statistics/analytics, members you might know, etc.) </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      <section id="footer">
        <div className="container">
          <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
            <div className="col-md-4 d-flex align-items-center">
              <a href="/" className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1">
                <img src={logo} alt="" width="30" height="30"></img>
              </a>
              <span className="mb-3 mb-md-0 text-body-secondary">&copy; 2024</span>
            </div>

            <ul className="nav col-md-4 justify-content-end">
              <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">Home</a></li>
              <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">FAQs</a></li>
              <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">Contact Us</a></li>
              <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">About Us</a></li>
            </ul>
          </footer>
        </div>
      </section>
    </div>
  )
}