import React from "react";

export default function Toast() {
  return (
    <div hidden className={`message-container`}>
      <div className="message-text fs-5"></div>
    </div>
  );
}
