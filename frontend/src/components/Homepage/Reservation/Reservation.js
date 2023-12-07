import React from "react";
import { useEffect, useState } from "react";
import ReservationForm from "./ReservationForm";
import ReservationResults from "./ReservationResults";

export default function Reservation() {
  const [reservationResults, setReservationResults] = useState({});

  // Highlight selected option upon loading it
  useEffect(() => {
    const sessionMenuObject = document.getElementsByClassName("reserve ")[0];
    sessionMenuObject.className = "session student-link-selected";
  }, []);

  return (
    <div className="reservation-container">
      <ReservationForm setReservationResults={setReservationResults} />
      <ReservationResults reservationResults={reservationResults} />
    </div>
  );
}
