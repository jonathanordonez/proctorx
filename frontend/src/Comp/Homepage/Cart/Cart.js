import React from "react";
import { useState, useContext, useEffect } from "react";
import CartCreditCardForm from "./CartCreditCardForm";
import CartSessions from "./CartSessions";
import { SessionsContext } from "../Homepage";

export default function Cart() {
  const [isCartEmpty, setIsCartEmpty] = useState(false);
  const { sessionsContext } = useContext(SessionsContext);

  useEffect(() => {
    if (sessionsContext.cartSessions.data.length > 0) {
      setIsCartEmpty(true);
    }
  }, [sessionsContext.cartSessions.data]);

  return (
    <div className="cart-container">
      <div className="cart-container-left">
        <CartSessions />
      </div>
      <div className="cart-space"></div>
      <div className="cart-container-right">
        <CartCreditCardForm isCartEmpty={isCartEmpty} />
      </div>
    </div>
  );
}
