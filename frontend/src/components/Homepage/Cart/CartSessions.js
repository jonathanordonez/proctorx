import React from "react";

export default function CartSessions() {
  return (
    <>
      <div className="cart-container-session-heading fs-4">Sessions</div>

      <div className="cart-container-left-sessions">
        <div sessionid="80" className="cart-session">
          <div className="cart-session-element">Web Programming I</div>
          <div className="cart-session-element">1 hour(s)</div>
          <div className="cart-session-element cart-session-cost">$35.00</div>
          <div className="cart-session-element btn btn-danger delete-from-cart">
            Delete
          </div>
        </div>
      </div>
    </>
  );
}
