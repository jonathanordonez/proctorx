import React, { useState } from "react";
import Header from "./Header/Header";
import "../../css/styles.css";
import Footer from "./Footer/Footer";
import Menu from "./Menu/Menu";
import { Route, Routes } from "react-router-dom";
import UserSettings from "./Header/UserSettings/UserSettings";
import Sessions from "./Sessions/Sessions";
import Reservation from "./Reservation/Reservation";
import Cart from "./Cart/Cart";

export default function Homepage({
  setIsAuthenticated,
  setIsAuthenticatedInBackend,
}) {
  const [isScrollToChangePassword, setIsScrollToChangePassword] =
    useState(false);
  return (
    <>
      <Header
        setIsAuthenticated={setIsAuthenticated}
        setIsAuthenticatedInBackend={setIsAuthenticatedInBackend}
        setIsScrollToChangePassword={setIsScrollToChangePassword}
      />
      <Menu />
      <div>
        <div className="main-wrapper">
          <main className="scale-down">
            <Routes>
              <Route exact path="/" element={<Sessions />} />
              <Route
                path="/user_settings"
                element={
                  <UserSettings
                    isScrollToChangePassword={isScrollToChangePassword}
                  />
                }
              />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}
