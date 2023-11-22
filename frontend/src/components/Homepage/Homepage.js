import React from "react";
import Header from "../Header/Header";
import "../../css/styles.css";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";
import { Route, Routes } from "react-router-dom";
import UserSettings from "../Header/UserSettings/UserSettings";

export default function Homepage({
  setIsAuthenticated,
  setIsAuthenticatedInBackend,
}) {
  return (
    <>
      <Header
        setIsAuthenticated={setIsAuthenticated}
        setIsAuthenticatedInBackend={setIsAuthenticatedInBackend}
      />
      <Menu />
      <div>
        <div className="main-wrapper">
          <main className="scale-down">
            <Routes>
              <Route path="/user_settings" element={<UserSettings />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}
