import React from "react";
import { useState, useContext } from "react";
import { payCartSession } from "../../../utils";
import { showToast } from "../../../utils";
import { SessionsContext } from "../Homepage";
import { Link } from "react-router-dom";

export default function CartCreditCardForm({ isCartEmpty }) {
  const [cardName, setCardName] = useState("John Smith");
  const [cvv, setCvv] = useState("123");
  const [cardNumber, setCardNumber] = useState("4539 7889 2500 4444");
  const [cardMonth, setCardMonth] = useState("01");
  const [cardYear, setCardYear] = useState("2027");
  const { sessionsContext } = useContext(SessionsContext);
  const { setSessionsContext } = useContext(SessionsContext);

  return (
    <>
      {!isCartEmpty ? (
        <div className="cart-empy-make-reservation">
          <Link className="fs-4" to="/reservation">
            Make a new reservation
          </Link>
        </div>
      ) : (
        <>
          <div className="cc-title fs-4">Credit card details</div>
          <form className="cart-form" onSubmit={handleCreditCardForm}>
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
              onChange={(e) => setCardName(e.target.value)}
              name="card-holder-name"
            />
            <input
              className="cc-cvv form-control"
              type="number"
              name="cvv"
              placeholder="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
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
              onChange={(e) => setCardNumber(e.target.value)}
            />

            <input
              className="cc-month form-control"
              type="number"
              placeholder="month"
              name="month"
              value={cardMonth}
              onChange={(e) => setCardMonth(e.target.value)}
            />

            <input
              className="cc-year form-control"
              type="number"
              placeholder="year"
              name="year"
              value={cardYear}
              onChange={(e) => setCardYear(e.target.value)}
            />

            <input
              className="cc-form-submit fs-5 form-control"
              type="submit"
              name="submit"
            />
          </form>
        </>
      )}
    </>
  );
  async function handleCreditCardForm(e) {
    e.preventDefault();
    const cartSessions = Array.from(
      document.getElementsByClassName("cart-session")
    );
    const cartSessionId = cartSessions.map((session) =>
      session.getAttribute("sessionid")
    );
    try {
      const response = await payCartSession(cartSessionId);
      const json = await response.json();
      if (json.status === "success") {
        const newSessionsContext = {
          ...sessionsContext,
          upcomingSessions: {
            ...sessionsContext.upcomingSessions,
            fetch: "yes",
          },
          orders: {
            ...sessionsContext.orders,
            fetch: "yes",
          },
          cartSessions: {
            ...sessionsContext.cartSessions,
            fetch: "yes",
          },
        };
        setSessionsContext(newSessionsContext);

        window.location.href = "/?session-added";
      } else {
        showToast("failure", "Unable to pay cart. Please try again later.", 5);
      }
    } catch (error) {
      showToast("failure", "Unable to pay cart. Please try again later.", 5);
      console.error(error);
    }
  }
}
