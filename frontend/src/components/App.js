import React, { useEffect } from "react";
import Login from "./Login/Login";
import { useState } from "react";
import Register from "./Register/Register";
import ChangePassword from "./ChangePassword/ChangePassword";

export default function App() {
  const [componentRendered, setComponentRendered] = useState("Sign In");

  // useEffect(() => {
  //   setComponentRendered("login");
  //   console.log("this ");
  // }, []);

  return componentRendered === "Sign In" ? (
    <Login setComponentRendered={setComponentRendered} />
  ) : componentRendered === "Register" ? (
    <Register setComponentRendered={setComponentRendered} />
  ) : (
    <ChangePassword setComponentRendered={setComponentRendered} />
  );
}
