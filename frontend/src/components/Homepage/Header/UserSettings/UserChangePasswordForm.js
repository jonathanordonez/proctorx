import React from "react";
import { useState, useEffect } from "react";
import usePasswordValidation from "../../../../Hooks/usePasswordValidation";
import { changePassword, showToast } from "../../../../utils";

export default function UserChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const passwordDetails = usePasswordValidation(password1, password2);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  console.log("passwordDetails:  ", passwordDetails);

  useEffect(() => {
    if (!isSubmitDisabled) {
      return;
    }
    window.scrollTo(0, 0);
  }, [isSubmitDisabled]);

  useEffect(() => {
    setIsSubmitDisabled(
      passwordDetails.password1.isValid && passwordDetails.password2.isValid
        ? false
        : true
    );
  }, [passwordDetails.password1.isValid, passwordDetails.password2.isValid]);

  return (
    <>
      <h4 id="change-password">Change Password</h4>
      <form className="change-password-form" onSubmit={handleChangePassword}>
        <label className="fs-5">Old password</label>
        <input
          type="password"
          name="old_password"
          autoComplete="current-password"
          className="form-control"
          required=""
          id="id_old_password"
          value={oldPassword}
          onChange={(event) => {
            setOldPassword(event.target.value);
          }}
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
          disabled={isSubmitDisabled}
        />
      </form>
    </>
  );
  async function handleChangePassword(e) {
    e.preventDefault();
    try {
      const response = await changePassword(oldPassword, password1);
      if (response.status === "success") {
        console.log("successful ");
        showToast("success", "Password updated", 5);
      } else {
        console.log("failure: ", response.details);
        showToast("failure", `Error: ${response.details} `, 5);
      }
    } catch (error) {
      showToast(
        "failure",
        "Unable to update password. Please try again later.",
        5
      );
    }
    setOldPassword("");
    setPassword1("");
    setPassword2("");
    setIsSubmitDisabled(true);
  }

  async function cleanFields() {}
}
