import React, { useEffect } from "react";
import { useState } from "react";
import "../../css/styles-landing.css";
import proctorXlogo from "../../img/proctorX.svg";
import LoginForm from "./LoginForm";
import { Link } from "react-router-dom";
import Reservtions from "../Reservations/Reservtions";
import { isUserAuthenticated } from "../../utils";
import Loading from "../Loading/Loading";
import Toast from "../Toast/Toast";

export default function Login() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticatedInBackend, setIsAuthenticatedInBackend] = useState("");
  const [isBackendAuthenticationFinished, setIsBackendAuthenticationFinished] =
    useState(false);

  useEffect(() => {
    (async () => {
      const response = await isUserAuthenticated();
      setIsAuthenticatedInBackend(response.is_authenticated);
      setIsBackendAuthenticationFinished(true);
    })();
  }, []);

  return (
    <>
      {!isBackendAuthenticationFinished ? (
        <Loading />
      ) : isAuthenticated || isAuthenticatedInBackend ? (
        <Reservtions
          setIsAuthenticated={setIsAuthenticated}
          setIsAuthenticatedInBackend={setIsAuthenticatedInBackend}
        />
      ) : (
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
              <h2>Sign In</h2>
              <LoginForm setIsAuthenticated={setIsAuthenticated} />
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
      )}
    </>
  );
}
