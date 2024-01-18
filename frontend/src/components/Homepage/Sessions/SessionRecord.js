import React from "react";

export default function SessionRecord({ examName, date, examLength, status }) {
  return (
    <ul className="session-content">
      <li className="session-attribute fs-6">{examName}</li>
      <li className="session-attribute fs-6">{date} UCT-5</li>
      <li className="session-attribute fs-6">{examLength} hour(s)</li>
      <li className="session-attribute fs-6">{status}</li>
    </ul>
  );
}
