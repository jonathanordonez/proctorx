import React, { useState, useEffect, useMemo } from "react";
import passwordValidator from "password-validator";
import { registerNewStudent } from "../../utils";
import useCsrfToken from "../../Hooks/CSRFToken/useCsrfToken";
import { showToast } from "../../utils";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(true);
  const [isPasswordsMatch, setIsPasswordsMatch] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailEmpty, setIsEmailEmpty] = useState(true);
  const [isRegisterDisabled, setIsRegisterDisabled] = useState(true);
  const csrfToken = useCsrfToken();

  // Sets password restrictions
  const passwordSchema = useMemo(() => {
    const schema = new passwordValidator();
    schema.is().min(8); // Minimum length 8
    //Other options available:
    //   .is().max(100)
    //   .has().uppercase()
    //   .has().lowercase()
    //   .has().digits()
    //   .has().symbols()
    //   .has().not().spaces();

    return schema;
  }, []);

  // Enables/disables the Register button
  useEffect(() => {
    firstName && lastName && isEmailValid && isPasswordValid && isPasswordsMatch
      ? setIsRegisterDisabled(false)
      : setIsRegisterDisabled(true);
  }, [
    firstName,
    lastName,
    email,
    isPasswordValid,
    isPasswordsMatch,
    isEmailValid,
  ]);

  // Password validation
  useEffect(() => {
    setIsPasswordEmpty(!password ? true : false);
    setIsPasswordValid(passwordSchema.validate(password));
    password === password2
      ? setIsPasswordsMatch(true)
      : setIsPasswordsMatch(false);
  }, [password, password2, passwordSchema, isPasswordValid]);

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
        className={`form-control ${
          !isEmailValid && !isEmailEmpty ? "is-invalid" : ""
        }`}
        maxLength="50"
        autoFocus
        required
        id="id_email"
        onChange={(event) => handleEmail(event.target.value)}
        autoComplete="email"
        style={{ marginBottom: isEmailValid || isEmailEmpty ? "20px" : "0px" }}
      />
      {!isEmailValid && !isEmailEmpty && (
        <div className="invalid-feedback">Invalid email format</div>
      )}

      <label className="form-label fs-5" htmlFor="password1">
        Password
      </label>
      <input
        type="password"
        name="password1"
        value={password}
        autoComplete="new-password"
        className={`form-control ${
          !isPasswordValid && !isPasswordEmpty ? "is-invalid" : ""
        }`}
        required
        id="id_password1"
        aria-autocomplete="list"
        onChange={(event) => setPassword(event.target.value)}
        style={{
          marginBottom: isPasswordValid || isPasswordEmpty ? "" : "0px",
        }}
      />
      {!isPasswordValid && !isPasswordEmpty && (
        <div className="invalid-feedback">
          Password must contain at least 8 characters
        </div>
      )}

      <label className="form-label fs-5" htmlFor="password2">
        Password confirmation
      </label>
      <input
        type="password"
        name="password2"
        value={password2}
        autoComplete="new-password"
        className={`form-control ${
          !isPasswordsMatch && !isPasswordEmpty ? "is-invalid" : ""
        }`}
        required
        id="id_password2"
        onChange={(event) => setPassword2(event.target.value)}
        style={{
          marginBottom: isPasswordsMatch || isPasswordEmpty ? "" : "0px",
        }}
      />
      {!isPasswordsMatch && (
        <div className="invalid-feedback">Password doesn't match</div>
      )}

      <input
        type="submit"
        className="form-control fs-5"
        value="Register"
        disabled={isRegisterDisabled}
      />
    </form>
  );

  function handleEmail(email) {
    setEmail(email);
    setIsEmailEmpty(email ? false : true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValidRegex = emailRegex.test(email);
    setIsEmailValid(isEmailValidRegex ? true : false);
  }
  async function handleSubmit(event) {
    event.preventDefault();
    if (isRegisterDisabled) {
      return;
    }

    try {
      const response = await registerNewStudent(
        firstName,
        lastName,
        email,
        password,
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
    setPassword("");
    setPassword2("");
  }
}
