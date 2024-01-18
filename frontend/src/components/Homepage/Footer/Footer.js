import React from "react";
import { Link } from "react-router-dom";
import { signOut } from "../../../utils";

export default function Footer({
  setIsAuthenticated,
  setIsAuthenticatedInBackend,
}) {
  return (
    <div className="footer-wrapper">
      <footer className="scale-down">
        <div className="footer-options">
          <h4>ProctorX</h4>
          <div className="footer-sub-options fs-5">
            <div>
              <a className="no-redirection fs-6">About</a>
            </div>
            <div>
              <a className="no-redirection fs-6">Privacy Policy</a>
            </div>
            <div>
              <a className="no-redirection fs-6">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="footer-options">
          <h4>My Account</h4>
          <div className="footer-sub-options fs-5">
            <div>
              <Link className="fs-6" to="/user_settings">
                Account Settings
              </Link>
            </div>
            <div>
              <Link className="fs-6" to="/user_settings">
                Change Password
              </Link>
            </div>
            <div>
              <button className="fs-6" onClick={logOut}>
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="footer-options">
          <h4>Support</h4>
          <div className="footer-sub-options fs-5">
            <div>
              <a className="no-redirection fs-6">Support</a>
            </div>
            <div>
              <a className="no-redirection fs-6">URL Redirection Service</a>
            </div>
            <div>
              <a className="no-redirection fs-6">Test Your Equipment</a>
            </div>
            <div>
              <a className="no-redirection fs-6">Resource Center</a>
            </div>
          </div>
        </div>
        <div className="footer-options">
          <div className="footer-icons">
            <a>
              <span className="fab fa-twitter fa-xl"></span>
            </a>
            <a>
              <span className="fab fa-facebook fa-xl"></span>
            </a>
          </div>
          <div className="footer-signature">
            <p>ProctorX, Inc. All rights reserved.</p>
            <p>© Copyright 2024</p>
          </div>
        </div>
      </footer>
    </div>
  );
  async function logOut() {
    const fetchStatus = await signOut();
    if (fetchStatus === "success") {
      setIsAuthenticated(false);
      setIsAuthenticatedInBackend(false);
    } else {
      // errro handling
      // Toast
    }
  }
}
