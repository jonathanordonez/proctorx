import React, { useState, useEffect } from "react";
import SessionHeader from "./SessionHeader";
import SessionRecord from "./SessionRecord";
import { fetchUpcomingSessions } from "../../../utils";
import { formatDateTimeString } from "../../../utils";
import { showToast } from "../../../utils";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const parameter = window.location.href.split("?");
    const is_session_added = true ? parameter[1] === "session-added" : false;
    if (is_session_added) {
      showToast("success", "Upcoming session added", 5);
      const updatedURL = window.location.href.replace("/?session-added", "");
      window.history.replaceState({}, "", updatedURL);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchUpcomingSessions();
        const json = await response.json();
        setSessions(json.upcoming_sessions);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="main-wrapper">
      <main className="scale-down">
        <div className="session-container">
          <SessionHeader />
          {sessions.length > 0 &&
            sessions.map((session) => (
              <SessionRecord
                date={formatDateTimeString(session.exam_date_time)}
                examName={session.exam_name}
                examLength={session.exam_length}
                status={session.session_status}
              />
            ))}
        </div>
      </main>
    </div>
  );
}
