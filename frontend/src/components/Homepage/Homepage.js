import React, { useState, useEffect } from "react";
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
  const [cartItemsQuantity, setCartItemsQuantity] = useState();

  useEffect(() => {
    fetchCartItemsQuantity();
  }, []);
  return (
    <>
      <Header
        setIsAuthenticated={setIsAuthenticated}
        setIsAuthenticatedInBackend={setIsAuthenticatedInBackend}
        setIsScrollToChangePassword={setIsScrollToChangePassword}
      />
      <Menu cartItemsQuantity={cartItemsQuantity} />
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
  async function fetchCartItemsQuantity() {
    const apiUrl = `${process.env.REACT_APP_PYTHONHOST}/cart_items_quantity`;
    try {
      const request = await fetch(apiUrl, { credentials: "include" });
      const json = await request.json();
      if (json.status === "success") {
        setCartItemsQuantity(json.cart_items_quantity);
      } else {
        console.error(
          "An error occurred when fetching the cart items quantity "
        );
      }
    } catch (error) {
      console.error(
        "The following error occurred when fetching the cart items quantity: ",
        error
      );
    }
  }
}
