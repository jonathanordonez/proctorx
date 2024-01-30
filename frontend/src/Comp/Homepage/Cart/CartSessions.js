import React, { useState, useEffect, useContext } from "react";
import EmptyCartSvg from "../../../img/cart-empty.svg";
import {
  fetchCartSessions,
  deleteCartSession,
  showToast,
} from "../../../utils";
import { SessionsContext } from "../Homepage";

export default function CartSessions() {
  // const [cartSessions, setCartSessions] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const { sessionsContext } = useContext(SessionsContext);
  const { setSessionsContext } = useContext(SessionsContext);

  useEffect(() => {
    calculateCartTotal();

    function calculateCartTotal() {
      let total = 0;
      sessionsContext.cartSessions.data.map((session) => {
        total += Number(session.cost);
        return total;
      });
      setCartTotal(total);
    }
  }, [sessionsContext.cartSessions.data]);

  useEffect(() => {
    (async () => {
      await handleFetchCartSessions();

      async function handleFetchCartSessions() {
        try {
          if (sessionsContext.cartSessions.fetch === "yes") {
            const response = await fetchCartSessions();
            const json = await response.json();

            if (json.status === "success") {
              const newSessionsContext = {
                ...sessionsContext,
                cartSessions: {
                  data: json.cart_sessions,
                  fetch: "no",
                },
              };
              setSessionsContext(newSessionsContext);
            } else {
              showToast(
                "failure",
                "Unable to fetch cart sessions. Please try again later.",
                5
              );
            }
          }
        } catch (err) {
          console.error(
            "The following error occurred while fetching the cart sessions: ",
            err
          );
          showToast(
            "failure",
            "Unable to fetch cart sessions. Please try again later.",
            5
          );
        }
      }
    })();
  }, [refreshCounter]);

  return (
    <>
      {sessionsContext.cartSessions.data.length === 0 ? (
        <div className="cart-container-session-heading fs-4">
          Your cart is empty
        </div>
      ) : (
        <div className="cart-container-session-heading fs-4">Sessions</div>
      )}

      <div className="cart-container-left-sessions">
        {sessionsContext.cartSessions.data.length > 0 &&
          sessionsContext.cartSessions.data.map((session, key) => (
            <div key={key} sessionid={session.id} className="cart-session">
              <div className="cart-session-element">{session.exam_name}</div>
              <div className="cart-session-element">
                {session.exam_length + " hour(s)"}
              </div>
              <div className="cart-session-element cart-session-cost">
                {"$" + session.cost}
              </div>
              <div
                onClick={handleDeleteCartSession}
                className="cart-session-element btn btn-danger delete-from-cart"
              >
                Delete
              </div>
            </div>
          ))}

        {sessionsContext.cartSessions.data.length === 0 && (
          <div className="cart-container-left-sessions">
            <img className="cart-empty" src={EmptyCartSvg} alt="empty cart" />
          </div>
        )}
      </div>
      {sessionsContext.cartSessions.data.length > 0 && (
        <div className="cart-session-total-container">
          <div className="cart-session-total fs-5">Total</div>
          <div className="cart-session-amount fs-5">
            {"$" + cartTotal + ".00"}
          </div>
        </div>
      )}
    </>
  );

  async function handleDeleteCartSession(e) {
    const sessionId = e.target.parentElement.getAttribute("sessionid");
    try {
      const response = await deleteCartSession(sessionId);
      const json = await response.json();
      if (json.status === "success") {
        const cartSessionsOnly = sessionsContext.cartSessions.data;
        const newCartSessions = cartSessionsOnly.filter(
          (cartSession) => cartSession.id != sessionId
        );

        const newSessionsContext = {
          ...sessionsContext,
          cartSessions: {
            data: newCartSessions,
            fetch: "no",
          },
          cartItemNumber: {
            data: sessionsContext.cartItemNumber.data - 1,
            fetch: "yes",
          },
        };

        setSessionsContext(newSessionsContext);

        showToast("success", "Cart session deleted", 5);

        setRefreshCounter(refreshCounter + 1);
      } else {
        showToast(
          "failure",
          "Unable to delete cart session. Please try again later.",
          5
        );
      }
    } catch (err) {
      console.error(
        "The following error occurred while deleting the cart session: ",
        err
      );
      showToast(
        "failure",
        "Unable to delete cart session. Please try again later.",
        5
      );
    }
  }
}
