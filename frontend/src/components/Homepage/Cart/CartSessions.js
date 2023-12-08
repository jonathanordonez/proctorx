import React, { useState, useEffect } from "react";
import { fetchCartSessions } from "../../../utils";

export default function CartSessions() {
  const [cartSessions, setCartSessions] = useState([""]);

  useEffect(() => {
    console.log("this cart sessions:", cartSessions);
  }, [cartSessions]);

  useEffect(() => {
    (async () => {
      await handleFetchCartSessions();

      async function handleFetchCartSessions() {
        try {
          console.log("fetching ");
          const response = await fetchCartSessions();
          const json = await response.json();
          if (json.status === "success") {
            console.log("t ", json.cart_sessions);
            setCartSessions(json.cart_sessions);
          } else {
            console.log("unsuccessful ");
          }
        } catch (err) {
          console.log("there was an error: ", err);
        }
      }
    })();
  }, []);

  return (
    <>
      <div className="cart-container-session-heading fs-4">Sessions</div>

      <div className="cart-container-left-sessions">
        {cartSessions.length > 0 &&
          cartSessions.map((session) => (
            <div sessionid={session.id} className="cart-session">
              <div className="cart-session-element">{session.exam}</div>
              <div className="cart-session-element">
                {session.length + " hour(s)"}
              </div>
              <div className="cart-session-element cart-session-cost">
                {"$" + session.cost * session.length + ".00"}
              </div>
              <div className="cart-session-element btn btn-danger delete-from-cart">
                Delete
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
