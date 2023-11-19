import React from "react";
import "../../css/styles-landing.css";
import proctorXlogo from "../../img/proctorX.svg";
import LoginForm from "./LoginForm";
import Register from "../Register/Register";
import { BrowserRouter as Routes, Route, Link } from "react-router-dom";

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
              <Link className="fs-5" to="/register">
                Register
              </Link>
            </div>
            <div>
              <Link className="fs-5" to="/change_password">
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
