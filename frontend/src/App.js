import React from "react";
import Login from "./Comp/Login/Login";
import { useState } from "react";
import Register from "./Comp/Register/Register";
import ChangePassword from "./Comp/ChangePassword/ChangePassword";

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
