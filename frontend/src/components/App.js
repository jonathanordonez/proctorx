import React from "react";
import Login from "./Login/Login";
import Homepage from "./Homepage/Homepage";
import { useState } from "react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? <Homepage /> : <Login />;
}
