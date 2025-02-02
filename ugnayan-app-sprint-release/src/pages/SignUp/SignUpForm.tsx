import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SignUp.css";
import showEye from "../../assets/eye.png";
import hideEye from "../../assets/hidden.png";
import logo from "../../assets/logo_placeholder.png";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";

export default function SignUpForm() {
  const courses = ["BS Chemical Engineering", "BS Civil Engineering", "BS Computer Science", "BS Computer Engineering", "BS Electronics Engineering", "BS Electrical Engineering", "BS Geodetic Engineering", "BS Industrial Engineering", "BS Mechanical Engineering", "BS Materials Engineering", "BS Metallurgical Engineering", "BS Mining Engineering"];

  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    studentNo: false,
    course: false,
    email: false,
    password: false,
  });
  const [showErrorText, setShowErrorText] = useState({
    firstName: false,
    lastName: false,
    studentNo: false,
    course: false,
    email: false,
    password: false,
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentNo: "",
    email: "",
    password: "",
    course: "",
  });
  const ref = {
    firstName: useRef<HTMLInputElement>(null),
    lastName: useRef<HTMLInputElement>(null),
    studentNo: useRef<HTMLInputElement>(null),
    course: useRef<HTMLInputElement>(null),
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

    // Include course in the data sent to the database function
    const userData = {
      ...formData,
      course: formData.course,
    };

    try {
      await doCreateUserWithEmailAndPassword(formData);

      window.location.href = "/dashboard";
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        alert("Email is already in use");
      } else if (e.code === "auth/too-many-requests") {
        alert("Too many requests. Please try again later");
      }
    };
    }

  const handleBlur = (event: any) => {
    const { name } = event.target;
    if (!(error as any)[name]) {
      if (event.target.validity.patternMismatch && (ref as any)[name].current) {
        (ref as any)[name].current.focus();
        setError({
          ...error,
          [name]: true,
        });
        setShowErrorText({
          ...error,
          [name]: true,
        });
      }
    }
    if ((error as any)[name]) {
      setShowErrorText({
        ...error,
        [name]: false,
      });
    }
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;

    if (name == "course") {
      event.target.style.color = "#000000";
    }

    const newValueIsValid = !event.target.validity.patternMismatch;
    if ((error as any)[name]) {
      if (newValueIsValid) {
        setError({
          ...error,
          [name]: false,
        });
        setShowErrorText({
          ...error,
          [name]: false,
        });
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFocus = (event: any) => {
    const { name } = event.target;
    if ((error as any)[name]) {
      setShowErrorText({
        ...error,
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
        <div className="card-title signup-text">Sign Up</div>
        <div className="card-title signup-subtext">
          Create an Ugnayan Account using your UP Mail
        </div>
        <div className="card-body signup-inputs">
          <form className="needs-validation" onSubmit={handleSubmit}>
            <div className="signup-space">
              <input
                value={formData.firstName}
                name="firstName"
                type="text"
                className="form-control signup-input"
                placeholder="First Name"
                inputMode="text"
                pattern=".*"
                onChange={handleChange}
                onBlur={handleBlur}
                style={style(error.firstName)}
                ref={ref.firstName}
                required
              />
            </div>

            <div className="signup-space">
              <input
                value={formData.lastName}
                name="lastName"
                type="text"
                className="form-control signup-input"
                placeholder="Last Name"
                inputMode="text"
                pattern=".*"
                onChange={handleChange}
                onBlur={handleBlur}
                style={style(error.firstName)}
                ref={ref.firstName}
                required
              />
            </div>

            <div className="signup-space">
              <input
                value={formData.studentNo}
                name="studentNo"
                type="text"
                className="form-control signup-input"
                placeholder="Student No."
                inputMode="decimal"
                pattern="[0-9]{9}"
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                style={style(error.studentNo)}
                ref={ref.studentNo}
                required
              />
              {showErrorText.studentNo && (
                <p role="alert" style={{ color: "rgb(157, 28, 36)" }}>
                  Please make sure you've properly entered your{" "}
                  <b>Student Number</b>
                </p>
              )}
            </div>

            <div className="signup-space">
              <select
                name="course"
                value={formData.course}
                className="signup-input signup-select"
                onChange={handleChange}
                onBlur={handleBlur}
                style={style(error.course)}
                required
              >
                <option selected disabled value="">
                  Course
                </option>
                {courses.map((course) => (
                  <option>{course}</option>
                ))}
              </select>
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
                      alt="Logo"
                      className="signup-password-hide"
                    ></img>
                  ) : (
                    <img
                      src={showEye}
                      alt="Logo"
                      className="signup-password-show"
                    ></img>
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
              Create Account
            </button>
            <br></br>
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
