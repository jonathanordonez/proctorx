import React from "react";
import { useEffect, useState } from "react";
import UserSettingsForm from "./UserSettingsForm";
import UserChangePasswordForm from "./UserChangePasswordForm";

export default function UserSettings({ refreshUserSettingsCounter }) {
  useEffect(() => {
    const parameter = window.location.href.split("?");
    if (parameter[1] === "change_password") {
      const updatedURL = window.location.href.replace("?change_password", "");
      window.history.replaceState({}, "", updatedURL);
      const changePasswordElement = document.getElementById("change-password");
      changePasswordElement.scrollIntoView({ behavior: "smooth" });
    }
  }, [refreshUserSettingsCounter]);

  return (
    <>
      <div className="settings-container">
        <h4>User Settings</h4>
        <UserSettingsForm />
        <UserChangePasswordForm />
      </div>
    </>
  );
}
