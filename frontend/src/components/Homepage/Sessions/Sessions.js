import React, { useState, useEffect } from "react";
import SessionHeader from "./SessionHeader";
import SessionRecord from "./SessionRecord";
import { getSessions } from "../../../utils";

export default function Sessions() {
  const [sessions, setSessions] = useState(getSessions());

  // console.log("this activeMenuOption: ", activeMenuOption);

  return (
    <div className="main-wrapper">
      <main className="scale-down">
        <div className="session-container">
          <SessionHeader />
          {sessions.status === "success" &&
            sessions.data.length > 0 &&
            sessions.map((session) => {
              <SessionRecord
                date={session.exam_date_time}
                examName={session.exam_name}
                examLength={session.exam_length}
                status={session.session_status}
              />;
            })}
        </div>
      </main>
    </div>
  );
}
