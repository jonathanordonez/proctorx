import React, { useState, useEffect } from "react";
import SessionHeader from "./SessionHeader";
import SessionRecord from "./SessionRecord";
import { getSessions } from "../../../utils";
import { fetchUpcomingSessions } from "../../../utils";
import { formatDateTimeString } from "../../../utils";

export default function Sessions() {
  const [sessions, setSessions] = useState(getSessions());

  console.log("this sessions: ", sessions);

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
