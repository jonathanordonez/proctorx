import React from "react";
import "../../css/styles-landing.css";
import proctorXlogo from "../../img/proctorX.svg";
import LoginForm from "./LoginForm";

export default function login() {
  return (
    <div className="main-wrapper">
      <main>
        <div className="logo">
          <img
            className="brand-img"
            alt="ProctorX Logo"
            src={proctorXlogo}
          ></img>
        </div>
        <div className="form-container">
          <h2>Sign In</h2>
          <LoginForm />
          <hr />
          <div className="form-footer">
            <div>
              <a className="fs-5" href="/register">
                Register
              </a>
            </div>
            <div>
              <a className="fs-5" href="/change_password">
                Forgot Password?
              </a>
            </div>
          </div>
        </div>
        <div className="login-footer">
          <h5>@2022 ProctorX, Inc.</h5>
        </div>
      </main>
    </div>
  );
}
