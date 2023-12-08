import React from "react";
import { useState } from "react";
import CartCreditCardForm from "./CartCreditCardForm";
import CartSessions from "./CartSessions";

export default function Cart() {
  return (
    <div className="cart-container">
      <div className="cart-container-left">
        <CartSessions />

        <div className="cart-session-total-container">
          <div className="cart-session-total fs-5">Total</div>
          <div className="cart-session-amount fs-5">$35.00</div>
        </div>
      </div>
      <div className="cart-space"></div>
      <div className="cart-container-right">
        <CartCreditCardForm />
      </div>
    </div>
  );
}
