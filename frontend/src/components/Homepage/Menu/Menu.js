import React from "react";

export default function Menu() {
  const cart_items_number = 10;
  return (
    <div className="student-options-panel-wrapper">
      <div className="student-options-panel scale-down fs-5">
        <div className="student-links">
          <button className="button-student-links">
            <span></span>
          </button>
          <div className="student-collapsed-links" hidden>
            <a className="student-collapsed-link" href="session">
              Current Sessions
            </a>
            <a className="student-collapsed-link" href="reservation">
              Reserve a Session
            </a>
            <a className="student-collapsed-link" href="order">
              My Orders
            </a>
          </div>
          <a className="session" href="session">
            Current Sessions
          </a>
          <a className="reserve" href="reservation">
            Reserve a Session
          </a>
          <a className="my-orders" href="order">
            My Orders
          </a>
        </div>
        <div className="student-cart-balance">
          <a className="cart" href="cart">
            Cart
          </a>
          <span className="student-cart-count">{cart_items_number}</span>
        </div>
      </div>
    </div>
  );
}
