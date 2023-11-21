import React from "react";
import Login from "./Login/Login";
import { Route, Routes } from "react-router-dom";
import Register from "./Register/Register";
import ChangePassword from "./ChangePassword/ChangePassword";
import UserSettings from "./Header/UserSettings/UserSettings";
import { UserDetailsContext } from "./Login/Login";

export default function App() {
  return (
    <>
      <UserDetailsContext.Provider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/change_password" element={<ChangePassword />} />
          <Route path="/user_settings" element={<UserSettings />} />
        </Routes>
      </UserDetailsContext.Provider>
    </>
  );
}
