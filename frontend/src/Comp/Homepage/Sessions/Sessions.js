import React, { useEffect, useContext } from "react";
import SessionHeader from "./SessionHeader";
import SessionRecord from "./SessionRecord";
import { fetchUpcomingSessions } from "../../../utils";
import { formatDateTimeString } from "../../../utils";
import { showToast } from "../../../utils";
import { SessionsContext } from "../Homepage";
import { Link } from "react-router-dom";

export default function Sessions() {
  const { sessionsContext } = useContext(SessionsContext);
  const { setSessionsContext } = useContext(SessionsContext);

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
    console.log("thisss ");
    (async () => {
      if (sessionsContext.upcomingSessions.fetch === "yes") {
        try {
          const response = await fetchUpcomingSessions();
          const json = await response.json();
          if (json.status === "success") {
            const newSessionsContext = {
              ...sessionsContext,
              upcomingSessions: {
                data: json.upcoming_sessions,
                fetch: "no",
              },
            };
            setSessionsContext(newSessionsContext);
          } else {
            showToast("failure", "Failed to load sessions", 5);
          }
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }, [sessionsContext]);

  return (
    <div className="main-wrapper">
      <main className="scale-down">
        <div className="session-container">
          <SessionHeader />
          {sessionsContext.upcomingSessions.data.length > 0 &&
            sessionsContext.upcomingSessions.data.map((session, key) => (
              <SessionRecord
                key={key}
                date={formatDateTimeString(session.exam_date_time)}
                examName={session.exam_name}
                examLength={session.exam_length}
                status={session.session_status}
              />
            ))}
          {sessionsContext.upcomingSessions.data.length === 0 && (
            <div className="session-content-empty fs-5">
              <span>No upcoming sessions. </span>
              <Link to={"reservation"}>Reserve a session.</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
