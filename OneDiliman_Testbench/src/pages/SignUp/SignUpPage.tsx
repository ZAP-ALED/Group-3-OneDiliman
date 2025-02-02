import Navbar from '../../components/Navbar/Navbar';
import "bootstrap/dist/css/bootstrap.min.css";
import SignUpForm from "./SignUpForm";
import SignUpBackground from "./SignUpBackground";
import "./SignUp.css";
import logo from "../../assets/logo_placeholder.png";

export default function SignUpPage() {
  return (
    <div>
      <Navbar currentPage={"signin"} />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4 d-none d-md-block">
            <SignUpBackground />
          </div>
          <div className="col-md-8 ">
            <SignUpForm />
          </div>
          <img src={logo} alt="Logo" className="app-signup-logo" />
        </div>
      </div>
    </div>
  );
}
