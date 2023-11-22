import React, { useState } from "react";
import proctorXlogo from "../../img/proctorX-white.svg";
import { useContext } from "react";
import { UserDetailsContext } from "../Login/Login";
import { signOut } from "../../utils";
import { Link } from "react-router-dom";
import Toast from "../Toast/Toast";

export default function Header({
  setIsAuthenticated,
  setIsAuthenticatedInBackend,
}) {
  const userDetails = useContext(UserDetailsContext);
  const [isSettingsDropDownMenuVisible, setIsSettingsDropDownMenuVisible] =
    useState(false);

  console.log("cONTEXT: ", userDetails);

  return (
    <header>
      <div className="header-wrapper scale-down">
        <div>
          <a href="session">
            <img className="brand-img" alt="ProctorX Logo" src={proctorXlogo} />
          </a>
        </div>
        <Toast />
        <div className="user-settings fs-5" onClick={showSettings}>
          {userDetails.first_name}
        </div>

        {isSettingsDropDownMenuVisible && (
          <div className="user-settings-drop-down-menu">
            <Link className="dropdown-item" to="/user_settings">
              Account Settings
            </Link>
            <a
              className="dropdown-item"
              href="/student/settings#change-password"
            >
              Change Password
            </a>

            <div className="dropdown-divider"></div>
            <a
              className="dropdown-item"
              rel="nofollow"
              data-method="delete"
              href="/"
              onClick={logOut}
            >
              Logout
            </a>
          </div>
        )}
      </div>
    </header>
  );
  function showSettings() {
    setIsSettingsDropDownMenuVisible(
      isSettingsDropDownMenuVisible ? false : true
    );
  }
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
