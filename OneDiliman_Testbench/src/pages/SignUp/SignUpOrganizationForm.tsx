import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SignUp.css";
import showEye from "../../assets/eye.png";
import hideEye from "../../assets/hidden.png";
import logo from "../../assets/logo_placeholder.png";
import { doCreateUserWithEmailAndPassword, doCreateOrgWithEmailAndPassword } from "../../firebase/auth";

export default function OrganizationSignUpForm() {
  const colleges = [
    "College of Architecture",
    "College of Arts and Letters",
    "Asian Institute of Tourism",
    "College of Business Administration",
    "School of Economics",
    "College of Education",
    "College of Engineering",
    "College of Fine Arts",
    "College of Home Economics",
    "College of Human Kinetics",
    "School of Library and Information Studies",
    "College of Mass Communication",
    "College of Music",
    "National College of Public Administration & Governance",
    "College of Science",
    "College of Social Sciences and Philosophy",
    "College of Social Work and Community Development",
    "School of Statistics",
  ];

  const organizationTypes = [
    "Academic Cluster",
    "Cause-Oriented Cluster",
    "Community Service Cluster",
    "Dormitory Association",
    "Fraternity",
    "Regional/Provincial Cluster",
    "Religious Cluster",
    "Sororities",
    "Special Interest",
    "Sports and Recreation Cluster",
    "Other"
  ];

  const [error, setError] = useState({
    organizationName: false,
    college: false,
    organizationType: false,
    email: false,
    password: false,
  });
  const [showErrorText, setShowErrorText] = useState({
    organizationName: false,
    college: false,
    organizationType: false,
    email: false,
    password: false,
  });
  const [formData, setFormData] = useState({
    organizationName: "",
    college: "",
    organizationType: "",
    email: "",
    password: "",
  });
  const ref = {
    organizationName: useRef<HTMLInputElement>(null),
    college: useRef<HTMLSelectElement>(null),
    organizationType: useRef<HTMLSelectElement>(null),
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const form = event.target;

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const userData = {
      ...formData,
      orgName: formData.organizationName,
      orgLocation: formData.college,
      orgScope: formData.organizationType,
      orgConnectedEmail: formData.email,
      orgPassword: formData.password,
    };

    console.log("Submitting userData: ",  userData);

    try {
      console.log("Final userData before function call:", userData);

      await doCreateOrgWithEmailAndPassword(userData);
      window.location.href = "/dashboard";
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        alert("Email is already in use");
      } else if (e.code === "auth/too-many-requests") {
        alert("Too many requests. Please try again later");
      }
    }
  };

  const handleBlur = (event: any) => {
    const { name } = event.target;
    if (!error[name]) {
      if (event.target.validity.patternMismatch && ref[name]?.current) {
        ref[name].current.focus();
        setError({
          ...error,
          [name]: true,
        });
        setShowErrorText({
          ...showErrorText,
          [name]: true,
        });
      }
    }
    if (error[name]) {
      setShowErrorText({
        ...showErrorText,
        [name]: false,
      });
    }
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });

    const newValueIsValid = !event.target.validity.patternMismatch;
    if (error[name]) {
      if (newValueIsValid) {
        setError({
          ...error,
          [name]: false,
        });
        setShowErrorText({
          ...showErrorText,
          [name]: false,
        });
      }
    }
  };

  const handleFocus = (event: any) => {
    const { name } = event.target;
    if (error[name]) {
      setShowErrorText({
        ...showErrorText,
        [name]: true,
      });
    }
  };

  function style(error: boolean) {
    if (error) {
      return {
        backgroundColor: "rgb(248, 215, 218)",
      };
    }
  }

  return (
    <div>
      <div className="card signup-form">
        <div className="card-body signup-inputs">
          <form className="needs-validation" onSubmit={handleSubmit}>
            <div className="signup-space">
              <input
                value={formData.organizationName}
                name="organizationName"
                type="text"
                className="form-control signup-input"
                placeholder="Organization Name"
                inputMode="text"
                pattern=".*"
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                style={style(error.organizationName)}
                ref={ref.organizationName}
                required
              />
              {showErrorText.organizationName && (
                <p role="alert" style={{ color: "rgb(157, 28, 36)" }}>
                  Please enter your organization's name.
                </p>
              )}
            </div>

            <div className="signup-space">
              <select
                name="college"
                value={formData.college}
                className="signup-input signup-select"
                onChange={handleChange}
                onBlur={handleBlur}
                style={style(error.college)}
                ref={ref.college}
                required
              >
                <option value="" disabled>
                  Select College
                </option>
                <option value="None">None</option>
                {colleges.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
              {showErrorText.college && (
                <p role="alert" style={{ color: "rgb(157, 28, 36)" }}>
                  Please select your <b>College</b>
                </p>
              )}
            </div>

            <div className="signup-space">
              <select
                name="organizationType"
                value={formData.organizationType}
                className="signup-input signup-select"
                onChange={handleChange}
                onBlur={handleBlur}
                style={style(error.organizationType)}
                ref={ref.organizationType}
                required
              >
                <option value="" disabled>
                  Organization Type
                </option>
                {organizationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {showErrorText.organizationType && (
                <p role="alert" style={{ color: "rgb(157, 28, 36)" }}>
                  Please select an <b>Organization Type</b>
                </p>
              )}
            </div>

            <div className="signup-space">
              <input
                value={formData.email}
                name="email"
                type="email"
                className="form-control signup-input"
                placeholder="Email"
                inputMode="text"
                pattern="[a-z]+[0-9]*@up\.edu\.ph"
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                style={style(error.email)}
                ref={ref.email}
                required
              />
              {showErrorText.email && (
                <p role="alert" style={{ color: "rgb(157, 28, 36)" }}>
                  Please make sure you've properly entered your <b>UP Email</b>
                </p>
              )}
            </div>

            <div className="signup-space">
              <div className="signup-password-blank">
                <input
                  value={formData.password}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="form-control signup-input-password"
                  placeholder="Password"
                  inputMode="text"
                  pattern=".{8}.*"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  style={style(error.password)}
                  ref={ref.password}
                  required
                />
                <button
                  type="button"
                  className="btn signup-show-password"
                  style={style(error.password)}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <img
                      src={hideEye}
                      alt="Hide Password"
                      className="signup-password-hide"
                    />
                  ) : (
                    <img
                      src={showEye}
                      alt="Show Password"
                      className="signup-password-show"
                    />
                  )}
                </button>
              </div>
              {showErrorText.password && (
                <p role="alert" style={{ color: "rgb(157, 28, 36)" }}>
                  Please make sure your password is{" "}
                  <b> at least 8 characters long</b>
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-primary create-acc-button">
              Create Organization Account
            </button>
            <br />
            <div className="signup-subtext">
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
