import React from "react";

export default function SessionRecord({ examName, date, length, status }) {
  return (
    <ul class="session-content">
      <li class="session-attribute fs-6">{examName}</li>
      <li class="session-attribute fs-6">{date}</li>
      <li class="session-attribute fs-6">{length}</li>
      <li class="session-attribute fs-6">{status}</li>
    </ul>
  );
}
