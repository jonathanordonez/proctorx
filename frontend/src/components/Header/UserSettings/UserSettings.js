import React from "react";
import { UserDetailsContext } from "../../Login/Login";
import { useContext } from "react";
import Header from "../Header";
import Footer from "../../Footer/Footer";

export default function UserSettings() {
  const userDetails = useContext(UserDetailsContext);
  return (
    <>
      <Header />
      <h3>Account Settings</h3>

      <div className="settings-container">
        <h4>User Settings</h4>
        <form method="POST" className="settings-form">
          <label className="fs-5">First name</label>
          {userDetails.first_name}
          <label className="fs-5">Last name</label>
          {userDetails.last_name}
          <label className="fs-5">Phone number</label>
          {userDetails.phone_number}
          <label className="fs-5">Street address</label>
          {userDetails.street_address}
          <label className="fs-5">City</label>
          {userDetails.city}
          <label className="fs-5">Province / State</label>
          {userDetails.state}
          <label className="fs-5">Country</label>
          {userDetails.country}
          <label className="fs-5">Postal code</label>
          {userDetails.postal_code}

          <input
            type="submit"
            value="Submit"
            name="Settings"
            className="form-control fs-5"
          />
        </form>

        <h4 id="change-password">Change Password</h4>
        <form className="change-password-form" method="POST">
          <label className="fs-5">Old password</label>
          <input type="password" />
          <label className="fs-5">New password</label>
          <input type="password" />
          <label className="fs-5">New password (again)</label>
          <input type="password" />

          <input
            type="submit"
            value="Change password"
            name="Change password"
            className="form-control fs-5"
          />
        </form>
      </div>
      <Footer />
    </>
  );
}
