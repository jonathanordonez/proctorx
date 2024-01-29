import React from "react";
import Login from "./Components/Login/Login";
import { useState } from "react";
import Register from "./Components/Register/Register";
import ChangePassword from "./Components/ChangePassword/ChangePassword";

export default function App() {
  const [componentRendered, setComponentRendered] = useState("Sign In");

  return componentRendered === "Sign In" ? (
    <Login setComponentRendered={setComponentRendered} />
  ) : componentRendered === "Register" ? (
    <Register setComponentRendered={setComponentRendered} />
  ) : (
    <ChangePassword setComponentRendered={setComponentRendered} />
  );
}
