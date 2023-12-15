import React from "react";
import { useState } from "react";
import CartCreditCardForm from "./CartCreditCardForm";
import CartSessions from "./CartSessions";

export default function Cart() {
  const [isCartEmpty, setIsCartEmpty] = useState(false);
  return (
    <div className="cart-container">
      <div className="cart-container-left">
        <CartSessions setIsCartEmpty={setIsCartEmpty} />
      </div>
      <div className="cart-space"></div>
      <div className="cart-container-right">
        <CartCreditCardForm isCartEmpty={isCartEmpty} />
      </div>
    </div>
  );
}
