import React from "react";
import { useState, useEffect } from "react";
import { showToast } from "../../../utils";

export default function ReservationForm({ setReservationResults }) {
  const [universitySelectStyle, setUniversitySelectStyle] = useState({
    fontStyle: "italic",
    color: "#888",
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const [submitValue, setSubmitValue] = useState("Search Available Schedules");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [university, setUniversity] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [time, setTime] = useState("");
  const [exam, setExam] = useState("Web Programming I - Final");
  const [length, setLength] = useState("1 hour");

  useEffect(() => {
    if (university && dateTime && time && exam && length) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [university, dateTime, time, exam, length]);

  useEffect(() => {
    console.log("this dateTime: ", dateTime, typeof dateTime);
  }, [dateTime]);

  return (
    <form className="reservation-form" onSubmit={handleSubmitForm}>
      <div className="reservation-form-option">
        <label className="fs-5" htmlFor="university">
          University
        </label>

        <select
          className="form-option-university form-select"
          type="text"
          name="university"
          style={universitySelectStyle}
          disabled={isDisabled}
          value={university}
          onChange={(e) => {
            setUniversitySelectStyle(
              !e.target.value
                ? { fontStyle: "italic", color: "#888" }
                : { fontStyle: "normal", color: "black" }
            );
            setUniversity(e.target.value);
          }}
        >
          <option className="option-placeholder" value="">
            Select your university
          </option>
          <option value="University of the Opal Berry Village">
            University of the Opal Berry Village
          </option>
          <option className="xyz" value="Rose Hills University">
            Rose Hills University
          </option>
          <option value="Estate of Lemzilville University">
            Estate of Lemzilville University
          </option>
        </select>
      </div>
      <div className="reservation-form-option">
        <label className="fs-5" htmlFor="date">
          Date
        </label>

        <input
          className="form-option-date form-control"
          type="date"
          name="date"
          disabled={isDisabled}
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />
      </div>
      <div className="reservation-form-option">
        <label className="fs-5" htmlFor="time">
          Time
        </label>

        <input
          className="form-option-time form-control"
          type="time"
          name="time"
          disabled={isDisabled}
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <div className="reservation-form-option">
        <label className="fs-5" htmlFor="exam">
          Exam
        </label>

        <select
          className="form-option-exam form-select"
          type="text"
          name="exam"
          disabled={isDisabled}
          value={exam}
          onChange={(e) => setExam(e.target.value)}
        >
          <option value="Web Programming I">Web Programming I - Final</option>
          <option value="Systems Analysis and Design">
            Systems Analysis and Design - Midterm
          </option>
        </select>
      </div>
      <div className="reservation-form-option">
        <label className="fs-5" htmlFor="exam-length">
          Length
        </label>

        <select
          className="form-option-length form-select"
          type="text"
          name="exam-length"
          disabled={isDisabled}
          value={length}
          onChange={(e) => setLength(e.target.value)}
        >
          <option value="1 hour">1 hour</option>
          <option value="2 hours">2 hours</option>
          <option value="3 hours">3 hours</option>
        </select>
      </div>
      <div className="registration-form-submit-container">
        <div className="registration-form-submit-container-2">
          <input
            className="registration-form-submit fs-5 form-control"
            type="submit"
            value={submitValue}
            name="postOption"
            disabled={isSubmitDisabled}
          />
        </div>
      </div>
    </form>
  );
  function handleSubmitForm(e) {
    e.preventDefault();
    const date = document.querySelector("input[type='date']").value;

    const utcMinus5Date = new Date(`${date}, 12:00:00 PM`);

    if (new Date(utcMinus5Date) <= new Date()) {
      showToast("failure", "Please select a date in the future", 5);
      return;
    }

    const university = document.getElementsByClassName(
      "form-option-university"
    )[0].value;
    const dateTime =
      document.getElementsByClassName("form-option-date")[0].value;
    const time = document.getElementsByClassName("form-option-time")[0].value;
    const exam = document.getElementsByClassName("form-option-exam")[0].value;
    const length =
      document.getElementsByClassName("form-option-length")[0].value;

    if (isDisabled) {
      setIsDisabled(false);
      setSubmitValue("Search Available Schedules");
      setReservationResults({});
    } else {
      setIsDisabled(true);
      setSubmitValue("Edit Reservation Details");
      setReservationResults({
        university: university,
        dateTime: dateTime,
        time: time,
        exam: exam,
        length: length,
      });
    }
  }
}
