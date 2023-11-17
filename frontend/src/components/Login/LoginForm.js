import React from "react";
import { useState } from "react";
import { signIn } from "../../utils";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
  function handleSubmit(event) {
    event.preventDefault();
    signIn(email, password);
  }
}
