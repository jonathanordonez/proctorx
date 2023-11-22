import React from "react";
import { useEffect } from "react";
import UserSettingsForm from "./UserSettingsForm";
import UserChangePasswordForm from "./UserChangePasswordForm";

export default function UserSettings({ isScrollToChangePassword }) {
  useEffect(() => {
    if (isScrollToChangePassword) {
      const changePasswordElement = document.getElementById("change-password");
      changePasswordElement.scrollIntoView({ behavior: "smooth" });
    }
  }, [isScrollToChangePassword]);

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
