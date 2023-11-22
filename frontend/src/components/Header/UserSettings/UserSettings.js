import React from "react";
import UserSettingsForm from "./UserSettingsForm";
import UserChangePasswordForm from "./UserChangePasswordForm";

export default function UserSettings() {
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
