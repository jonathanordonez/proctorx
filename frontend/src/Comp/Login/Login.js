import React, { useEffect, useState, createContext } from "react";
import "../../css/styles-landing.css";
import proctorXlogo from "../../img/proctorX.svg";
import LoginForm from "./LoginForm";
import Homepage from "../Homepage/Homepage";
import { isUserAuthenticatedInBackend } from "../../utils";
import Loading from "../Loading/Loading";
import ToastLanding from "../Toast/ToastLanding";

export const UserDetailsContext = createContext({});

export default function Login({ setComponentRendered }) {
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
        <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
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
              <ToastLanding></ToastLanding>
              <h2>Sign In</h2>
              <LoginForm setIsAuthenticated={setIsAuthenticated} />
              <hr />
              <div className="form-footer">
                <div>
                  <a className="fs-5" onClick={handleComponentRendered}>
                    Register
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
              <h5>@2024 ProctorX, Inc.</h5>
            </div>
          </main>
        </div>
      )}
    </>
  );
  function handleComponentRendered(e) {
    setComponentRendered(e.target.textContent);
  }
}
