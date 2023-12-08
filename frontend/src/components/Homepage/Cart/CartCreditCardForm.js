import React from "react";
import { useState } from "react";

export default function CartCreditCardForm() {
  const [cardName, setCardName] = useState("John Smith");
  const [cvv, setCvv] = useState("123");
  const [cardNumber, setCardNumber] = useState("4539 7889 2500 4444");
  const [cardMonth, setCardMonth] = useState("01");
  const [cardYear, setCardYear] = useState("2027");
  return (
    <>
      <div className="cc-title fs-4">Credit card details</div>
      <form className="cart-form">
        <label className="fs-5 cc-name-label" htmlFor="card-holder-name">
          Name on card
        </label>
        <label className="fs-5" htmlFor="cvv">
          CVV
        </label>
        <input
          className="form-control"
          type="text"
          placeholder="name on card"
          value={cardName}
          name="card-holder-name"
        />
        <input
          className="cc-cvv form-control"
          type="number"
          name="cvv"
          placeholder="cvv"
          value={cvv}
        />
        <label className="fs-5 cc-card-number-label" htmlFor="card-number">
          Card number
        </label>
        <label className="fs-5" htmlFor="month">
          Month
        </label>
        <label className="fs-5" htmlFor="year">
          Year
        </label>
        <input
          className="cc-number form-control"
          placeholder="card number"
          value={cardNumber}
          name="card-number"
        />

        <input
          className="cc-month form-control"
          type="number"
          placeholder="month"
          name="month"
          value={cardMonth}
        />

        <input
          className="cc-year form-control"
          type="number"
          placeholder="year"
          name="year"
          value={cardYear}
        />

        <input
          className="cc-submit btn btn-primary"
          type="submit"
          name="submit"
        />
      </form>
    </>
  );
}
