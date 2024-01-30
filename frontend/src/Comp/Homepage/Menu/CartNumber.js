import React from "react";
import { useContext } from "react";
import { SessionsContext } from "../Homepage";

export default function CartNumber() {
  const { sessionsContext } = useContext(SessionsContext);
  return (
    <>
      <span className="cart">Cart</span>
      <span className="student-cart-count">
        {sessionsContext.cartItemNumber.data}
      </span>
    </>
  );
}
