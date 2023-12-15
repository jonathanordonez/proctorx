import React, { useState, useEffect } from "react";
import EmptyCartSvg from "../../../img/cart-empty.svg";
import {
  fetchCartSessions,
  deleteCartSession,
  showToast,
} from "../../../utils";

export default function CartSessions({ setIsCartEmpty }) {
  const [cartSessions, setCartSessions] = useState([]);
  const [cartTotal, setCartTotal] = useState();
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    calculateCartTotal();

    function calculateCartTotal() {
      let total = 0;
      cartSessions.map((session) => {
        total += session.cost * session.exam_length;
        return total;
      });
      setCartTotal(total);
    }
  }, [cartSessions]);

  useEffect(() => {
    (async () => {
      await handleFetchCartSessions();

      async function handleFetchCartSessions() {
        try {
          const response = await fetchCartSessions();
          const json = await response.json();
          if (json.status === "success") {
            setCartSessions(json.cart_sessions);
            if (json.cart_sessions.length > 0) {
              setIsCartEmpty(true);
            } else {
              setIsCartEmpty(false);
            }
          } else {
            showToast(
              "failure",
              "Unable to fetch cart sessions. Please try again later.",
              5
            );
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
      {cartSessions.length === 0 ? (
        <div className="cart-container-session-heading fs-4">
          Your cart is empty
        </div>
      ) : (
        <div className="cart-container-session-heading fs-4">Sessions</div>
      )}

      <div className="cart-container-left-sessions">
        {cartSessions.length > 0 &&
          cartSessions.map((session, key) => (
            <div key={key} sessionid={session.id} className="cart-session">
              <div className="cart-session-element">{session.exam_name}</div>
              <div className="cart-session-element">
                {session.exam_length + " hour(s)"}
              </div>
              <div className="cart-session-element cart-session-cost">
                {"$" + session.cost * session.exam_length + ".00"}
              </div>
              <div
                onClick={handleDeleteCartSession}
                className="cart-session-element btn btn-danger delete-from-cart"
              >
                Delete
              </div>
            </div>
          ))}

        {cartSessions.length === 0 && (
          <div className="cart-container-left-sessions">
            <img className="cart-empty" src={EmptyCartSvg} alt="empty cart" />
          </div>
        )}
      </div>
      {cartSessions.length > 0 && (
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
