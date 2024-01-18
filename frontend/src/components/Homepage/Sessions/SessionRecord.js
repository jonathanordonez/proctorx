import React from "react";

export default function SessionRecord({ examName, date, examLength, status }) {
  return (
    <ul class="session-content">
      <li class="session-attribute fs-6">{examName}</li>
      <li class="session-attribute fs-6">{date} UCT-5</li>
      <li class="session-attribute fs-6">{examLength} hour(s)</li>
      <li class="session-attribute fs-6">{status}</li>
    </ul>
  );
}
