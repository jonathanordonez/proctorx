import React from "react";
import { useState } from "react";
import usePasswordValidation from "../../../Hooks/usePasswordValidation";

export default function UserChangePasswordForm() {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const passwordDetails = usePasswordValidation(password1, password2);

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
          className={`form-control ${
            !passwordDetails.password1.isValid && password1 ? "is-invalid" : ""
          }`}
          required=""
          id="id_new_password1"
          aria-autocomplete="list"
          style={{
            marginBottom:
              passwordDetails.password1.isValid || !password1 ? "" : "0px",
          }}
          value={password1}
          onChange={(event) => setPassword1(event.target.value)}
        />
        {!passwordDetails.password1.isValid && (
          <div
            className="invalid-feedback"
            style={{ gridColumn: 2, paddingLeft: "20px", marginBottom: "10px" }}
          >
            {passwordDetails.password1.description}
          </div>
        )}
        <label className="fs-5">New password (again)</label>
        <input
          type="password"
          name="new_password2"
          autoComplete="new-password"
          className={`form-control ${
            !passwordDetails.password2.isValid && password2 ? "is-invalid" : ""
          }`}
          required=""
          id="id_new_password2"
          style={{
            marginBottom:
              passwordDetails.password2.isValid || !password2 ? "" : "0px",
          }}
          value={password2}
          onChange={(event) => setPassword2(event.target.value)}
        />
        {passwordDetails.password2.isValid === false && (
          <div
            className="invalid-feedback"
            style={{ gridColumn: 2, paddingLeft: "20px", marginBottom: "10px" }}
          >
            {passwordDetails.password2.description}
          </div>
        )}

        <input
          type="submit"
          value="Change password"
          name="Change password"
          className="form-control fs-5"
          disabled={
            passwordDetails.password1.isValid &&
            passwordDetails.password2.isValid
              ? false
              : true
          }
        />
      </form>
    </>
  );
}
