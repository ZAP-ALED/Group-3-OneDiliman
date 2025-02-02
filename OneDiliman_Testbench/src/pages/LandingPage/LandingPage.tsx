import { Link } from 'react-router-dom';
import logo from "../../assets/logo/Ugnayan Logo circle wo name.png";
import Navbar from '../../components/Navbar/Navbar';
import './LandingPage.css';

export default function LandingPage() {
    return (
      <div> 
        <Navbar currentPage={"landingpage"}/>
        <section id="welcome">
          <div className="container-fluid">
            <div className="row">
              <div className="col text-center">
                <h5 className="welcome-to">WELCOME TO</h5>
                <h1 className="display-1 ugnayan-text mb-0">UGNAYAN</h1>
                <h3 className="gateway">Your gateway to UP Org Culture</h3>
              </div>
            </div>
          </div>
          <div className="container-fluid p-0">
            <div className="d-flex align-items-center justify-content-center intro-img-container">
              <img src="/src/assets/UP-Org-Fair-by-Jerald-Caranza.jpg" className="img-fluid" alt="Main Image"></img>
              <a href="https://upd.edu.ph/f2f-freshman-activities-return/" target="_blank">
                <div className="description"><p>The UP Org Fair. Photo by Jerald DJ. Caranza, UPDIO</p></div>
              </a>
              <div className="gradient-bg"></div>
              <div className='intro'>
                <a href="#intro-text">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#8D021F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-chevron-down">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="intro-text">
          <div className="container-fluid ending-section">
            <div className="row">
              <div className="col text-center">
                <p className="custom-paragraph">UP Diliman is home to a vibrant and diverse ecosystem of hundreds of 
                  university organizations. <span className="ugnayan-text">UGNAYAN</span>'s aim is to streamline the 
                  process of discovering, learning about, applying, and engaging with them, empowering every 
                  student to find their perfect match within the UP Org community.</p>
              </div>
            </div>
          </div>
        </section>

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