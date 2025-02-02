import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LogIn.css";
import logo from "../../assets/logo/Ugnayan Logo circle wo name.png";
import showEye from "../../assets/eye.png";
import hideEye from "../../assets/hidden.png";
import emailIcon from "../../assets/user.png";
import passwordIcon from "../../assets/door-key.png";
import Navbar from "../../components/Navbar/Navbar";
import { Container, Form } from "react-bootstrap";
import { useAuth } from "../../contexts/authContext";
import { doSignInAsGuest, doSignInWithEmailAndPassword } from "../../firebase/auth";

export default function LogInPage() {
  const { userLoggedIn } = useAuth();

  // https://www.geeksforgeeks.org/how-to-show-and-hide-password-in-reactjs/
  // Used for showing and hiding password
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    email: false,
    password: false,
  });
  const [showErrorText, setShowErrorText] = useState({
    email: false,
    password: false,
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const ref = {
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const form = event.target;

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    try {
      await doSignInWithEmailAndPassword(formData);

      window.location.href = "/dashboard";
    } catch (e) {
      //alert(e.code)
      if (e.code === "auth/invalid-credential") {
        alert("Wrong password or username");
      } else if (e.code === "auth/too-many-requests") {
        alert("Too many requests. Please try again later");
      }
    }    
  };

  const handleGuest = async (event: any) => {
    await doSignInAsGuest();
    console.log("Signed in as guest");
    window.location.href = "/dashboard";
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
      <Navbar currentPage={"login"} />
      <div className="app-body">
      <div className="d-flex justify-content-center">
          <div className="app-login">
            <img src={logo} alt="Logo" className="login-logo"></img>
            <br></br>
            <h1>
              <b>Login</b>
            </h1>
            <br></br>
            Sign in using your UP mail account
            <br></br>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <div className="login-email-blank">
                  <div className="login-email-icon-box" style={style(error.email)}>
                    <img src={emailIcon} className="login-email-icon"></img>
                  </div>
                  <input
                    value={formData.email}
                    name="email"
                    type="email"
                    className="login-email-input"
                    placeholder="Email"
                    inputMode="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    style={style(error.email)}
                    ref={ref.email}
                    required
                  />
                </div>
                {showErrorText.email && (
                  <p role="alert" style={{ color: "rgb(157, 28, 36)" }}>
                    Please make sure you've properly entered your <b>UP Email</b>
                  </p>
                )}

                <div className="login-password-blank">
                  <div
                    className="login-password-icon-box"
                    style={style(error.password)}
                  >
                    <img src={passwordIcon} className="login-password-icon"></img>
                  </div>
                  <input
                    value={formData.password}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="login-password-input"
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
                    className="login-show-password"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={style(error.password)}
                  >
                    {showPassword ? (
                      <img
                        src={hideEye}
                        alt="Logo"
                        className="login-password-hide"
                      ></img>
                    ) : (
                      <img
                        src={showEye}
                        alt="Logo"
                        className="login-password-show"
                      ></img>
                    )}
                  </button>
                </div>
                {showErrorText.password && (
                  <p
                    className="error-message"
                    role="alert"
                    style={{ color: "rgb(157, 28, 36)" }}
                  >
                    Please make sure your password is{" "}
                    <b> at least 8 characters long</b>
                  </p>
                )}
                <button type="submit" className="login-button">
                  Log In
                </button>
              </Form.Group>
            </Form>
            <br></br>
            <a href="#" className="login-forget">
              Forgot your username or password?
            </a>
            <button className="login-guest" onClick={handleGuest}>Log in as a Guest</button>
            Some features will be unavailable with guest access.
          </div>
        </div>
      </div>
    </div>
  );
}
