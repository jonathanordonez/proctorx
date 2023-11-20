import React from "react";
import RegisterForm from "./RegisterForm";
import proctorXlogo from "../../img/proctorX.svg";
import { Link } from "react-router-dom";
import Toast from "../Toast/Toast";
import "../../css/styles-landing.css";

export default function Register() {
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
          <Toast />
          <h2>Register</h2>
          <RegisterForm />
          <hr />
          <div className="form-footer">
            <div>
              <Link className="fs-5" to="/">
                Sign In
              </Link>
            </div>
            <div>
              <Link className="fs-5" href="/change_password">
                Forgot Password?
              </Link>
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
