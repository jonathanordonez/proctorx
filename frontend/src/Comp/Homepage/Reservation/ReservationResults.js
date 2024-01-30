import React, { useEffect } from "react";
import { useState } from "react";
import { saveToCart, showToast } from "../../../utils";
import useCsrfToken from "../../../Hooks/CSRFToken/useCsrfToken";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SessionsContext } from "../Homepage";

export default function ReservationResults({ reservationResults }) {
  const [isShowSchedules, setIsShowSchedules] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const csrfToken = useCsrfToken();
  const navigate = useNavigate();
  const { sessionsContext } = useContext(SessionsContext);
  const { setSessionsContext } = useContext(SessionsContext);

  useEffect(() => {
    if (!reservationResults || Object.keys(reservationResults).length === 0) {
      setIsShowSchedules(false);
      return;
    } else {
      setSchedules(calculateSchedules());
      setIsShowSchedules(true);
    }

    function calculateSchedules() {
      const options = getRandomOptions();
      const schedule1 = addMinutes(reservationResults.time, options[0]);
      const schedule2 = addMinutes(reservationResults.time, options[1]);
      const schedule3 = addMinutes(reservationResults.time, options[2]);
      const schedule4 = addMinutes(reservationResults.time, options[3]);

      return [schedule1, schedule2, schedule3, schedule4];
    }
  }, [reservationResults]);

  return (
    <div className="reservation-results">
      {isShowSchedules &&
        schedules.map((schedule, index) => (
          <div key={index} className="reservation-option fs-5">
            <p className="reservation-option-datetime">
              {reservationResults.dateTime + " "}
              {schedule} UTC-5
            </p>
            <p className="reservation-option-length">
              {reservationResults.length}
            </p>
            <button onClick={handleSaveToCart}>Select</button>
          </div>
        ))}
    </div>
  );

  function addMinutes(inputTime, minutesToAdd) {
    // Split the input time into hours and minutes
    const [hours, minutes] = inputTime.split(":").map(Number);

    // Calculate the total minutes
    const totalMinutes = hours * 60 + minutes + minutesToAdd;

    // Calculate the new hours and minutes
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;

    // Format the result as a time string
    const resultTime = `${String(newHours).padStart(2, "0")}:${String(
      newMinutes
    ).padStart(2, "0")}`;

    return resultTime;
  }

  function getRandomOptions() {
    const options = [30, 45, 60, 90, 120, -30, -45, -60, -90, -120];
    const chosenOptions = [];

    // Ensure that we have at least 4 unique options
    while (chosenOptions.length < 4) {
      const randomIndex = Math.floor(Math.random() * options.length);
      const randomOption = options[randomIndex];

      // Avoid duplicates
      if (!chosenOptions.includes(randomOption)) {
        chosenOptions.push(randomOption);
      }
    }

    chosenOptions.sort((a, b) => a - b);

    return chosenOptions;
  }

  async function handleSaveToCart(e) {
    const dateSelected = e.target.parentElement.getElementsByClassName(
      "reservation-option-datetime"
    )[0].textContent;

    const lengthSelected = e.target.parentElement.getElementsByClassName(
      "reservation-option-length"
    )[0].textContent;

    const university = document.getElementsByClassName(
      "form-option-university"
    )[0].value;
    const length = document.getElementsByClassName("form-option-exam")[0].value;

    try {
      const response = await saveToCart(
        dateSelected,
        lengthSelected,
        university,
        length,
        csrfToken
      );
      if (response.status === "success") {
        const newSessionsContext = {
          ...sessionsContext,
          cartSessions: {
            data: sessionsContext.cartSessions.data,
            fetch: "yes",
          },
          cartItemNumber: {
            data: sessionsContext.cartItemNumber.data + 1,
            fetch: "yes",
          },
        };

        setSessionsContext(newSessionsContext);

        navigate("/cart");
      }
    } catch (err) {
      showToast("failure", "Failed to add to cart", 5);
      console.error("The following error occurred: ", err);
    }
  }
}
