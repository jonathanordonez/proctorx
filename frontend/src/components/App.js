import React from "react";
import Login from "./Login/Login";
import { Route, Routes } from "react-router-dom";
import Register from "./Register/Register";
import ChangePassword from "./ChangePassword/ChangePassword";
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/change_password" element={<ChangePassword />} />
      </Routes>
    </>
  );
}
