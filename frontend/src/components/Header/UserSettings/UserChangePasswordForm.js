import React from "react";

export default function UserChangePasswordForm() {
  return (
    <>
      <h4 id="change-password">Change Password</h4>
      <form className="change-password-form" method="POST">
        <label className="fs-5">Old password</label>
        <input
          type="password"
          name="old_password"
          autoComplete="old-password"
          className="form-control"
          required=""
          id="id_old_password"
        />
        <label className="fs-5">New password</label>
        <input
          type="password"
          name="new_password1"
          autoComplete="new-password"
          className="form-control"
          required=""
          id="id_new_password1"
          aria-autocomplete="list"
        />
        <label className="fs-5">New password (again)</label>
        <input
          type="password"
          name="new_password2"
          autoComplete="new-password"
          className="form-control"
          required=""
          id="id_new_password2"
        />

        <input
          type="submit"
          value="Change password"
          name="Change password"
          className="form-control fs-5"
        />
      </form>
    </>
  );
}
