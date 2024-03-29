import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import config from "dotenv";

if (process.env.REACT_APP_ENVIRONMENT === "production") {
  console.log = () => {};
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Router>
    <App />
  </Router>
);
