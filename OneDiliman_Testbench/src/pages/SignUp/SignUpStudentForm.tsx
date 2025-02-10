import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SignUp.css";
import showEye from "../../assets/eye.png";
import hideEye from "../../assets/hidden.png";
import logo from "../../assets/logo_placeholder.png";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";

export default function SignUpForm() {
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

  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    studentNo: false,
    college: false,
    course: false,
    email: false,
    password: false,
  });
  const [showErrorText, setShowErrorText] = useState({
    firstName: false,
    lastName: false,
    studentNo: false,
    college: false,
    course: false,
    email: false,
    password: false,
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentNo: "",
    college: "",
    course: "",
    email: "",
    password: "",
  });
  const ref = {
    firstName: useRef<HTMLInputElement>(null),
    lastName: useRef<HTMLInputElement>(null),
    studentNo: useRef<HTMLInputElement>(null),
    college: useRef<HTMLSelectElement>(null),
    course: useRef<HTMLSelectElement>(null),
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
      college: formData.college,
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
    }
  };

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

    if (name === "course") {
      event.target.style.color = "#000000";
    }

    if (name === "college") {
      setFormData({
        ...formData,
        college: value,
        course: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
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

  const coursesForSelectedCollege = formData.college
    ? collegeCourses[formData.college]
    : [];

  return (
    <div>
      <div className="card signup-form">
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
                style={style(error.lastName)}
                ref={ref.lastName}
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
                  College
                </option>
                {Object.keys(collegeCourses).map((college) => (
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
                name="course"
                value={formData.course}
                className="signup-input signup-select"
                onChange={handleChange}
                onBlur={handleBlur}
                style={style(error.course)}
                ref={ref.course}
                required
                disabled={!formData.college}
              >
                <option value="" disabled>
                  {formData.college ? "Course" : "Select College First"}
                </option>
                {coursesForSelectedCollege.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              {showErrorText.course && (
                <p role="alert" style={{ color: "rgb(157, 28, 36)" }}>
                  Please select your <b>Course</b>
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
              Create Account
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
