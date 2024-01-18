import React from "react";
import { useState } from "react";
import ReservationForm from "./ReservationForm";
import ReservationResults from "./ReservationResults";

export default function Reservation() {
  const [reservationResults, setReservationResults] = useState({});

  return (
    <div className="reservation-container">
      <ReservationForm setReservationResults={setReservationResults} />
      <ReservationResults reservationResults={reservationResults} />
    </div>
  );
}
