import { Link } from 'react-router-dom';
import logo from "../../assets/logo/onediliman_logo.png";
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
                <h1 className="display-1 ugnayan-text mb-0">OneDiliman </h1>
                <h3 className="gateway">UP Diliman's Org-Hub</h3>
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
                  university organizations. <span className="ugnayan-text">OneDiliman</span>'s aim is to streamline the 
                  process of discovering, learning, applying, and engaging with them, empowering every 
                  student to find their perfect match within the UP Org community.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="footer">
          <div className="container">
            <footer className="d-flex flex-column justify-content-center align-items-center py-3 my-4 border-top">
              <div className="d-flex flex-column align-items-center">
          <a href="/" className="mb-2 text-body-secondary text-decoration-none lh-1">
            <img src={logo} alt="" width="30" height="30"></img> <span className="text-body-secondary">&copy; 2024</span>
          </a>
              </div>
            </footer>
          </div>
        </section>
      </div>
    )
  }