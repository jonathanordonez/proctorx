import React, { useState, useEffect, createContext } from "react";
import Header from "./Header/Header";
import "../../css/styles.css";
import Footer from "./Footer/Footer";
import Menu from "./Menu/Menu";
import { Route, Routes } from "react-router-dom";
import UserSettings from "./Header/UserSettings/UserSettings";
import Sessions from "./Sessions/Sessions";
import Reservation from "./Reservation/Reservation";
import Cart from "./Cart/Cart";
import Orders from "./Orders/Orders";

export const SessionsContext = createContext({});

export default function Homepage({
  setIsAuthenticated,
  setIsAuthenticatedInBackend,
}) {
  const [refreshUserSettingsCounter, setRefreshUserSettingsCounter] =
    useState(0);
  const [cartItemsQuantity, setCartItemsQuantity] = useState();
  const [sessionsContext, setSessionsContext] = useState({
    upcomingSessions: { data: [], fetch: "yes" },
    orders: { data: [], fetch: "yes" },
    cartSessions: { data: [], fetch: "yes" },
    cartItemNumber: { data: 0, fetch: "yes" },
  });

  useEffect(() => {
    fetchCartItemsQuantity();
  }, []);
  return (
    <>
      <Header
        setIsAuthenticated={setIsAuthenticated}
        setIsAuthenticatedInBackend={setIsAuthenticatedInBackend}
        setRefreshUserSettingsCounter={setRefreshUserSettingsCounter}
      />
      <Menu cartItemsQuantity={cartItemsQuantity} />
      <div>
        <div className="main-wrapper">
          <main className="scale-down">
            <Routes>
              <Route
                exact
                path="/"
                element={
                  <SessionsContext.Provider
                    value={{ sessionsContext, setSessionsContext }}
                  >
                    <Sessions />
                  </SessionsContext.Provider>
                }
              />
              <Route
                path="/user_settings"
                element={
                  <UserSettings
                    refreshUserSettingsCounter={refreshUserSettingsCounter}
                  />
                }
              />
              <Route path="/reservation" element={<Reservation />} />
              <Route
                path="/cart"
                element={
                  <SessionsContext.Provider
                    value={{ sessionsContext, setSessionsContext }}
                  >
                    <Cart />
                  </SessionsContext.Provider>
                }
              />
              <Route
                path="/order"
                element={
                  <SessionsContext.Provider
                    value={{ sessionsContext, setSessionsContext }}
                  >
                    <Orders />
                  </SessionsContext.Provider>
                }
              />
            </Routes>
          </main>
        </div>
        <Footer
          setIsAuthenticated={setIsAuthenticated}
          setIsAuthenticatedInBackend={setIsAuthenticatedInBackend}
        />
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
