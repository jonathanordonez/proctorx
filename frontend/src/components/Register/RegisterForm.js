import React, { useState } from "react";
import { registerNewStudent } from "../../utils";
import useCsrfToken from "../../Hooks/CSRFToken/useCsrfToken";
import { showToast } from "../../utils";
import usePasswordValidation from "../../Hooks/usePasswordValidation";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [isEmailValid, setIsEmailValid] = useState();
  // const [isEmailEmpty, setIsEmailEmpty] = useState();
  const passwordDetails = usePasswordValidation(password1, password2);
  const csrfToken = useCsrfToken();

  return (
    <form onSubmit={handleSubmit}>
      <label className="form-label fs-5" htmlFor="first_name">
        First name
      </label>
      <input
        type="text"
        name="first_name"
        value={firstName}
        className="form-control"
        maxLength="30"
        required
        id="id_first_name"
        onChange={(event) => setFirstName(event.target.value)}
      />

      <label className="form-label fs-5" htmlFor="last_name">
        Last name
      </label>
      <input
        type="text"
        name="last_name"
        value={lastName}
        className="form-control"
        maxLength="30"
        required
        id="id_last_name"
        onChange={(event) => setLastName(event.target.value)}
      />

      <label className="form-label fs-5" htmlFor="email">
        Email
      </label>
      <input
        type="text"
        name="email"
        value={email}
        className={`form-control ${!isEmailValid && email ? "is-invalid" : ""}`}
        maxLength="50"
        autoFocus
        required
        id="id_email"
        onChange={(event) => handleEmail(event.target.value)}
        autoComplete="email"
        style={{ marginBottom: isEmailValid || !email ? "20px" : "0px" }}
      />
      {!isEmailValid && email !== "" && (
        <div className="invalid-feedback">Invalid email format</div>
      )}

      <label className="form-label fs-5" htmlFor="password1">
        Password
      </label>
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
        <div className="invalid-feedback" style={{ marginBottom: "10px" }}>
          {passwordDetails.password1.description}
        </div>
      )}

      <label className="form-label fs-5" htmlFor="password2">
        Password confirmation
      </label>
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
        <div className="invalid-feedback" style={{ marginBottom: "10px" }}>
          {passwordDetails.password2.description}
        </div>
      )}

      <input
        type="submit"
        className="form-control fs-5"
        value="Register"
        disabled={
          passwordDetails.password1.isValid && passwordDetails.password2.isValid
            ? false
            : true
        }
      />
    </form>
  );

  function handleEmail(email) {
    setEmail(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValidRegex = emailRegex.test(email);
    setIsEmailValid(isEmailValidRegex ? true : false);
  }
  async function handleSubmit(event) {
    event.preventDefault();
    const submitButton = document.querySelector('input[type="submit"]');
    if (submitButton.disabled) {
      return;
    }

    try {
      const response = await registerNewStudent(
        firstName,
        lastName,
        email,
        password1,
        password2,
        csrfToken
      );
      console.log("this response: ", response);
      response.status === "successful"
        ? showToast("success", `Registered student: ${email} `)
        : showToast("failure", `Failed to register student: ${email} `);
    } catch (error) {
      showToast("failure", `Failed to register student: ${email} `);
    }
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword1("");
    setPassword2("");
  }
}
