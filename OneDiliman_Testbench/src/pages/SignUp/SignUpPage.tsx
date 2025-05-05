
import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import SignUpStudentForm from "./SignUpStudentForm";
import SignUpOrganizationForm from "./SignUpOrganizationForm";
import "./SignUp.css";
import logo from "../../assets/logo/onediliman_logo.png";

export default function SignUpPage() {
  const [accountType, setAccountType] = useState("student");

  return (
    <div className="signup-page-wrapper">
      <Navbar currentPage="signin" />

      { 
      <div className="container signup-content">
        <div className="row">
          <div className="col-12 col-md-6 signup-form-column">
            <div className="account-type-toggle text-center">
              <button
                className={`toggle-btn ${accountType === "student" ? "active" : ""}`}
                onClick={() => setAccountType("student")}
              >
                Student
              </button>
              <button
                className={`toggle-btn ${accountType === "organization" ? "active" : ""}`}
                onClick={() => setAccountType("organization")}
              >
                Organization
              </button>
            </div>
            {accountType === "student" ? (
              <SignUpStudentForm />
            ) : (
              <SignUpOrganizationForm />
            )}
          </div>

          {
          <div className="col-12 col-md-6 signup-visual-column">
            <div className="visual-content text-center">
              <img src={logo} alt="Logo" className="visual-logo" />
              <h2 className="visual-heading">Welcome to OneDiliman</h2>
            </div>
          </div>
          }
        </div>
      </div>
    }
    </div>
  );
}
