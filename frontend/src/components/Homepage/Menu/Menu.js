import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Menu({ cartItemsQuantity }) {
  const [activeMenuOption, setActiveMenuOption] = useState("");

  console.log("this ", cartItemsQuantity);
  return (
    <div className="student-options-panel-wrapper">
      <div className="student-options-panel scale-down fs-5">
        <div className="student-links">
          <button className="button-student-links">
            <span></span>
          </button>
          <div className="student-collapsed-links" hidden>
            <Link className="student-collapsed-link" to="/">
              Current Sessions
            </Link>
            <Link className="student-collapsed-link" to="reservation">
              Reserve a Session
            </Link>
            <Link className="student-collapsed-link" to="order">
              My Orders
            </Link>
          </div>
          <NavLink className="session" to="/">
            Current Sessions
          </NavLink>
          <NavLink className="reserve" to="reservation">
            Reserve a Session
          </NavLink>
          <NavLink className="my-orders" to="order">
            My Orders
          </NavLink>
        </div>
        <div className="student-cart-balance">
          <NavLink className="cart" to="cart">
            Cart
          </NavLink>
          <span className="student-cart-count">{cartItemsQuantity}</span>
        </div>
      </div>
    </div>
  );
}
