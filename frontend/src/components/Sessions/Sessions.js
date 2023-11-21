import React from "react";
import { signOut } from "../../utils";
import "../../css/styles.css";

export default function Sessions({
  setIsAuthenticated,
  setIsAuthenticatedInBackend,
}) {
  const cart_items_number = 10;
  return (
    <>
      {/* <div>Sessions</div>;<button onClick={logOut}>Logout</button> */}
      <div>
        <div className="student-options-panel-wrapper">
          <div className="student-options-panel scale-down fs-5">
            <div className="student-links">
              <button className="button-student-links">
                <span></span>
              </button>
              <div className="student-collapsed-links" hidden>
                <a className="student-collapsed-link" href="session">
                  Current Sessions
                </a>
                <a className="student-collapsed-link" href="reservation">
                  Reserve a Session
                </a>
                <a className="student-collapsed-link" href="order">
                  My Orders
                </a>
              </div>
              <a className="session" href="session">
                Current Sessions
              </a>
              <a className="reserve" href="reservation">
                Reserve a Session
              </a>
              <a className="my-orders" href="order">
                My Orders
              </a>
            </div>
            <div className="student-cart-balance">
              <a className="cart" href="cart">
                Cart
              </a>
              <span className="student-cart-count">{cart_items_number}</span>
            </div>
          </div>
        </div>

        <div className="main-wrapper">
          <main className="scale-down">
            {/* Render your React components or content here */}
          </main>
        </div>

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
      </div>
    </>
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
