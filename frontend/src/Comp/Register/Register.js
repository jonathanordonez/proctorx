import React from "react";
import RegisterForm from "./RegisterForm";
import proctorXlogo from "../../img/proctorX.svg";
import "../../css/styles-landing.css";
import ToastLanding from "../Toast/ToastLanding";

export default function Register({ setComponentRendered }) {
  return (
    <div className="main-wrapper-landing">
      <main>
        <div className="logo-landing">
          <img alt="ProctorX Logo" src={proctorXlogo}></img>
        </div>

        <div className="form-container">
          <ToastLanding></ToastLanding>
          <h2>Register</h2>
          <RegisterForm />
          <hr />
          <div className="form-footer">
            <div>
              <a className="fs-5" onClick={handleComponentRendered}>
                Sign In
              </a>
            </div>
            <div>
              <a className="fs-5" onClick={handleComponentRendered}>
                Forgot Password?
              </a>
            </div>
          </div>
        </div>

        <div className="login-footer">
          <h5>@2024 ProctorX Inc.</h5>
        </div>
      </main>
    </div>
  );
  function handleComponentRendered(e) {
    setComponentRendered(e.target.textContent);
  }
}
