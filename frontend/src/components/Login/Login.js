import React, { useEffect, useState, createContext } from "react";
import "../../css/styles-landing.css";
import proctorXlogo from "../../img/proctorX.svg";
import LoginForm from "./LoginForm";
import { Link } from "react-router-dom";
import Homepage from "../Homepage/Homepage";
import { isUserAuthenticatedInBackend } from "../../utils";
import Loading from "../Loading/Loading";
import Toast from "../Toast/Toast";

export const UserDetailsContext = createContext({});

export default function Login() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticatedInBackend, setIsAuthenticatedInBackend] = useState("");
  const [isBackendAuthenticationFinished, setIsBackendAuthenticationFinished] =
    useState(false);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    (async () => {
      const response = await isUserAuthenticatedInBackend();
      setIsAuthenticatedInBackend(response.is_authenticated);
      setUserDetails(response.is_authenticated ? response : {});
      setIsBackendAuthenticationFinished(true);
    })();
  }, [isAuthenticated]);

  return (
    <>
      {!isBackendAuthenticationFinished ? (
        <Loading />
      ) : isAuthenticated || isAuthenticatedInBackend ? (
        <UserDetailsContext.Provider value={userDetails}>
          <Homepage
            setIsAuthenticated={setIsAuthenticated}
            setIsAuthenticatedInBackend={setIsAuthenticatedInBackend}
          />
        </UserDetailsContext.Provider>
      ) : (
        <div className="main-wrapper-landing">
          <main>
            <div className="logo-landing">
              <img alt="ProctorX Logo" src={proctorXlogo}></img>
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
