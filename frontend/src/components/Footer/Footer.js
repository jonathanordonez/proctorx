import React from "react";

export default function Footer() {
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
              <a className="fs-6" href="/student/settings">
                Account Settings
              </a>
            </div>
            <div>
              <a className="fs-6" href="/student/settings#change-password">
                Change Password
              </a>
            </div>
            <div>
              <a className="fs-6" href="/logout">
                Logout
              </a>
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
            <p>© Copyright 2022</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
