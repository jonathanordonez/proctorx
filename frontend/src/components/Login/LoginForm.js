import React from "react";
import { useState } from "react";
import { signIn } from "../../utils";
import useCsrfToken from "../../Hooks/CSRFToken/useCsrfToken";
import { showToast } from "../../utils";

export default function LoginForm({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const csrfToken = useCsrfToken();

  return (
    <form onSubmit={handleSubmit}>
      <label className="form-label fs-5" htmlFor="email">
        Email
      </label>
      <input
        className="form-control"
        type="email"
        name="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <label className="form-label fs-5" htmlFor="password">
        Password
      </label>
      <input
        className="form-control"
        type="password"
        name="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <input className="form-control fs-5" type="submit" value="Login" />
    </form>
  );

  async function handleSubmit(event) {
    event.preventDefault();
    const signInFetch = await signIn(email, password, csrfToken);
    if (signInFetch.status === "success") {
      setIsAuthenticated(true);
    } else {
      showToast(
        "failure",
        "Please check your username and password and try again. If you've forgotten your password, you can reset it <a href='/reset_password'>here<a>."
      );
    }
    // setIsAuthenticated(signInFetch.status === "success" ? true : false);
  }
}
