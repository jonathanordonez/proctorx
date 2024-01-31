import React from "react";
import { useState, useContext, useEffect } from "react";
import CartCreditCardForm from "./CartCreditCardForm";
import CartSessions from "./CartSessions";
import { SessionsContext } from "../Homepage";

export default function Cart() {
  const { sessionsContext } = useContext(SessionsContext);

  return (
    <div className="cart-container">
      <div className="cart-container-left">
        <CartSessions />
      </div>
      <div className="cart-space"></div>
      <div className="cart-container-right">
        <CartCreditCardForm />
      </div>
    </div>
  );
}
