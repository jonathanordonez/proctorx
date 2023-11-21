import React from "react";
import proctorXlogo from "../../img/proctorX-white.svg";
import { useContext } from "react";
import { UserDetailsContext } from "../Login/Login";

export default function Header({ firstName }) {
  const userDetails = useContext(UserDetailsContext);
  return (
    <header>
      <div className="header-wrapper scale-down">
        <div className="logo">
          <a href="session">
            <img className="brand-img" alt="ProctorX Logo" src={proctorXlogo} />
          </a>
        </div>

        <div className="user-settings fs-5">{userDetails.first_name}</div>

        <div className="user-settings-drop-down-menu">
          <a className="dropdown-item" href="/student/settings">
            Account Settings
          </a>
          <a className="dropdown-item" href="/student/settings#change-password">
            Change Password
          </a>

          <div className="dropdown-divider"></div>
          <a
            className="dropdown-item"
            rel="nofollow"
            data-method="delete"
            href="/logout"
          >
            Logout
          </a>
        </div>
      </div>
    </header>
  );
}
