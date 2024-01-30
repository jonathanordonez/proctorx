import React from "react";
import { Link, NavLink } from "react-router-dom";
import CartNumber from "./CartNumber";

export default function Menu({ cartItemsQuantity }) {
  return (
    <div className="student-options-panel-wrapper">
      <div className="student-options-panel scale-down fs-5">
        <div className="student-links">
          <button
            className="button-student-links"
            onClick={displayCollapsedLinks}
          >
            <span></span>
          </button>
          <div className="student-collapsed-links" hidden>
            <Link className="student-collapsed-link" to="/">
              Upcoming Sessions
            </Link>
            <Link className="student-collapsed-link" to="reservation">
              Reserve a Session
            </Link>
            <Link className="student-collapsed-link" to="order">
              My Orders
            </Link>
          </div>
          <NavLink className="session" to="/">
            Upcoming Sessions
          </NavLink>
          <NavLink className="reserve" to="reservation">
            Reserve a Session
          </NavLink>
          <NavLink className="my-orders" to="order">
            My Orders
          </NavLink>
        </div>
        <NavLink className="student-cart-balance" to="cart">
          <CartNumber></CartNumber>
        </NavLink>
      </div>
    </div>
  );
  function displayCollapsedLinks() {
    const links = document.getElementsByClassName("student-collapsed-links")[0];
    if (links.hidden === true) {
      links.hidden = false;
    } else {
      links.hidden = true;
    }
  }
}
